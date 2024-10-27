import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react'
interface RendererProps {
    value: string;
}
const Renderer = ({value}: RendererProps) => {
    const [isEmpty, setIsEmpty] = useState(false);
    const rendererRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!rendererRef.current) return;
        const container = rendererRef.current;
        const quill = new Quill(document.createElement("div"), {
            theme: 'snow',
        })
        quill.enable(false);
        const contents = JSON.parse(value);
        quill.setContents(contents);
        let isEmpty = quill.getText().replace(/<(.|\n)*?>/g, "").trim().length == 0;
        setIsEmpty(isEmpty);


    }, [])
  return (
    <div>
      
    </div>
  )
}

export default Renderer



