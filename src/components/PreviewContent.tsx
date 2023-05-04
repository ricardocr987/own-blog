import { Author } from '@/types';
import parse from 'html-react-parser';

interface PreviewContentProps {
    content: string
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
    setShowConfig: React.Dispatch<React.SetStateAction<boolean>>
    authorDetails: Author
    handlePublish: () => void
}

const PreviewContent = ({content, setShowPreview, setShowConfig, handlePublish}: PreviewContentProps) => {
    return (
        <div className="grid grid-flow-row">
            <div className="flex items-center justify-center py-2 px-2 space-x-5">
                <div className="grid justify-items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowPreview(false)}>
                        <svg className="fill-current h-5 w-5" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"/></svg>
                    </div>
                    <div className="text-center text-xs mt-1 text-white">Edit</div>
                </div>
                <div className="grid justify-items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => { setShowPreview(false); setShowConfig(true) }}>
                        <svg className="fill-current h-5 w-5" version="1.1" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g id="info"/><g id="icons"><path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z" id="settings"/></g></svg>
                    </div>
                    <div className="text-center text-xs mt-1 text-white">Config</div>
                </div>
                <div className="grid justify-items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={handlePublish}>
                        <svg className="fill-current h-6 w-6" height="24" viewBox="0 0 48 48" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h48v48h-48z" fill="none"/><path d="M10 8v4h28v-4h-28zm0 20h8v12h12v-12h8l-14-14-14 14z"/></svg>
                    </div>
                    <div className="text-center text-xs mt-1 text-white">Publish</div>
                </div>
            </div>
            <div className="h-auto rounded-md bg-white w-full px-8 py-8">
                {parse(content)}
            </div>
        </div>
    );
};

export default PreviewContent;
