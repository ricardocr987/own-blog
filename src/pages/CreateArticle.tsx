import React, { useState } from "react"
import { AuthWrapper, Author, Button, Editor, PreviewContent} from "@/components";
import { authorInitValues, postInitialValues } from "@/constants";
import { Post, ReducedPost } from "@/types";
import PostConfig from "@/components/PostConfig";
import { v4 as uuid } from 'uuid'
import { NextApiRequest, NextApiResponse } from "next";
import { Publish as publishStore } from 'aleph-sdk-ts/dist/messages/store';
import { ItemType, StoreMessage } from "aleph-sdk-ts/dist/messages/message";
import { GetAccountFromProvider } from "aleph-sdk-ts/dist/accounts/solana";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSession } from "next-auth/react";

const CreateArticle = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [post, setPost] = useState<Post>(postInitialValues)
  const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);
  const [file, setFile] = useState<File | undefined>();
  const wallet = useWallet()
  const { data: session } = useSession();

  const handleContentChange = (newContent: string) => {
    const updatedPost = { ...post, content: newContent };
    setPost(updatedPost);
  }

  function fileToBuffer(file: File): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          const buffer = Buffer.from(reader.result as ArrayBuffer);
          resolve(buffer);
        }
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };
      reader.readAsArrayBuffer(file);
    });
  }
  
  const handlePublish = () => {
    const uploadFeaturedImage = async () => {
      if (!file) {
        console.log('No file was dropped or an error occurred while processing the file.');
        return;
      }
      if (!session) {
        console.log('No active session');
        return;
      }
      if (!wallet.signMessage || !wallet.publicKey) return
      try {
        const buffer = await fileToBuffer(file)
        const account = await GetAccountFromProvider({
          signMessage: wallet.signMessage,
          publicKey: wallet.publicKey,
          connected: wallet.connected,
          connect: wallet.connect
        })
        const store = await publishStore({
          account,
          channel: 'own-blog',
          fileObject: buffer,
          storageEngine: ItemType.storage,
          APIServer: 'https://api2.aleph.im',
        });
        post.featuredImage = 'https://api2.aleph.im/api/v0/storage/raw/' + store.content.item_hash
        post.author = {
          username: session?.user.username || authorDetails.username,
          uri: session?.user.uri || authorDetails.uri,
          id: session?.user.id || authorDetails.pubkey,
        }
        post.id = uuid()
        post.createdAt = Date.now()
        post.tags.push(session.user.username)
        const res = await fetch('/api/postArticle', {
          method: 'POST',
          body: JSON.stringify(post)
        })
        console.log(res)
      } catch (error) {
        console.log(error);
      }
    };
    uploadFeaturedImage()
  }
  
  return (
    <AuthWrapper setAuthorDetails={setAuthorDetails}>
      <div className="px-7">
        {showConfig && <PostConfig post={post} setShowPreview={setShowPreview} setShowConfig={setShowConfig} setPost={setPost} setFile={setFile} file={file} handlePublish={handlePublish}/>}
        {showPreview && <PreviewContent content={post.content} authorDetails={authorDetails} setShowPreview={setShowPreview} setShowConfig={setShowConfig} handlePublish={handlePublish}/>}
        {!showPreview && !showConfig && 
          <div className="grid grid-flow-row">
            <div className="flex items-center justify-center py-2 px-2 space-x-5">
              <div className="grid justify-items-center">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowPreview(true)}>
                  <svg className="fill-current h-5 w-5" id="Layer_1_1_" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8,3C3.582,3,0,8,0,8s3.582,5,8,5s8-5,8-5S12.418,3,8,3z M8,11c-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S9.657,11,8,11z"/>
                  </svg>
                </div>
                <div className="text-center text-xs mt-1 text-white">Preview</div>
              </div>
              <div className="grid justify-items-center">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full border transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => setShowConfig(true)}>
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
            <Editor content={post.content} handleChange={handleContentChange} />
          </div>
        }
      </div>
    </AuthWrapper>
  );
};

export default CreateArticle;

interface Props {
  req: NextApiRequest, 
  res: NextApiResponse
}