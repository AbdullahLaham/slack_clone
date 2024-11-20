import { format } from 'date-fns';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
interface ConversationHeroProps {
    name?: string;
    image?: string;

}
const ConversationHero = ({name="Member", image}: ConversationHeroProps) => {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
        <div className='flex items-center gap-x-1 mb-2'>
        <Avatar className='rounded-md size-5 mr-1'>
                <AvatarImage className='size-5 rounded-md' src={image}  />
                <AvatarFallback className='size-5 rounded-md bg-sky-500  flex items-center justify-center text-white text-xs'>{name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
        <p className='text-2xl font-bold'>
            {name}
        </p>
        <p className='font-normal text-slate-800 mb-4'>
            this conversation is just between you and <strong>{name}</strong>this is the very beginning of the conversation with <strong>{name}</strong>

        </p>
      
    </div>
  )
}

export default ConversationHero
