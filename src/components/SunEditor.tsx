import React, { useCallback, useEffect, useRef, useState } from "react"
import SunEditorCore from "suneditor/src/lib/core";
import 'suneditor/dist/css/suneditor.min.css';
import dynamic from "next/dynamic";
import { responsiveEditor } from "@/constants";

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

    const [width, setWidth] = useState<string>(
        typeof window !== 'undefined' ? `${window.innerWidth}` : '400'
    );
    const [height, setHeight] = useState<string>(
        typeof window !== 'undefined' ? `${window.innerHeight}` : '200'
    );
  
    const handleResize = useCallback(() => {
        const { innerWidth } = window;
        const { width, height } = Object.values(responsiveEditor).find(
            ({ breakpoint }) => innerWidth >= breakpoint.min && innerWidth <= breakpoint.max
        )!;
        setWidth(width);
        setHeight(height);
    }, []);
      
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    
    return (
        <>
            <SunEditor
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
                        "table",
                        "image",
                        "video",
                        "audio",
                    ]]
                }}
            />
            <div>
                
            </div>
        </>
    );
};

export default Editor;