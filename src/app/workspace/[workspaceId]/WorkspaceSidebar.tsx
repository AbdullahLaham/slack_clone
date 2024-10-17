"use client"

import useCurrentMemeber from '@/features/members/api/useCurrentMemeber';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useParams } from 'next/navigation'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from 'lucide-react';
import WorkspaceHeader from './WorkspaceHeader';
import SidebarItem from './SidebarItem';
import { useGetChannels,  } from '@/features/channels/api/useGetChannels';
import WorkspaceSection from './WorkspaceSection';
import { useGetMemebers } from '@/features/members/api/useGetMembers';
import UserItem from './UserItem';
interface WorkspaceSidebarProps {

}
const WorkspaceSidebar = () => {
    const {workspaceId} = useParams();
    const {data: member, isLoading: memberLoading} = useCurrentMemeber({workspaceId: workspaceId as Id<'workspaces'>});
    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId as Id<'workspaces'>})
    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId: workspaceId as Id<"workspaces">})
    const {data: members, isLoading: membersLoading} = useGetMemebers({workspaceId: workspaceId as Id<"workspaces">})
    
    if (memberLoading || workspaceLoading) {
        return (
            <div className='flex flex-col bg-[#5e2c5f] h-full items-center justify-center'>
              <Loader className='size-5 animate-spin text-white' />
            </div>
          )
    }
    if (!member || !workspace) {
        return (
            <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
              <AlertTriangle className='size-5 text-white' />
               <p className='text-white text-sm'>workspace not found</p>
            </div>
          )
    }
    return (
    <div className='flex flex-col bg-[#5e2c5f] h-full '>
      <WorkspaceHeader workspace={workspace} isAdmin={member.role == 'admin'} />
      <div className='flex flex-col px-2 mt-3' >

        <SidebarItem label='Threads' icon={MessageSquareText} id='threads' variant={'active'} />
        <SidebarItem label='Drafts & Sent' icon={SendHorizonal} id='drafts' />
        <SidebarItem label='Threads' icon={MessageSquareText} id='threads'/>
      </div>
        <WorkspaceSection label='Channels' hint='New channel' onNew={() => {}}>
          {
            channels?.map((channel) => {
              return (
                <SidebarItem key={channel._id} label={channel.name} icon={HashIcon} id={channel._id} />
              )
            })
          }

        </WorkspaceSection>
        <WorkspaceSection label='Direct Messages' hint='new direct message' onNew={() => {}}>
          {members?.map((item) => (
            <UserItem key={item._id} label={item.user.name} image={item.user.image} id={item._id} />
          ))}  
        </WorkspaceSection>
        
    </div>
  )
}

export default WorkspaceSidebar
