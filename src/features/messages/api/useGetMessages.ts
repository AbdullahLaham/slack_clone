import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react"
import { Id } from "../../../../convex/_generated/dataModel"
import { request } from "http"
const BATCH_SIZE = 20;


interface useGetMessagesProps {
    workspaceId?: Id<'workspaces'>,
    channelId?:Id<'channels'>,
    parentMessageId?:Id<"messages">,
    conversationId?: Id<"conversations">,

}
export type useGetMessagesReturnType = typeof api.messages.get._returnType["page"]
export const useGetMessages = ({workspaceId, channelId, parentMessageId, conversationId}: useGetMessagesProps) => {


    const {results, status, loadMore} = usePaginatedQuery(api.messages.get, {
        workspaceId, channelId, parentMessageId, conversationId
    }, {initialNumItems: BATCH_SIZE});
   
    return { 
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE)
     };
}