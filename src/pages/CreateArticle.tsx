import React, { useState } from "react"
import { AuthWrapper, Author, Button, Editor, PreviewContent} from "@/components";
import { authorInitValues } from "@/constants";

const CreateArticle = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [content, setContent] = useState("");
  const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);

  return (
    <AuthWrapper setAuthorDetails={setAuthorDetails}>
      <div className="container mx-auto px-10 mb-8">
        {showPreview ? 
          <>
            <div className="flex justify-center px-2 py-2">
              <PreviewContent content={content} />
            </div>
            <div className="flex justify-center px-2 py-2">
              <Button text="Edit" onClick={() => setShowPreview(!showPreview)} />
            </div>
          </>
        :
          <>
            <div className="flex justify-center px-2 py-2">
              <Editor content={content} handleChange={() => setContent(content)} />
            </div>
            <div className="flex justify-center px-2 py-2">
              <Button text="Preview" onClick={() => setShowPreview(!showPreview)} />
            </div>
          </>
        }
      </div>
    </AuthWrapper>
  );
};

export default CreateArticle;