"use client"


import { Button } from '@/components/ui/button'
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace'
import { Info, Search } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'

const Toolbar = () => {
    const {workspaceId} = useParams();
    const {data, isLoading} = useGetWorkspace({id: workspaceId as Id<"workspaces">});
  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
      <div className='flex-1' />
      <div className='min-w-[280px] max-w-[642px] grow-[2] shrink'>
        <Button size={'sm'} className='bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2 '>
                <Search className='size-4 tetxt-white mr-2' /> <span className='text-white text-xs'>Search workspace</span>
        </Button>

      </div>
      <div className='ml-auto flex-1 flex items-center justify-end'>
        <Button variant={'transparent'} size={'iconSm'}>
            <Info className='size-5 tetxt-white' />
        </Button>

      </div>
    </nav>
  )
}

export default Toolbar
