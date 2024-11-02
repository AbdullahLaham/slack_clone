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

export const toggle = mutation({
    args: {
        value: v.string(),
        messageId: v.id('messages'),
        
    },
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized")
        }
        const message = await ctx.db.get(args.messageId);
        if (!message) throw new Error('message not found');

        const member = await getMember(ctx, message.workspaceId, userId);
        if (!member || member._id !== message.memberId) throw new Error("Unauthorized");
        const existingReactionFromUser = await ctx.db.query("reactions")
        .filter((q) => q.and(
            q.eq(q.field('messageId'), args.messageId),
            q.eq(q.field('memberId'), member._id),
            q.eq(q.field('value'), args.value),
        )).first();
        if (existingReactionFromUser) {
            const id = await ctx.db.delete(existingReactionFromUser._id);
            return id
        } else {
            const id = await ctx.db.insert("reactions", {
                memberId: member._id,
                messageId: args.messageId,
                value: args.value,
                workspaceId: message.workspaceId,
        });
            return id;
        }

        
    }
})
