import { useCreateMessage } from '@/features/messages/api/useCreateMessage';
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation';
import Quill from 'quill';
import React, { useRef, useState } from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUpload';

const Editor = dynamic(() => import("@/components/Editor"), {ssr: false});

interface ChatInputProps {
  placeholder: string;
}
type CreateMessageValues = {
  channelId: Id<"channels">,
  workspaceId: Id<"workspaces">,
  body: string,
  image?: Id<"_storage">,
  // conversationId: Id<"conversations">,


}
const ChatInput = ({placeholder}: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);

  const [editorKey, setEditorKey] = useState(0);
  const [pending, setPending] = useState(false);
  const {mutate: createMessage} = useCreateMessage();
  const {mutate: generateUrl} = useGenerateUploadUrl();
  const {workspaceId} = useParams();
  const {channelId} = useParams();

  

  const handleSubmit = async ({body, image}: {body: string, image: File | null}) => {
    console.log(body, image);
    try {
      setPending(true);
      editorRef.current?.enable(false);
      const values: CreateMessageValues = {
        workspaceId: workspaceId as Id<"workspaces">,
        channelId: channelId as Id<"channels">,
        // conversationId: conversationId as Id<"conversations">,
        body,
        image: undefined,
      }
      if (image) {
        const url = await generateUrl({}, {throwError: true});
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
  return (
    <div className='px-5 w-full'>
      <Editor key={editorKey} variant='create' placeholder={placeholder} onSubmit={handleSubmit} disabled={pending} innerRef={editorRef} />
    </div>
  )
}

export default ChatInput
