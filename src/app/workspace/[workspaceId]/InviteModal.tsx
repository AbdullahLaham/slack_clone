import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { CopyIcon, RefreshCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { mutation } from '../../../../convex/_generated/server';
import { useNewJoinCode } from '@/features/workspaces/api/useNewJoinCode';
import { Id } from '../../../../convex/_generated/dataModel';
import useConfirm from '@/hooks/useConfirm';
interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string
}
const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
     const {workspaceId} = useParams();
    const {mutate, isPending} = useNewJoinCode({workspaceId: workspaceId as Id<'workspaces'>});
   const [ConfirmDialog, confirm] = useConfirm("Are u sure?", "This will deactive the current invite code and generate a new one");
    const handleCopy = () => {
        
        let inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() => toast.success("Invite link copied to clipboard"));
    }
    const handleNewCode = async () => {
        const ok = await confirm();
        if (!ok) return

        mutate({workspaceId: workspaceId as Id<"workspaces">},
            {
                onSuccess: () => {
                    toast.success("invite code regenerated")
                  }, 
                onError: () => {
                    toast.error("Failed to regenerate invite code")
                }
            }
        );


    }
    
  return (
    <>
    <ConfirmDialog />
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Invite People to {name}
                </DialogTitle>
                <DialogDescription>Use the code below to invite the people to your workspace</DialogDescription>
            </DialogHeader>
            <div className='flex flex-col gap-y-4 items-center justify-center py-10 w-full'>
                <p className='text-4xl font-bold tracking-widest uppercase'>
                    {joinCode}
                </p>
                <Button onClick={handleCopy} className='' variant={'ghost'} size={'sm'} disabled={isPending}>
                    Copy link <CopyIcon className='size-4 ml-2 size-sm' />
                </Button>
            </div>
            <div className='flex items-center justify-between w-full'> 
                <Button onClick={handleNewCode} variant={'outline'}>
                    New code <RefreshCcw className='size-4 ml-2' />
                </Button>
                <DialogClose asChild>
                    <Button disabled={isPending}>Cancel</Button>
                    
                </DialogClose>

            </div>
        </DialogContent>
      
    </Dialog>
    </>
  )
}

export default InviteModal
