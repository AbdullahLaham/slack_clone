import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
import dynamic from 'next/dynamic';
import {useSearchParams, useRouter} from 'next/navigation'
import { format, isToday, isYesterday } from 'date-fns';
import Hint from './Hint';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Thumbnail from './Thumbnail';
import Toolbar from './Toolbar';
import { useUpdateMessage } from '@/features/messages/api/useUpdateMessage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRemoveMessage } from '@/features/messages/api/useRemoveMessage';
import useConfirm from '@/hooks/useConfirm';
import { useToggleReaction } from '@/features/reactions/api/useToggleReactions';
import Reactions from './Reactions';
import { usePanel } from '@/hooks/usePanel';
import ThreadBar from './ThreadBar';
const Renderer = dynamic(() => import('@/components/Renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface MessageProps {
    id: Id<"messages">,
    memberId?: Id<"members">,
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
    isEditing?: boolean;
    setEditingId: (id: Id<'messages'> | null) => void;
    isCompact?: boolean;
    hideThreadButton?: boolean;
    threadCount: number;
    threadImage?: string;
    threadName?: string;
    threadTimestamp: number
}
const Message = ({ id, memberId, authorImage, authorName = "Member", isAuthor, reactions, body, image, createdAt, updatedAt, isEditing, setEditingId, isCompact, hideThreadButton, threadCount, threadImage, threadName = "Member", threadTimestamp }: MessageProps) => {
    const {parentMessageId, onOpenMessage, profileId, onOpenProfile} = usePanel();
    const [ConfirmDialog, confirm] = useConfirm('Delete message', 'are you want to delete this message');
    const { mutate: updateMessage, isPending: updating } = useUpdateMessage();
    const { mutate: removeMessage, isPending: removing } = useRemoveMessage();
    const {mutate: toggleReaction, isPending: togglingReaction} = useToggleReaction();
    const isPending = updating || removing || togglingReaction;
    console.log(parentMessageId, 'parentMessageId');
    const searchParams = useSearchParams();
    const router = useRouter();
    const handleReaction = (value: string) => {
        toggleReaction({
            value,
            messageId: id as Id<"messages">,
        },
        {
            onError: () => {
                toast.error('failed to toggle reaction')
        }})
    }
    const openMessage = (messageId: string) => {
        console.log('parrrrrrrrrr', messageId);
        const params = new URLSearchParams(searchParams.toString());
            if (messageId) {
                params.set('parentMessageId', messageId);
            } else {
                params.delete('parentMessageId');
            }
            router.push(`?${params.toString()}`);
        //     setParentMessageId(messageId);
        // setParentMessageId(messageId);
        // setProfileId(null);
    }
    const onClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('parentMessageId');
    };
    const handleDelete = async () => {
        const ok = await confirm();
        if (!ok) return;
        removeMessage({ id }, {
            onSuccess: () => {
                toast.success("message deleted");
                if (parentMessageId == id) {
                    onClose();
                }
            }, onError: () => {
                toast.success("failed to delete message")
            }

        })
    }
    const handleUpdateMessage = ({ body }: { body: string }) => {
        updateMessage({
            id,
            body,
        }, {
            onSuccess: () => {
                toast.success('message updated successfully')
            }, onError: () => {
                toast.error('failed to update message')
            }
        })

    }
    const formatFullTime = (date: Date) => {
        return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
    }
    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div className={cn('flex flex-col px-5 hover:bg-gray-100/60 group relative pl-[70px]', isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]" , removing && "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200")}>
                    <>
                        <div className='flex items-start opacity-0 group-hover:opacity-100'>
                            <Hint label={formatFullTime(new Date(createdAt))}>
                                <button className='-ml-[6px] text-xs text-gray-400 font-bold;
                            und opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
                                    {format(new Date(createdAt), "hh:mm")}
                                </button>
                            </Hint>

                        </div>
                        {!isEditing ? <div className='flex flex-col w-full'>
                            {body && <Renderer value={body} />}
                            <Thumbnail url={image} />
                            {updatedAt ? (
                                <span className='text-xs text-muted-foreground'>(edited)</span>
                            ) : null}
                            <Reactions reactions={reactions} onChange={handleReaction} />
                            <ThreadBar image={threadImage} count={threadCount} timestamp={threadTimestamp} name={threadName} onClick={() => onOpenMessage(id)}  />
                        </div> : (
                            <div className='w-full h-full'>
                                <Editor onSubmit={handleUpdateMessage} disabled={isPending} defaultValue={JSON.parse(body)} onCancel={() => setEditingId(null)} variant={'update'} />
                            </div>
                        )}
                    </>
                    {!isEditing && (
                        <Toolbar isAuthor={isAuthor} isPending={isPending} handleEdit={() => setEditingId(id)} handleThread={() => onOpenMessage(id)} handleDelete={handleDelete} hideThreadButton={hideThreadButton} handleReaction={handleReaction} />

                    )}

                </div>
            </>

        )
    }
    return (
        <>
            <ConfirmDialog />
            <div className={cn('flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative', isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433] ")}>
                <div className='flex items-start gap-2'>
                    <button onClick={() => onOpenProfile(memberId)}>
                        <Avatar>
                            <AvatarImage src={authorImage} />
                            <AvatarFallback className='flex items-center justify-center '>{authorName?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </button>
                    <div className='flex flex-col w-full overflow-hidden'>
                        {!isEditing ? <>
                            <div className='text-sm text-muted'>
                                <button onClick={() => onOpenProfile(memberId)} className='font-bold text-primary hover:underline'>
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
                                {body && <Renderer value={body} />}
                                <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className='text-xs text-muted-foreground'>(edited)</span>

                                ) : null}
                                
                                <Reactions reactions={reactions} onChange={handleReaction} />
                                <ThreadBar image={threadImage} count={threadCount} timestamp={threadTimestamp} name={threadName} onClick={() => onOpenMessage(id)} />
                            </div>
                        </> : (
                            <div className='w-full h-full'>
                                <Editor onSubmit={handleUpdateMessage} disabled={isPending} defaultValue={JSON.parse(body)} onCancel={() => setEditingId(null)} variant={'update'} />
                            </div>

                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar isAuthor={isAuthor} isPending={isPending} handleEdit={() => setEditingId(id)} handleThread={() => openMessage(id)} handleDelete={handleDelete} hideThreadButton={hideThreadButton} handleReaction={handleReaction} />
                    )}
                </div>

            </div>
        </>
    )

}

export default Message;

