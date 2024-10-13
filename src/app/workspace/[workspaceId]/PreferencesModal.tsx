"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Trash } from 'lucide-react';
import React, { useState } from 'react'


interface PreferencesModalProps {
    open: boolean;
    setOpen: (open: boolean) => void,
    initialValue: String,
}
const PreferencesModal = ({open, setOpen, initialValue}: PreferencesModalProps) => {
    const [value, setValue] = useState(initialValue);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
        <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>
                {value}
            </DialogTitle>
        </DialogHeader>
        <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-100'>
                <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>WS name</p>
                    <p className='hover:underline text-[#1264a3] text-sm'>Edit</p>

                </div>
                <p className='text-sm'>
                    {value}

                </p>
            </div>
            <button disabled={false} onClick={() => {}} className='flex items-center justify-start border gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50 text-rose-600'>
                <Trash />
                <p className='text-sm font-semibold'>Delete Workspace</p>
            </button>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default PreferencesModal
