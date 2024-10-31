import { format } from 'date-fns';
import React from 'react'
interface ChannelHeroProps {
    name: string;
    creationTime: number;

}
const ChannelHero = ({name, creationTime}: ChannelHeroProps) => {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
        <p className='text-2xl font-bold flex items-center mb-2'>
            # {name}

        </p>
        <p className='font-normal text-slate-800 mb-4'>
            this channel was created on {format(creationTime, 'MMMM do, yyyy')} this is the very beginning of the # <strong>{name}</strong> channel

        </p>
      
    </div>
  )
}

export default ChannelHero
