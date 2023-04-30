import React, { useState } from "react"
import { AuthWrapper, Author, Editor, PreviewContent} from "@/components";
import { authorInitValues, postInitialValues } from "@/constants";
import { Post } from "@/types";
import PostConfig from "@/components/PostConfig";

const CreateArticle = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [post, setPost] = useState<Post>(postInitialValues)
  const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);
  const [file, setFile] = useState<File | undefined>();

  const handleContentChange = (newContent: string) => {
    const updatedPost = { ...post, content: newContent };
    setPost(updatedPost);
  }

  return (
    <AuthWrapper setAuthorDetails={setAuthorDetails}>
      <div className="px-7">
        {showConfig && <PostConfig post={post} setShowPreview={setShowPreview} setShowConfig={setShowConfig} setPost={setPost} setFile={setFile} file={file}/>}
        {showPreview && <PreviewContent content={post.content} authorDetails={authorDetails} setShowPreview={setShowPreview} setShowConfig={setShowConfig}/>}
        {!showPreview && !showConfig && 
          <div className="grid grid-flow-row">
            <div className="flex items-center justify-center my-2 px-2 space-x-5">
              <div className="grid justify-items-center">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowPreview(true)}>
                  <svg className="fill-current h-4 w-4" id="Layer_1_1_" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8,3C3.582,3,0,8,0,8s3.582,5,8,5s8-5,8-5S12.418,3,8,3z M8,11c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S9.657,11,8,11z"/>
                  </svg>
                </div>
                <div className="text-center text-xs mt-1 text-white">Preview</div>
              </div>
              <div className="grid justify-items-center">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowConfig(true)}>
                  <svg className="fill-current h-4 w-4" version="1.1" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"><g id="info"/><g id="icons"><path d="M22.2,14.4L21,13.7c-1.3-0.8-1.3-2.7,0-3.5l1.2-0.7c1-0.6,1.3-1.8,0.7-2.7l-1-1.7c-0.6-1-1.8-1.3-2.7-0.7   L18,5.1c-1.3,0.8-3-0.2-3-1.7V2c0-1.1-0.9-2-2-2h-2C9.9,0,9,0.9,9,2v1.3c0,1.5-1.7,2.5-3,1.7L4.8,4.4c-1-0.6-2.2-0.2-2.7,0.7   l-1,1.7C0.6,7.8,0.9,9,1.8,9.6L3,10.3C4.3,11,4.3,13,3,13.7l-1.2,0.7c-1,0.6-1.3,1.8-0.7,2.7l1,1.7c0.6,1,1.8,1.3,2.7,0.7L6,18.9   c1.3-0.8,3,0.2,3,1.7V22c0,1.1,0.9,2,2,2h2c1.1,0,2-0.9,2-2v-1.3c0-1.5,1.7-2.5,3-1.7l1.2,0.7c1,0.6,2.2,0.2,2.7-0.7l1-1.7   C23.4,16.2,23.1,15,22.2,14.4z M12,16c-2.2,0-4-1.8-4-4c0-2.2,1.8-4,4-4s4,1.8,4,4C16,14.2,14.2,16,12,16z" id="settings"/></g></svg>
                </div>
                <div className="text-center text-xs mt-1 text-white">Config</div>
              </div>
            </div>
            <Editor content={post.content} handleChange={handleContentChange} />
          </div>
        }
      </div>
    </AuthWrapper>
  );
};

export default CreateArticle;