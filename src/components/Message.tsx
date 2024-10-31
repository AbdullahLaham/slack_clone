import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';
import Hint from './Hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Thumbnail from './Thumbnail';
import Toolbar from './Toolbar';
const Renderer = dynamic(() => import('./Renderer'), { ssr: false });

interface MessageProps {
    id: Id<"messages">,
    memberId: Id<"members">,
    authorImage?: string;
    authorName?: string;
    isAuthor?: boolean;
    reactions?: Array<Omit<Doc<"reactions">, "memberId"> & {
        count: number;
        memberIds: Id<"members">[]
    }>;
    body: Doc<"messages">["body"];
    image?: string | null;
    createdAt: Doc<"messages">["_creationTime"]
    updatedAt: Doc<"messages">["updatedAt"]
    isEditing: boolean;
    setEditingId: (id: Id<'messages'> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount?: number;
    threadImage?: string;
    threadTimestamp?: number
}
const Message = ({ id, memberId, authorImage, authorName = "Member", isAuthor, reactions, body, image, createdAt, updatedAt, isEditing, setEditingId, isCompact, hideThreadButton, threadCount, threadImage, threadTimestamp }: MessageProps) => {
    const formatFullTime = (date: Date) => {
        return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;

    }
    if (isCompact) {
        return (
            <div className='flex flex-col gap-2 p-1.5 px-[72px] hover:bg-gray-300/30 group relative'>
                <div className='flex items-start opacity-0 group-hover:opacity-100'>
                    <Hint label={formatFullTime(new Date(createdAt))}>
                        <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
                            {format(new Date(createdAt), "hh:mm")}
                        </button>
                    </Hint>

                </div>
                <div className='flex flex-col w-full'>
                    <Renderer value={body} />
                    <Thumbnail url={image} />
                    {updatedAt ? (
                        <span className='text-xs text-muted-foreground'>(edited)</span>
                    ) : null}
                </div>
            </div>

        )
    }
    return (
        <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative'>
            <div className='flex items-start gap-2'>
                <button>
                    <Avatar>
                        <AvatarImage src={authorImage} />
                        <AvatarFallback className='flex items-center justify-center '>{authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </button>
                <div className='flex flex-col w-full overflow-hidden'>
                    <div className='text-sm text-muted'>
                        <button onClick={() => { }} className='font-bold text-primary hover:underline'>
                            {authorName}

                        </button>
                        <span>&npsp;</span>
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className='text-xs text-muted-foreground hover:underline'>
                                {format(new Date(createdAt), "h:mm a")}

                            </button>
                        </Hint>

                    </div>
                    <div className='flex flex-col w-full'>
                        <Renderer value={body} />
                        <Thumbnail url={image} />
                        {updatedAt ? (
                            <span className='text-xs text-muted-foreground'>(edited)</span>

                        ) : null}
                    </div>
                </div>
                {!isEditing && (
                    <Toolbar isAuthor={isAuthor} isPending={false} handleSubmit={() => setEditingId(id)} handleThread={() => {}} handleDelete={() => {}} hideThreadButton={hideThreadButton}  />

            )}
            </div>

        </div>
    )

}

export default Message;

