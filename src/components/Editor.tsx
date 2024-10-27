import React, { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Quill, { QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css';
import { PiTextAa } from 'react-icons/pi'
import { Button } from './ui/button';
import { ImageIcon, Send, Smile, XIcon } from 'lucide-react';
import { MdSend } from 'react-icons/md'
import Hint from './Hint';
import { Delta, Op } from 'quill/core';
import { cn } from '@/lib/utils';
import { list } from 'postcss';
import EmojiPopover from './EmojiPopover';
import Image from 'next/image';
type EditorValue = {
  image: File | null;
  body: string
}
interface EditorProps {
  onSubmit: ({image, body}: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  disabled?: boolean;
  innerRef?: MutableRefObject<Quill | null>;
  variant?: 'create' | "update";

}
const Editor = ({onSubmit, onCancel, placeholder='Write something...', defaultValue = [], disabled = false, innerRef, variant = 'create'}: EditorProps) => {
  const [text, setText] = useState("");
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [image, setImage] = useState<File | null>(null)

  
  
  const containerRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const imageElementRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  })

  // inside of the useEffects we use the refs because i dont want to add the variables in the dependancy array because that will cause some mismatchs
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );
    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike'], ['link'], [{list: 'ordered'}, {list: 'bullet'}]
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler :() => {
                const text = quill.getText();
                // in useEffect we not use image but we use imageElementRef to not add it to the dependency array
                const addedImage = imageElementRef.current?.files?.[0] || null;
                const isEmpty =  text.replace(/<(.|\n)*?>/g, "").trim().length == 0 && !addedImage;
                if (isEmpty) return;
                onSubmit({body: JSON.stringify(quillRef.current?.getContents()), image: addedImage});




              }
            }, shiftEnter: {
              key: "Enter",
              shiftKey: true,
              handler :() => {
                quill.insertText(quill.getSelection()?.index || 0, "\n")

              }
            }
          }
        }
      }
      
    }
    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();
    if (innerRef) {
      innerRef.current = quill
    }

    quill.setContents(defaultValueRef.current)
    setText(quill.getText())

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    })

    return () => {
      quill.off(Quill.events.TEXT_CHANGE)
      if (container) container.innerHTML = ''
      if (quillRef?.current) quillRef.current = null;
      if (innerRef?.current) innerRef.current = null;

    }

  }, [innerRef]);
  const toggleToolbar = () => {
    setToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");
    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden")
    }
  }

  const onEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)

  }
  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length == 0; // this regex is to remove the empty html elements and tags
  
  return (
    <div className='flex flex-col'>
      <input type='file' accept='image/*' ref={imageElementRef} onChange={(e) => setImage(e.target.files![0])} className='hidden' />
      <div className={cn('flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white', disabled && "opacity-50")}>
        <div ref={containerRef} className='h-full ql-custom' />
        {!!image && (
          <div className='p-2'>
            <div className='relative size-[62px] flex items-center justify-center group/image'>
            <Hint label='Remove Image'>
              <button onClick={() => {setImage(null); imageElementRef.current!.value = ''}} className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black text-white absolute -top-2.5 -right-2.5 size-6 z-[4] border-2 border-white items-center justify-center'>
                <XIcon className='size-3.5' />
              </button>
            </Hint>
            <Image src={URL.createObjectURL(image)} alt='Uploaded' fill className='rounded-xl overflow-hidden border object-cover' />

            </div>

          </div>

        )}
        <div className='flex px-2 pb-2 z-[5]'>
          <Hint label={toolbarVisible ? 'Hide Formatting': 'show formatting'}>
            <Button disabled={disabled} size={'iconSm'} variant={'ghost'} onClick={toggleToolbar} >
              <PiTextAa className='size-4' />
            </Button>

          </Hint>
          <EmojiPopover onEmojiSelect={onEmojiSelect} hint='Emoji'>
            <Button disabled={disabled} size={'iconSm'} variant={'ghost'} >
              <Smile className='size-4' />
            </Button>
          </EmojiPopover>
          {variant == 'create' && <Hint label='Image'>
            <Button disabled={disabled} size={'iconSm'} variant={'ghost'} onClick={() => imageElementRef.current?.click()}>
              <ImageIcon className='size-4' />
            </Button>
          </Hint>}
          {variant == 'update' && <div className='ml-auto flex items-center gap-x-2'>
            <Button variant={'outline'} size={'sm'} onClick={onCancel} disabled={disabled}>
              Cancel
            </Button>
            <Button className='ml-auto bg-[#007a5a]/70 text-gray-200 hover:bg-[#007a5a]/80 ' size={'sm'} onClick={() => onSubmit({body: JSON.stringify(quillRef.current?.getContents()), image})} disabled={disabled || isEmpty}>
              Save
            </Button>

            </div>}
          {variant == 'create' && <Hint label='Send'>
            <Button disabled={isEmpty || disabled} className={cn('ml-auto', isEmpty ? ' bg-white hover:bg-white text-gray-200 text-muted-foreground' : ' bg-[#007a5a]/70 text-gray-200 hover:bg-[#007a5a]/80 ', )} size={'iconSm'} variant={'outline'} onClick={() => onSubmit({body: JSON.stringify(quillRef.current?.getContents()), image})}>
              <MdSend className='size-4' />
            </Button>
          </Hint>}
        </div>
      </div>
      {variant == 'create' && <div className={cn('p-2 text-sm text-muted-foreground flex gap-1 justify-end opacity-0 transition', !isEmpty && 'opacity-100')}>
        <strong>Shift + Return </strong> to add a new line
      </div>}
    </div>
  )
}

export default Editor
