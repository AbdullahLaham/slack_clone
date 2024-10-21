"use client"

import { useGetChannel } from '@/features/channels/api/useGetChannel';
import { useParams } from 'next/navigation'
import React from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Loader, TriangleAlert } from 'lucide-react';
import Header from './Header';
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'

const ChannelIdPage = () => {
  const {channelId} = useParams();
  const {data: channel, isLoading: channelLoading} = useGetChannel({channelId: channelId as Id<'channels'>})
  if (channelLoading) {
    return (
      <div className='h-full flex flex-1 items-center justify-center '>
        <Loader className='animate-spin size-6 text-muted-foreground' />
      </div>
    )
  }
  if (!channel) {
    return (
      <div className='h-full flex flex-col gap-y-2 flex-1 items-center justify-center '>
        <TriangleAlert className='animate-spin size-6 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>channel not found</span>
      </div>
    )
  }
  return (
    <div className='flex flex-col h-full'>
      <Header title={channel?.name} />
      
    </div>
  )
}

export default ChannelIdPage
