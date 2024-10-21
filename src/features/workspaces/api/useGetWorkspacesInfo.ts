import { useQuery } from 'convex/react'
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
interface useGetWorkspaceProps {
    id: Id<"workspaces">
}
export const useGetWorkspaceInfo = ({id}: useGetWorkspaceProps) => {
    const data = useQuery(api.workspaces.getInfoById, {
        id
    });
    const isLoading = data === undefined;

    return {data, isLoading}
}
