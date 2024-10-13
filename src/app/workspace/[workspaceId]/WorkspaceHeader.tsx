"use client"


import React, { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Doc } from '../../../../convex/_generated/dataModel';
import { ChevronDown, List, ListFilter, Square, SquarePen } from 'lucide-react';
import Hint from '@/components/Hint';
import PreferencesModal from './PreferencesModal';


interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">,
    isAdmin?: boolean,
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <>
            <PreferencesModal open={modalOpen} setOpen={setModalOpen} initialValue={''} />
            <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'transparent'} className='font-semibold text-lg w-auto p-1.5 overflow-hidden' size='sm'>
                        <span>{workspace?.name}</span>
                        <ChevronDown className='size-4 ml-1 shrink-0' />

                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent side='bottom' align='start' className='w-64'>
                    <DropdownMenuItem key={workspace._id} className='cursor-pointer capitalize'>
                        <div className='size-9 relative overflow-hidden bg-[#616061] text-white text-xl capitalize font-semibold flex items-center justify-center mr-2'>
                            {workspace.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex flex-col items-start'>
                            <p>{workspace?.name}</p>
                            <p className='text-xs text-muted-foreground'>Active workspace</p>

                        </div>

                    </DropdownMenuItem>
                    {isAdmin && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer py-2'>
                                Invite People to {workspace.name}

                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer py-2' onClick={() => setModalOpen(true)}>
                                Preferences

                            </DropdownMenuItem>
                        </>
                    )}


                </DropdownMenuContent>
            </DropdownMenu>
            <div className='flex items-center gap-0.5'>
                <Hint label='Filter Conversations' side='bottom'>
                    <Button variant={'transparent'} size={'iconSm'}>
                        <ListFilter className='size-4' />
                    </Button>
                </Hint>

                <Hint label='New Message'side='bottom'>
                    <Button variant={'transparent'} size={'iconSm'}>
                        <SquarePen className='size-4' />
                    </Button>
                </Hint>


            </div>
        </div>
        </>
    )
}

export default WorkspaceHeader
