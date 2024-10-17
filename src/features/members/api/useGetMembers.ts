import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
interface useGetMemebersProps {
    workspaceId: Id<"workspaces">
}
export const useGetMemebers = ({workspaceId}: useGetMemebersProps) => {
    const data = useQuery(api.members.get, {workspaceId});
    return {data, isLoading: data === undefined} 
}

