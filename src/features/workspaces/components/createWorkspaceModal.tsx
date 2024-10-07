"use client"

import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { FormEvent, useState } from 'react'
import { useCreateWorkspaceModal } from '../store/useCreateWorkspaceModal'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateWorkspace } from '../api/useCreateWorkspace';
import { useRouter } from 'next/navigation';
import {toast} from 'sonner'

const CreateWorkspaceModal = () => {
    const router = useRouter();
    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState('');
    const {mutate, isPending, isError, isSettled, isSuccess} = useCreateWorkspace();

    const handleClose = () => {
        setOpen(false);
        setName("")

    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        try {
            const data = await mutate(
                {name},
                {
                    onSuccess: (data) => {
                        toast.success('Workspace created')
                        router.push(`/workspace/${data}`)
    
                    },
                    onError: (error) => {
                        
                    },
                    onSettled: () => {
                        
                    }
    
                }
            )
        } catch (error) {

        }
    }
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogHeader>
        <DialogTitle>

        </DialogTitle>
        <DialogDescription>

        </DialogDescription>
      </DialogHeader>
      <DialogContent>
        <form onSubmit={handleSubmit} >
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={false} required autoFocus minLength={3} placeholder="workspace name e.g. 'Work', 'Personal', 'Home'" />
        <div className='flex justify-end'>
            <Button type='submit' disabled={false} >
                Create
            </Button>

        </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal
