"use client"
import { useCreateOrGetConversation } from '@/features/conversations/api/useCreateOrGetConversation';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Conversation from './Conversation';

const MemberIdPage = () => {
    const {workspaceId} = useParams();
    const {memberId} = useParams();
    const [conversationId, setConversationId] = useState <Id<"conversations"> | null>(null)
    const {mutate, isPending} = useCreateOrGetConversation();
    useEffect(() => {
        mutate({
            workspaceId: workspaceId as Id<'workspaces'>,
            memberId: memberId  as Id<'members'>,
        }, {
            onSuccess(data) {
                setConversationId(data)
            }, onError(error) {
                toast.error("failed to create or get conversation")
            }
        })

    }, [memberId, workspaceId, mutate]);
    if (isPending) {
        return (
            <div className='h-full flex items-center justify-center flex-1 flex-col gap-y-2'>
              <Loader2 className='size-6 animate-spin text-muted-foreground' />
            </div>
          )
    }
    if (!conversationId) {
        return (
            <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
              <AlertTriangle className='size-5 text-white' />
               <p className='text-white text-sm'>conversation not found</p>
            </div>
          )
    }
  return (
    <Conversation id={conversationId} />
  )
}

export default MemberIdPage
