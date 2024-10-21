import { Button } from '@/components/ui/button'
import { Dialog, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { TrashIcon } from 'lucide-react'
import React from 'react'
import { FaChevronDown } from 'react-icons/fa'
interface HeaderProps {
    title: string
}
const Header = ({ title }: HeaderProps) => {
    return (
        <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
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
                        <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                            <div className='flex items-center justify-between'>
                                <p className='text-sm font-semibold'>Channel Name</p>
                                <p className='text-sm text-[#1264a3] hover:underline font-semibold'>Edit</p>

                            </div>
                            <p className='text-sm'># {title}</p>
                        </div>
                        <button>
                            <TrashIcon />
                        </button>

                    </div>

                </DialogContent>
            </Dialog>


        </div>
    )
}

export default Header
