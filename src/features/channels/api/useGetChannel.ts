import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface useGetChannelProps {
    channelId: Id<"channels">
}
export const useGetChannel = ({channelId}: useGetChannelProps) => {
    const data = useQuery(api.channels.getById, {channelId})
    const isLoading = data == undefined;
    return {data, isLoading}
}