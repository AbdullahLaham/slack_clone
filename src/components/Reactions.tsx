
import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useParams } from 'next/navigation';
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber';
import { cn } from '@/lib/utils';
import Hint from './Hint';
import EmojiPopover from './EmojiPopover';
interface ReactionsProps {
    reactions?: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>;
    onChange: (value: string) => void;
}
const Reactions = ({ reactions, onChange }: ReactionsProps) => {
    const { workspaceId } = useParams();
    const { data: currentMember } = useCurrentMemeber({ workspaceId: workspaceId as Id<"workspaces"> });
    if (DataTransfer.length == 0 || !currentMember) {
        return null;
    }
    return (
        <div className='flex items-center gap-1 my-1'>
            {reactions?.map((reaction) => (
                <>
                   <Hint label={`${reaction.count} ${reaction.count == 1 ? "person" : "people"}`}>
                   <button onClick={() => onChange(reaction.value)} className={cn('h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 items-center gap-x-1', reaction.memberIds.includes(currentMember._id) && "bg-blue-100/70 border-blue-500 text-blue-500")}>
                        {reaction.value}
                        <span className='text-muted-foreground text-xs font-semibold '>{reaction.count}</span>
                    </button>
                   </Hint>
                    
                </>

            ))}
            <EmojiPopover hint='Add reaction' onEmojiSelect={(emoji) => onChange(emoji)}>
                <button className='h-7 px-3 rounded-full bg-slate-200/70'>

                </button>

            </EmojiPopover>

        </div>
    )
}

export default Reactions
