"use client"

import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useCreateWorkspace } from '@/features/workspaces/api/useCreateWorkspace';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';
import { Loader, Plus } from 'lucide-react';

const WorkspaceSwitcher = () => {
  // router
  const router = useRouter();
  const {workspaceId} = useParams();
  const [_open, setOpen] = useCreateWorkspaceModal(); 
  const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId as Id<"workspaces">});
  const {data: workspaces, isLoading: workspacesLoading} = useGetWorkspaces();
  const filteredWorkspaces = workspaces?.filter((workspace) => {
    return workspace?._id !== workspaceId
  });

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button className='size-9 relative overflow-hidden bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl'>
              {workspaceLoading ? <Loader className='size-5 shrink-0 animate-spin' /> : (
                workspace?.name.charAt(0).toUpperCase()
              )}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='w-64' >
          <DropdownMenuItem onClick={() => router.push(`/workspace/${workspaceId}`)} className='cursor-pointer flex flex-col justify-start items-start capitalize'>
            {workspace?.name}
            <span className='text-xs text-muted-foreground'>
              Active workspace

            </span>

          </DropdownMenuItem>

          {filteredWorkspaces?.map((workspace) => {
            return (
              <DropdownMenuItem key={workspace._id} className='cursor-pointer capitalize' onClick={() => router.push(`/workspace/${workspace?._id}`)}>
                <div className='shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center'>
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
                <p className='truncate'>{workspace.name}</p>
                
              </DropdownMenuItem>
            )
          })}

          <DropdownMenuItem className='cursor-pointer ' onClick={() => setOpen(true)}>
            <div className='size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center'>
              <Plus />
            </div>
            Create a new workspace
          </DropdownMenuItem>


        </DropdownMenuContent>
      
    </DropdownMenu>
  )
}

export default WorkspaceSwitcher
