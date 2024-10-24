import dynamic from 'next/dynamic'
import Quill from 'quill';
import React, { useRef } from 'react'

const Editor = dynamic(() => import("@/components/Editor"), {ssr: false});
const editorRef = useRef<Quill | null>(null);
interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({placeholder}: ChatInputProps) => {
  return (
    <div className='px-5 w-full'>
      <Editor variant='update' placeholder={placeholder} onSubmit={() => {}} disabled={false} innerRef={editorRef} />
    </div>
  )
}

export default ChatInput
