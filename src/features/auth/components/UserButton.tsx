"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/features/auth/api/useCurrentUser'
import { useAuthActions } from '@convex-dev/auth/react'
import { Loader, LogOut } from 'lucide-react'
import React, { useState } from 'react'

const UserButton = () => {
    const {data, isLoading} = useCurrentUser();
    const {signOut} = useAuthActions();
    console.log(data, 'ttttt')

    if (isLoading) return <Loader className='size-4 animate-spin text-muted-foreground' />
    if (!data) return null;
  console.log(data, 'rrrrrrr')
    const {name, email, image} = data;

    const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <div>
      <DropdownMenu modal={false} >
        <DropdownMenuTrigger className='outline-none relative'>
            <Avatar className='size-10 hover:opacity-75 transition' >
                <AvatarImage src={data.image} alt={name} />
                <AvatarFallback className='bg-emerald-300 text-white font-semibold'><p className='text-slate-800'>{avatarFallback}</p></AvatarFallback>
            </Avatar>

        </DropdownMenuTrigger>
        <DropdownMenuContent align='center' side='right' >
            <DropdownMenuItem onClick={() => signOut()} className='h-10'>
                <LogOut className='size-4 mr-2' /> Log Out

            </DropdownMenuItem>


        </DropdownMenuContent>

      </DropdownMenu>
    </div>
  )
}

export default UserButton
