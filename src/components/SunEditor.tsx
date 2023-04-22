import React, { useCallback, useEffect, useRef, useState } from "react"
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});


interface ButtonProps {
  content?: string;
  handleChange: (content: string) => void;
}

const Editor = ({content = '', handleChange}: ButtonProps) => {
    const editor = useRef<SunEditorCore>();

    // The sunEditor parameter will be set to the core suneditor instance when this function is called
    const getSunEditorInstance = (sunEditor: SunEditorCore) => {
        editor.current = sunEditor;
    };

    const [width, setWidth] = useState('700');
    const [height, setHeight] = useState('200');
  
    const handleResize = useCallback(() => {
      const { innerWidth, innerHeight } = window;
      setWidth(innerWidth > 1200 ? '1200' : `${innerWidth}`);
      setHeight(innerHeight > 280 ? '280' : `${innerHeight}`);
    }, []);
  
    useEffect(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    
    return (
        <SunEditor
            autoFocus
            setContents={content}
            onChange={handleChange}
            getSunEditorInstance={getSunEditorInstance}
            height={height}
            width={width}
            setOptions={{
                buttonList: [[
                    "bold",
                    "underline",
                    "italic",
                    "strike",
                    "list",
                    "align",
                    "fontSize",
                    "formatBlock",
                    "table",
                    "image",
                    "video",
                    "audio",
                ]]
            }}
        />
    );
};

export default Editor;