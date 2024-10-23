import { Button } from '@/components/ui/button'
import { Dialog, DialogFooter, DialogHeader, DialogTrigger, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRemoveChannel } from '@/features/channels/api/useRemoveChannel'
import { useUpdateChannel } from '@/features/channels/api/useUpdateChannel'
import { TrashIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'
import { Id } from '../../../../../../convex/_generated/dataModel'
import useConfirm from '@/hooks/useConfirm'
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber'
interface HeaderProps {
    title: string
}
const Header = ({ title }: HeaderProps) => {
    const [editOpen, setEditOpen] = useState(false)
    const [value, setValue] = useState(title);
    const {channelId} = useParams();
    const {workspaceId} = useParams();
    // router
    const router = useRouter();
    const [ConfirmDialog, confirm] = useConfirm("Are u sure you want to delete this channel?", "This action is irreversible");
    const {mutate: updateChannel, isPending: isUpdating} = useUpdateChannel();
    const {mutate: removeChannel, isPending: isRemoving} = useRemoveChannel();

    const {data: member, isLoading} = useCurrentMemeber({workspaceId: workspaceId as Id<"workspaces">})
    const handleOpen = () => {
        if (member?.role !== 'admin') return;
        setEditOpen(!editOpen)
    }
    const reNameChannel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateChannel({id: channelId as Id<"channels">, name: value}, {
            onSuccess: () => {
                toast.success("channel updated successfully");
                setEditOpen(false);
            },
            onError: () => {
                toast.success("failed to update channel");
            },

        })
    }
    const handleDelete = async () => {
        const ok  = await confirm();
        if (!ok) return;
        removeChannel({id: channelId as Id<"channels">}, {
            onSuccess: () => {
                toast.success("channel deleted successfully");
                router.push(`/workspace/${workspaceId}`)
            },
            onError: () => {
                toast.success("failed to delete channel");
            },
        })
    }
    return (
        <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'ghost'} className='text-lg font-semibold px-2 overflow-hidden w-auto' size='sm'>
                        <span className='truncate'># {title}</span>
                        <FaChevronDown className='size-2.5 ml-2' />

                    </Button>
                </DialogTrigger>
                <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
                    <DialogHeader className='p-4 border-b bg-white'>
                        <DialogTitle>
                            # {title}
                        </DialogTitle>

                    </DialogHeader>
                    <div className='px-4 pb-4 flex flex-col gap-y-2'>
                        <Dialog open={editOpen} onOpenChange={handleOpen}>
                            <DialogTrigger>
                                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                                    <div className='flex items-center justify-between'>
                                        <p className='text-sm font-semibold'>Channel Name</p>
                                        {member?.role == 'admin' && <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>}

                                    </div>
                                    <p className='text-sm'># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>
                                <form action={''} className='space-y-4' onSubmit={reNameChannel}>
                                    <Input type='text' value={value} disabled={isUpdating} onChange={(e) => setValue(e.target.value.replace(/\s+/g, "-").toLowerCase())} required autoFocus minLength={3} maxLength={80} placeholder="channel name e.g. plan-budget" />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant={'outline'} disabled={isUpdating}>Cancel</Button>
                                        </DialogClose>
                                        <Button type='submit' disabled={isUpdating}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>


                        </Dialog>

                        {member?.role == 'admin' &&<button onClick={handleDelete} disabled={isRemoving} className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'>
                            <TrashIcon className='size-4' />
                            <p className='text-sm font-semibold'>Delete Channel</p>
                        </button>}

                    </div>

                </DialogContent>
            </Dialog>


        </div>
    )
}

export default Header
