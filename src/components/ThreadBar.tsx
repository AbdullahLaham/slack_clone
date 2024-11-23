import React from 'react'
import { Avatar , AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import { formatDistance, formatDistanceToNow } from 'date-fns';
import { ChevronRight } from 'lucide-react';

interface ThreadBarProps {
    image?: string;
    count?: number;
    timestamp?: number;
    name?: string;
    onClick: () => void;
}
const ThreadBar = ({image, count, timestamp, name, onClick}: ThreadBarProps) => {

  if (!count || !timestamp) return null;

  return (
    <button onClick={onClick} className='p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px] '>
      <div className='flex items-center gap-2 overflow-hidden'>
      <Avatar className='size-6 shrink-0'>
          <AvatarImage className='size-5 rounded-md' src={image}  />
          <AvatarFallback className='size-5 rounded-md bg-sky-500  flex items-center justify-center text-white text-xs'>{name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className='text-xs text-sky-700 hover:underline font-bold truncate'>{count} {count > 1 ? "replies" : 'reply'}</span>
      <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:hidden'>
        last reply {formatDistanceToNow(timestamp, {addSuffix: true})}
      </span>
      <span className='text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden'>View Thread</span>
      </div>
      <ChevronRight className='size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100' />
    </button>
  )
}

export default ThreadBar
