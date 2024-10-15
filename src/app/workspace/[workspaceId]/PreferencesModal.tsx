"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogClose, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUpdateWorkspace } from '@/features/workspaces/api/useUpdateWorkspace';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useRemoveWorkspace } from '@/features/workspaces/api/useRemoveWorkspace';
import useConfirm from '@/hooks/useConfirm';


interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void,
    initialValue: string,
}
const PreferencesModal = ({open, setOpen, initialValue}: PreferencesModalProps) => {
    const router = useRouter();

    const [confirmDialog, confirm] = useConfirm('are u sure?', 'This action is irreversible');
    const [value, setValue] = useState(initialValue);
    const [editOpen, setEditOpen] = useState(false);
    const {workspaceId} = useParams();
    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace} = useUpdateWorkspace();
    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkspace();
    // {id: workspaceId, name: value}{id: workspaceId}
    const renameWorkspace = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateWorkspace({
            id: workspaceId as Id<"workspaces">,
            name: value,
        }, {
            onSuccess: (data) => {
                toast.success('Workspace updated');
                setEditOpen(false)
            },
            onError: (error) => {
                toast.success('failed to update Workspace ');
                
            },
            onSettled: () => {
                
            }
        })
        
    }
    const handeleRemove = async () => {
        const ok = await confirm();
        if (!ok) return 
        removeWorkspace({
            id: workspaceId as Id<"workspaces">,
        }, {
            onSuccess: (data) => {
                toast.success('Workspace deleted');
                router.replace('/')
            },
            onError: (error) => {
                toast.success('failed to delete Workspace ');
                
            },
            onSettled: () => {
                
            }
        })
    }

  return (
    <>
    <confirmDialog />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
        <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>
                {value}
            </DialogTitle>
        </DialogHeader>
        <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100'>
                    <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold'>WorkSpace name</p>
                        <p className='hover:underline text-[#1264a3] text-sm'>Edit</p>
                    </div>
                    <p className='text-sm'>
                        {value}

                    </p>
                </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename this workspace</DialogTitle>
                    </DialogHeader>
                    <form action={''} className='space-y-4' onSubmit={renameWorkspace}>
                        <Input type='text' value={value} disabled={isUpdatingWorkspace} onChange={(e) => setValue(e.target.value)} required autoFocus minLength={3} maxLength={80} placeholder="workspace name e.g. 'Work', 'Personal', 'Home'"  />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant={'outline'} disabled={isUpdatingWorkspace}>Cancel</Button>
                            </DialogClose>
                            <Button type='submit' disabled={isUpdatingWorkspace}>Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent> 
                
            </Dialog>
            <button disabled={isRemovingWorkspace} onClick={handeleRemove} className='flex items-center justify-start border gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600'>
                <Trash />
                <p className='text-sm font-semibold'>Delete Workspace</p>
            </button>
        </div>

      </DialogContent>
    </Dialog>
    </>
  )
}

export default PreferencesModal
