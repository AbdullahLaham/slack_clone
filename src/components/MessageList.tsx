import { useGetMessagesReturnType } from '@/features/messages/api/useGetMessages';
import {differenceInMinutes, format, isToday, isYesterday} from 'date-fns'
import React, { useState } from 'react'
import Message from './Message';
import ChannelHero from './ChannelHero';
import { Id } from '../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber';
interface MessageListProps {
    memberName?: string;
    memberImage?: string;
    variant?: 'channel' | 'thread' | 'conversation';
    channelName?: string;
    channelCreationTime?: number;
    data: useGetMessagesReturnType;
    loadMore?: () => void;
    isLoading?: boolean 
    canLoadMore?: boolean;
}
const formatDateLabel = (datestr: string) => {
    const date = new Date();
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM  d')
}
const MessageList = ({memberImage, memberName, variant, channelName, channelCreationTime, data, loadMore, isLoading, canLoadMore}: MessageListProps) => {
  const TIME_THRESHOLD = 5;
  const [editingId, setEditingId] = useState<null | Id<"messages">>(null);
  const {workspaceId} = useParams();
  const {data: currentMember} = useCurrentMemeber({workspaceId: workspaceId as Id<"workspaces">});
  const groupedMessages = data.reduce((groups, message) => {
    const date = new Date(message._creationTime);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
        groups[dateKey] = []
    }
    groups[dateKey].unshift(message);
    return groups


  }, {} as Record<string, typeof data>)
    return (
    <div className='flex flex-col-reverse flex-1 pb-4 overflow-y-auto messages-scrollbar '>
      {Object.entries(groupedMessages || {}).map(([dateKey, messages])=> (
        <div key={dateKey} className=''>
            <div className='text-center my-2 relative'>
                <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
                <div className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border shadow-sm border-gray-300'>
                    {formatDateLabel(dateKey)}
                </div>

            </div>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact = prevMessage && prevMessage.user._id == message.user._id && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;
                return (<Message key={message._id} id={message._id} memberId={message.memberId} authorImage={message.user.image} authorName={message.user.name} isAuthor={message.memberId == currentMember?._id} reactions={message.reactions} body={message.body} image={message.image} updatedAt={message.updatedAt} createdAt={message._creationTime} isEditing={editingId == message?._id} setEditingId={setEditingId} isCompact={isCompact} hideThreadButton={variant == 'thread'} threadCount={message.threadCound} threadImage={message.threadImage} threadTimestamp={message.threadTimestamp}   />)
            })}

        </div>
      ))}
      {variant == 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  )
}

export default MessageList
