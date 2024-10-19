import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { mutation } from '../../../../convex/_generated/server';
interface InviteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string
}
const InviteModal = ({open, setOpen, name, joinCode}: InviteModalProps) => {
    const {workspaceId} = useParams();
    const handleCopy = () => {
        let inviteLink = `${window.location.origin}/join/${workspaceId}`;
        navigator.clipboard.writeText(inviteLink).then(() => toast.success("Invite link copied to clipboard"));
    }
    
  return (
    <Dialog>
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
                <Button onClick={handleCopy} className='' variant={'ghost'} size={'sm'}>
                    Copy link <CopyIcon className='size-4 ml-2 size-sm' />
                </Button>
            </div>
        </DialogContent>
      
    </Dialog>
  )
}

export default InviteModal
