import React, { MutableRefObject, useEffect, useRef } from 'react'
import Quill, { QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css';
import { PiTextAa } from 'react-icons/pi'
import { Button } from './ui/button';
import { ImageIcon, Send, Smile } from 'lucide-react';
import { MdSend } from 'react-icons/md'
import Hint from './Hint';
import { Delta, Op } from 'quill/core';
type EditorValue = {
  image: File | null;
  body: string
}
interface EditorProps {
  onSubmit: ({image, body}: EditorValue) => void;
  onCancel: () => void;
  placeholder?: string;
  defaultValue: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;

  variant?: 'create' | "update";

}
const Editor = ({onSubmit, onCancel, placeholder, defaultValue, disabled, innerRef, variant = 'create'}: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: 'snow'
    }
    new Quill(editorContainer, options);
    return () => {
      if (container) container.innerHTML = ''
    }

  }, [])
  return (
    <div className='flex flex-col'>
      <div className='flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white'>
        <div ref={containerRef} className='h-full ql-custom' />
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label='Hide Formatting'>
            <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={() => { }}>
              <PiTextAa className='size-4' />
            </Button>

          </Hint>
          <Hint label='Emoji'>
            <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={() => { }}>
              <Smile className='size-4' />
            </Button>
          </Hint>
          {variant == 'create' && <Hint label='Image'>
            <Button disabled={false} size={'iconSm'} variant={'ghost'} onClick={() => { }}>
              <ImageIcon className='size-4' />
            </Button>
          </Hint>}
          {variant == 'update' && <div className='ml-auto flex items-center gap-x-2'>
            <Button variant={'outline'} size={'sm'} onClick={() => {}} disabled={false}>
              Cancel
            </Button>
            <Button className='ml-auto bg-[#007a5a]/70 text-gray-200 hover:bg-[#007a5a]/80 ' size={'sm'} onClick={() => {}} disabled={false}>
              Save
            </Button>

            </div>}
          {variant == 'create' && <Hint label='Send'>
            <Button className='ml-auto bg-[#007a5a]/70 text-gray-200 hover:bg-[#007a5a]/80 ' disabled={false} size={'iconSm'} variant={'outline'} onClick={() => { }}>
              <MdSend className='size-4' />
            </Button>
          </Hint>}
        </div>
      </div>
      <div className='p-2 text-sm text-muted-foreground flex gap-1 justify-end'>
        <strong>Shift + Return </strong> to add a new line
      </div>
    </div>
  )
}

export default Editor
