import { error } from 'console';
import {mutation, query} from './_generated/server';
import { auth } from './auth';
import { v } from 'convex/values';
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
            joinCode: '123',
            userId
        });
        await ctx.db.insert("members" ,{
            userId,
            workspaceId: id,
            role: 'admin',
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

export const getById = query({
    args: {id: v.id('workspaces')},
    handler: async(ctx, args) => {
        const userId = auth.getUserId(ctx);
        if (!userId) {
            throw new Error("unauthorized")
        }
        return await ctx.db.get(args.id);
    }
});