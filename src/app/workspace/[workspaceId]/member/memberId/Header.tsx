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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
interface HeaderProps {
    memberName?: string;
    memberImage?: string;
    onClick?: () => void;
}

const Header = ({ memberImage, memberName="Member", onClick }: HeaderProps) => {
    const [editOpen, setEditOpen] = useState(false)
    // const [value, setValue] = useState(title);
   
    return (
        <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
            <Button variant='ghost' className='text-lg font-semibold px-2 overflow-hidden w-auto ' size='sm' onClick={onClick}>
                <Avatar className='size-6 mr-2'>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback>{memberName?.charAt(0).toUpperCase()}</AvatarFallback>

                </Avatar>
                <span className='truncate'>{memberName}</span>
                <FaChevronDown className='size-2.5 ml-2' />
            </Button>
         
        </div>
    )
}

export default Header
