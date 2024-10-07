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
        return id;
    }
})
export const get = query({
    args: {},
    handler: async(ctx) => {
        return await ctx.db.query("workspaces").collect()
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