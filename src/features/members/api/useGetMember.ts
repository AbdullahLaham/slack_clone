import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
interface useGetMemeberProps {
    memberId: Id<"members">
}
export const useGetMemeber = ({memberId}: useGetMemeberProps) => {
    const data = useQuery(api.members.getById, {id: memberId});
    return {data, isLoading: data === undefined} 
}

