import { useGetMessagesReturnType } from '@/features/messages/api/useGetMessages';
import {format, isToday, isYesterday} from 'date-fns'
import React from 'react'
import Message from './Message';
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
                return (<Message key={message._id} id={message._id} memberId={message.memberId} authorImage={message.user.image} authorName={message.user.name} isAuthor={false} reactions={message.reactions} body={message.body} image={message.image} updatedAt={message.updatedAt} createdAt={message._creationTime} isEditing={false} setEditingId={() => {}} isCompact={false} hideThreadButton={false} threadCount={message.threadCound} threadImage={message.threadImage} threadTimestamp={message.threadTimestamp}   />)
            })}

        </div>
      ))}
    </div>
  )
}

export default MessageList
