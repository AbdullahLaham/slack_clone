import { error } from 'console';
import {mutation, query} from './_generated/server';
import { auth } from './auth';
import { v } from 'convex/values';

const generateCode = () => {
    const code = Array.from({length: 6}, () => "0123456789abcdefghigklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]).join("")
    return code;
}
let joinCode = generateCode();
export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async(ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }


        const id = await ctx.db.insert("workspaces", {
            name: args.name,
            joinCode,
            userId
        });
        await ctx.db.insert("members" ,{
            userId,
            workspaceId: id,
            role: 'admin',
        })
        await ctx.db.insert("channels", {
            name: "general",
            workspaceId: id,
        })
        return id;
    }
})
export const get = query({
    args: {},
    handler: async(ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return []
        }
        const members = await ctx.db.query('members').withIndex('by_user_id', (q) => q.eq("userId", userId))
        .collect();
        const workspaceIds = members.map((member) => member.workspaceId);
        const workspaces = [];

        for (const id of workspaceIds) {
            const workspace = await ctx.db.get(id)
            if (workspace) {
                workspaces.push(workspace)
            }
            

        }



        return workspaces;
    }
});

export const getInfoById = query({
    args: {id: v.id('workspaces')},
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId),)
        .unique()

        let workspace = await ctx.db.get(args.id);
        return {
            name: workspace?.name,
            isMember: !!member
        }
    }
});
export const getById = query({
    args: {id: v.id('workspaces')},
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId),)
        .unique()
        if (!member) return null;
        
        return await ctx.db.get(args.id);
    }
});

export const update = mutation({
    args: {
        id: v.id('workspaces'),
        name: v.string(),
    },
    handler: async (ctx, args) => {

        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId),)
        .unique();

        if (!member || member.role !== 'admin') throw new Error("Unauthorized");
        await ctx.db.patch(args.id, {name: args.name});
        return args.id
        
    }
})

export const remove = mutation({
    args: {
        id: v.id('workspaces'),
    },
    handler: async (ctx, args) => {

        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId),)
        .unique();

        if (!member || member.role !== 'admin') throw new Error("Unauthorized");
        const [members] = await Promise.all([
            ctx.db.query('members').withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.id)).collect()

        ])
        for (const member of members) {
            await ctx.db.delete(member._id)
        }
        await ctx.db.delete(args.id);
        return args.id
        
    }
});

export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    }, handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId),)
        .unique();

        const joinCode = generateCode();

        if (!member || member.role !== 'admin') throw new Error("Unauthorized");

        await ctx.db.patch(args.workspaceId, {
            joinCode
        })
        return args.workspaceId

        
    }
})
export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    }, handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }
        const workspace = await ctx.db.get(args.workspaceId);
        if (!workspace) {
            throw new Error("workspace not found")
        }
        const member = await ctx.db.query('members')
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId),)
        .unique();

        if (member) {
            throw new Error("Already a member of this workspace")
        }
        if (workspace.joinCode !== args.joinCode) {
            throw new Error("invalid join code")
        }
        await ctx.db.insert("members", {
            userId,
            workspaceId: workspace._id,
            role: 'member',

        })
        
        return args.workspaceId

        
    }
})