"use client"

import UserButton from '@/features/auth/components/UserButton'
import React from 'react'
import WorkspaceSwitcher from './WorkspaceSwitcher'
import SidebarButton from './SidebarButton'
import { Bell, Home, MessagesSquare, MoreHorizontal } from 'lucide-react'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className='w-[70px] h-full bg-[#481349] flex flex-col items-center gap-y-4 pt-[9px] pb-4  '>
       <WorkspaceSwitcher /> 
       <SidebarButton icon={Home} label='Home' isActive={pathname.includes('/workspace')} />
       <SidebarButton icon={MessagesSquare} label='DMs' isActive={pathname.includes('/messages')}/>
       <SidebarButton icon={Bell} label='Activity' isActive={pathname.includes('/activities')}/>
       <SidebarButton icon={MoreHorizontal} label='More' isActive={pathname.includes('/more')}/>
      <div className='flex flex-col items-center justify-center gap-y-1 mt-auto'>
        <UserButton />
      </div>

    </aside>
  )
}

export default Sidebar
