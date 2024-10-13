import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
interface useCurrentMemeberProps {
    workspaceId: Id<"workspaces">
}
const useCurrentMemeber = ({workspaceId}: useCurrentMemeberProps) => {
    const data = useQuery(api.members.current, {workspaceId});
    return {data, isLoading: data === undefined} 
}

export default useCurrentMemeber
