"use client"

import React from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { useGetMemeber } from '@/features/members/api/useGetMember';
import { useParams } from 'next/navigation';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Loader2 } from 'lucide-react';
import Header from './Header';
import MessageList from '@/components/MessageList';
import ChatInput from './ChatInput';
interface ConversationProps {
    id: Id<"conversations">;
}
const Conversation = ({id}: ConversationProps) => {
    const {memberId} = useParams();
    const {data: member, isLoading} = useGetMemeber({memberId: memberId as Id<"members">});
    const {results, status, loadMore} = useGetMessages({
        conversationId: id  as Id<"conversations">
    });
    if (isLoading || status == 'LoadingFirstPage') {
        return (
            <div className='h-full flex items-center justify-center flex-1 flex-col gap-y-2'>
              <Loader2 className='size-6 animate-spin text-muted-foreground' />
            </div>
          )
    }
  return (
    <div className='flex flex-col h-full'>
      <Header memberName={member?.user.name} memberImage={member?.user.image} onClick={() => {}} />
        <MessageList data={results} variant='conversation' memberName={member?.user.name} memberImage={member?.user.image} loadMore={loadMore} isLoadingMore={status == 'LoadingMore'} canLoadMore={status== 'CanLoadMore'}   />
        <ChatInput placeholder={`Message ${member?.user.name}`} conversationId={id} />
    </div>
  )
}

export default Conversation
