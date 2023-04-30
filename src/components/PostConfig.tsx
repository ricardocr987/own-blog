import { Post } from "@/types"
import PostForm from "./PostForm"

interface PostConfigProps {
    post: Post
    setShowPreview: React.Dispatch<React.SetStateAction<boolean>>
    setShowConfig: React.Dispatch<React.SetStateAction<boolean>>
    setPost: React.Dispatch<React.SetStateAction<Post>>
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
    file: File | undefined
}

const PostConfig = ({ post, setPost, setShowConfig, setShowPreview, setFile, file }: PostConfigProps) => {
    return (
        <div className="grid grid-flow-row">
            <div className="flex items-center justify-center mb-4 space-x-5">
                <div className="grid justify-items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => { setShowConfig(false); setShowPreview(true) }}>
                        <svg className="fill-current h-4 w-4" id="Layer_1_1_" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8,3C3.582,3,0,8,0,8s3.582,5,8,5s8-5,8-5S12.418,3,8,3z M8,11c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S9.657,11,8,11z"/>
                        </svg>
                    </div>
                    <div className="text-center text-xs mt-1 text-white">Preview</div>
                </div>
                <div className="grid justify-items-center">
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowConfig(false)}>
                        <svg className="fill-current h-4 w-4" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m16 2.012 3 3L16.713 7.3l-3-3zM4 14v3h3l8.299-8.287-3-3zm0 6h16v2H4z"/></svg>
                    </div>
                    <div className="text-center text-xs mt-1 text-white">Edit</div>
                </div>
            </div>
            <div className="rounded-md bg-white w-full px-16 py-16">
                <PostForm setPost={setPost} post={post} setFile={setFile} file={file}/>
            </div>
        </div>
    );
}

export default PostConfig