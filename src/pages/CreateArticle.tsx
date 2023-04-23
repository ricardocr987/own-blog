import React, { useState } from "react"
import { Button, Editor, PreviewContent} from "@/components";

const CreateArticle = () => {
    const [showPreview, setShowPreview] = useState(false);
    const [content, setContent] = useState("");
  
    const handleChange = (content: string) => {
      setContent(content);
    };
  
    const handlePreviewClick = () => {
      setShowPreview(true);
    };
  
    const handleEditClick = () => {
      setShowPreview(false);
    };
  
    return (
      <div className="container mx-auto px-10 mb-8">
        {showPreview ? (
          <div>
            <div className="flex justify-center px-2 py-2">
              <PreviewContent content={content} />
            </div>
            <div className="flex justify-center px-2 py-2">
              <Button text="Edit" onClick={handleEditClick} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center px-2 py-2">
              <Editor content={content} handleChange={handleChange} />
            </div>
            <div className="flex justify-center px-2 py-2">
              <Button text="Preview" onClick={handlePreviewClick} />
            </div>
          </div>
        )}
      </div>
    );
  };

export default CreateArticle;