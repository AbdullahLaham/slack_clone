import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Doc, Id } from "./_generated/dataModel";
import { count, timeStamp } from "console";
import { paginationOptsValidator } from "convex/server";
import { channel } from "diagnostics_channel";

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
    return ctx.db.query('members').withIndex('by_workspace_id_user_id', (q) => q.eq("workspaceId", workspaceId).eq("userId", userId),).unique()
}
// replies of a message
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    // all messages that replies to this message
    const messages = await ctx.db.query("messages").withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId)).collect();
    if (messages.length == 0) return {
        count: 0, // number of replies
        image: undefined, // the last user was replied
        timestamp: 0 // the last reply timestamp
    }
    const lastmessage = messages[messages.length - 1];
    let lastreplyer = await populateMember(ctx, lastmessage.memberId);
    if (!lastreplyer) {
        return {
            count: messages.length, // number of replies
            image: undefined, // the last user was replied
            timestamp: 0 // the last reply timestamp
        }
    }
    let lastMessageuser = await populateUser(ctx, lastreplyer.userId);

    return {
        count: messages.length, // number of replies
        image: lastMessageuser?.image, // the last user was replied
        timestamp: lastmessage._creationTime // the last reply timestamp
    }
    

}
const populateReactions = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    return ctx.db.query("reactions").withIndex("by_message_id", (q) => q.eq("messageId", messageId)).collect()
}
const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
    return ctx.db.get(userId)
}
const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
    return ctx.db.get(memberId)
}
export const update = mutation({
    args: {id: v.id("messages"), body: v.string()},
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized")
        }
        
        
        const message = await ctx.db.get(args.id);
        if (!message) throw new Error('message not found');

            const member = await getMember(ctx, message.workspaceId, userId);
        if (!member || member._id !== message.memberId) throw new Error("Unauthorized");
        
        const id = await ctx.db.patch(args.id ,{
            body: args.body,
            updatedAt: Date.now(),
        })

        return id;
    }
})
export const remove = mutation({
    args: {id: v.id("messages")},
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized")
        }
        
        
        const message = await ctx.db.get(args.id);
        if (!message) throw new Error('message not found');

        const member = await getMember(ctx, message.workspaceId, userId);
        if (!member || member._id !== message.memberId) throw new Error("Unauthorized");
        
        const id = await ctx.db.delete(args.id)

        return id;
    }
})
export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id('workspaces'),
        conversationId: v.optional(v.id("conversations")),
        channelId: v.optional(v.id('channels')),
        parentMessageId: v.optional(v.id("messages")),
        
    },
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized")
        }
        const member = await getMember(ctx, args.workspaceId, userId);
        if (!member) throw new Error("unauthorized");

        let _conversationId = args.conversationId;
        // only possible if we replying in 1:1 conversation

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);
            if (!parentMessage) {
                throw new Error("parent message not found")
            }
            _conversationId = parentMessage.conversationId;
        }

        const id = await ctx.db.insert("messages" ,{
            body: args.body,
            image: args.image,
            memberId: member?._id,
            workspaceId: args.workspaceId,
            channelId: args.channelId,
            parentMessageId: args.parentMessageId,
            conversationId: _conversationId,
        })

        return id;
    }
})

export const get = query({
    args: {
        workspaceId: v.optional(v.id('workspaces')),
        conversationId: v.optional(v.id("conversations")),
        channelId: v.optional(v.id('channels')),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator
        
    },
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized")
        }
        let _conversationId = args.conversationId;

        // const member = await getMember(ctx, args.workspaceId, userId);
        // if (!member) throw new Error("unauthorized");

        // only possible if we replying in 1:1 conversation

        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId);
            if (!parentMessage) {
                throw new Error("Parent message not found")
            }
            _conversationId = parentMessage.conversationId;
        }

        const results = await ctx.db.query("messages").withIndex('by_channel_id_parent_message_id_conversation_id', (q) => q.eq("channelId", args.channelId).eq("parentMessageId", args.parentMessageId).eq("conversationId", _conversationId)).order("desc")
        .paginate(args.paginationOpts)
        
        return {
            ...results,
            page: (
                await Promise.all(
                    results.page.map(async (message) => {
                        const member = await populateMember(ctx, message.memberId);
                        const user = member ? await populateUser(ctx, member?.userId) : null;
                        if (!user || !member) return null;
                        const reactions = await populateReactions(ctx, message._id);
                        const thread = await populateThread(ctx, message._id);
                        const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;
                        const reactionsWtihCount = reactions.map((reaction) => {
                            return {
                                ...reaction,
                                count: reactions.filter((r) => r.value == reaction.value).length
                            }
                        });
                        // convers the "reactionsWtihCount" to the value in the acc witch deletes the duplicates depending on the value of the reaction 
                        const dedupedReactions = reactionsWtihCount.reduce((acc, reaction) => {
                            const existingReaction = acc.find((r) => r.value == reaction.value);
                            if (existingReaction) {
                                existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]))
                            } else {
                                acc.push({...reaction, memberIds: [reaction.memberId]})
                            }
                            return acc;


                        }, [] as (Doc<"reactions"> & {
                            count: number,
                            memberIds: Id<"members">[]
                        })[]
                    );
                    const reactionWithoutMemberidProperty = dedupedReactions.map(({memberId, ...reaction}) => reaction)
                    return {
                        ...message,
                        member,
                        user,
                        reactions: reactionWithoutMemberidProperty,
                        threadCound: thread.count,
                        threadImage: thread.image,
                        threadTimestamp: thread.timestamp,


                    }



                    })
                )
            ).filter((message) => message !== null)

        };
    }
})