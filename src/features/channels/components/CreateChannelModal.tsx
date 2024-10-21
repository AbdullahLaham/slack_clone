import React, { FormEvent, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { useCreateChannelModal } from '../api/store/useCreateChannelModal'
import { useCreateChannel } from '../api/useCreateChannel'
import { useCreateChannelModal } from '../api/store/useCreateChannelModal'
import { useParams } from 'next/navigation'
import { Id } from '../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const CreateChannelModal = () => {
    
    const {workspaceId} = useParams();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState("");
    const {mutate, isPending} = useCreateChannel();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({
            name,
            workspaceId: workspaceId as Id<"workspaces">,
        }, {
            onSuccess: (id) => {
                toast.success('Channel created')
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                setOpen(false); setName("")

            },
            onError: (error) => {
              toast.success('Failed to create channel')
            },
            onSettled: () => {
                
            }

        });


    }

  return (
    <Dialog open={open} onOpenChange={() => {setOpen(false); setName("")}}>
       <DialogContent>
            <DialogHeader>
        
            <DialogTitle>
                Add a channel

            </DialogTitle>
            <DialogDescription>

            </DialogDescription>
        </DialogHeader>
        </DialogContent>  
      
      <DialogContent>
        <form className='space-y-4' onSubmit={handleSubmit} >
        <Input value={name} onChange={(e) => setName(e.target.value.replace(/s+/g, "-").toLowerCase())} disabled={isPending} required autoFocus minLength={3} placeholder="Cahnnel name e.g. 'plan-budget'" />
        <div className='flex justify-end my-1'>
            <Button type='submit' disabled={isPending} >
                Create
            </Button>

        </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
