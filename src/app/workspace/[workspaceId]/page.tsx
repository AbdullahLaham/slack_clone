
"use client"

import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { useCreateChannelModal } from '@/features/channels/api/store/useCreateChannelModal';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { channel } from 'diagnostics_channel';
import { Loader2, TriangleAlert } from 'lucide-react';
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber';

const page = () => {
  const { workspaceId } = useParams();
  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal()

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId as Id<'workspaces'> });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId: workspaceId as Id<'workspaces'> });
  const {data: member, isLoading: memberLoading} = useCurrentMemeber({workspaceId: workspaceId as Id<"workspaces">})
  const channelId = useMemo(() => channels?.[0]?._id, [channels])
  const isAdmin = useMemo(() =>  member?.role == 'admin', [member?.role])

  useEffect(() => {
    if (workspaceLoading || channelsLoading || !workspace || memberLoading || !member) return
    if (channelId) router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    // if there is no any channel
    else if (!open && isAdmin) setOpen(true)
  }, [workspace, channelId, channelsLoading, workspaceLoading, open, setOpen, router, workspaceId, member, memberLoading, isAdmin]);
  if (workspaceLoading || channelsLoading || memberLoading) {
    return (
      <div className='h-full flex items-center justify-center flex-1 flex-col gap-y-2'>
        <Loader2 className='size-6 animate-spin text-muted-foreground' />
      </div>
    )
  }
  if (!workspace || !member) {
    return (
      <div className='h-full flex items-center justify-center flex-1 flex-col gap-y-2'>
        <TriangleAlert className='size-6 animate-spin text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>Workspace not found</span>
      </div>
    )
  }
  return (
    <div className='h-full flex items-center justify-center flex-1 flex-col gap-y-2'>
      <TriangleAlert className='size-6 animate-spin text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>No Channel Found</span>
    </div>
  )
}

export default page
