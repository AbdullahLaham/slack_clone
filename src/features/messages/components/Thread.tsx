import React, { useRef, useState } from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, LoaderPinwheel, XIcon } from 'lucide-react';
import { useGetMessages } from '../api/useGetMessages';
import { useGetMessage } from '../api/useGetMessage';
import Message from '@/components/Message';
import useCurrentMemeber from '@/features/members/api/useCurrentMemeber';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useCreateMessage } from '../api/useCreateMessage';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUpload';
import { toast } from 'sonner';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
const Editor  = dynamic(() => import("@/components/Editor"), {ssr: false});

type CreateMessageValues = {
  channelId: Id<"channels">,
  workspaceId: Id<"workspaces">,
  parentMessageId: Id<"messages">,
  body: string,
  image?: Id<"_storage">,
  // conversationId: Id<"conversations">,


}
interface ThreadProps {
  messageId: Id<"messages">,
  onClose: () => void;
}
const TIME_THRESHOLD = 20;
const Thread = ({ messageId, onClose }: ThreadProps) => {
  // editingId state
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  // editor key
  const [editorKey, setEditorKey] = useState(0);
  // isPending
  const [pending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const { data: message, isLoading: messageLoading } = useGetMessage({ id: messageId });
  const {workspaceId} = useParams();
  const {channelId} = useParams();
  const {data: currentMember, isLoading: memberLoading} = useCurrentMemeber({workspaceId: workspaceId as Id<"workspaces">});
  const {results, status, loadMore } = useGetMessages({channelId: channelId as Id<"channels">, parentMessageId: messageId});
  const {mutate: createMessage} = useCreateMessage();

  const {mutate: generateUploadUrl} = useGenerateUploadUrl();
  const canLoadMore = status == 'CanLoadMore';
  const isLoadingMore = status == 'LoadingMore';
  const formatDateLabel = (datestr: string) => {
    const date = new Date();
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM  d')
  }
  const handleSubmit = async ({body, image}: {body: string, image: File | null}) => {
    console.log(body, image);
    try {
      setPending(true);
      editorRef.current?.enable(false);
      const values: CreateMessageValues = {
        workspaceId: workspaceId as Id<"workspaces">,
        channelId: channelId as Id<"channels">,
        parentMessageId: messageId,
        // conversationId: conversationId as Id<"conversations">,
        body,
        image: undefined,
      }
      if (image) {
        const url = await generateUploadUrl({}, {throwError: true});
        if (!url) throw new Error("Url not found")
        let result = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': image.type},
          body: image,
        });
        if (!result.ok) {
          throw new Error("failed to upload image")
        }
        const {storageId} = await result.json();
        values.image = storageId;
      }
      await createMessage(values, {
        throwError: true,
        
      });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("failed to send message")


    } finally {
      setPending(false)

    }
    // editorRef.current?.setContents([])

  }


  const groupedMessages = results.reduce((groups, message) => {
    const date = new Date(message._creationTime);
    const dateKey = format(date, "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].unshift(message);
    return groups


  }, {} as Record<string, typeof results>);


  if (messageLoading ) {
    return (
      <div className='flex flex-col h-full'>
        <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className='size-5 stroke-[1.5] ' />
        </Button>


      </div>
              <div className='flex-1 flex items-center justify-center'>
        <Loader2 className='animate-spin size-6 text-muted-foreground' />

      </div>
      </div>
    )
  }
  if (!message) {
    <div className='h-full flex flex-col'>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className='size-5 stroke-[1.5] ' />
        </Button>

      </div>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
          <AlertTriangle className='animate-spin size-6 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Message not found</p>

        </div>

      </div>

    </div>
  }
  return (
    <div className='h-full flex flex-col'>
      <div className='h-[49px] flex justify-between p-4 items-center border-b'>
        <p className='text-lg font-bold'>Thread</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className='size-5 stroke-[1.5] ' />
        </Button>

      </div>
      <div className='flex flex-col-reverse flex-1 pb-4 overflow-y-auto messages-scrollbar '>
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        
        <div key={dateKey} className=''>
          <div className='text-center my-2 relative'>
            <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
            <div className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border shadow-sm border-gray-300'>
              {formatDateLabel(dateKey)}
            </div>

          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact = prevMessage && prevMessage.user._id == message.user._id && differenceInMinutes(new Date(message._creationTime), new Date(prevMessage._creationTime)) < TIME_THRESHOLD;
            return (<Message key={message._id} id={message._id} memberId={message.memberId} authorImage={message.user.image} authorName={message.user.name} isAuthor={message.memberId == currentMember?._id} reactions={message.reactions} body={message.body} image={message.image} updatedAt={message.updatedAt} createdAt={message._creationTime} isEditing={editingId == message?._id} setEditingId={setEditingId} isCompact={isCompact} hideThreadButton threadCount={message.threadCound} threadImage={message.threadImage} threadTimestamp={message.threadTimestamp} />)
          })}

        </div>
      ))}
      <div className='h-1' ref={(el) => {
        if (el) {
          const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && canLoadMore) {
              loadMore?.();
            }
          }, {threshold: 1.0});
          observer.observe(el);
          return () => observer.disconnect();
        }
      }} />
      {isLoadingMore && (
        <div className='text-center my-2 relative'>
          <hr className='absolute top-1/2 left-0 right-0 border-t border-gray-300' />
          <div className='relative inline-block bg-white px-4 py-1 rounded-full text-xs border shadow-sm border-gray-300'>
            <LoaderPinwheel className='size-4 animate-spin' />
          </div>
        </div>
      )}
        <Message hideThreadButton memberId={message?.memberId} authorImage={message?.user.image} isAuthor={currentMember?._id == message?.memberId}  body={message?.body} image={message?.image} createdAt={message?._creationTime} updatedAt={message?.updatedAt} id={message?._id} reactions={message?.reactions} isEditing={editingId == message?._id} setEditingId={setEditingId}  />
        <Editor key={editorKey} innerRef={editorRef} onSubmit={handleSubmit} disabled={pending} placeholder='Reply...'  />
      </div>
      

      <div className='px-4'>


      </div>


    </div>
  )
}
export default Thread;
