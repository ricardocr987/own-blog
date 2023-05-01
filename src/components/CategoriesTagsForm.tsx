import { Post } from "@/types";
import React, { useState } from "react";

interface CategoriesTagsFormProps {
  setPost: React.Dispatch<React.SetStateAction<Post>>
  tags: string[]
}

const CategoriesTagsForm = ({setPost, tags}: CategoriesTagsFormProps) => {
  const [remainingTags, setRemainingTags] = useState(10 - tags.length);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      let tag = e.currentTarget.value.replace(/\s+/g, " ");
      if (tag.length > 1 && !tags.includes(tag)) {
        if (tags.length < 10) {
          const tagsAux = ([...tags, ...tag.split(",")]);
          setRemainingTags(remainingTags - 1);
          setPost((prevPost: Post) => ({ ...prevPost, categories: tagsAux }));
        }
      }
      e.currentTarget.value = "";
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setPost((prevPost: Post) => ({ ...prevPost, categories: updatedTags }));
    setRemainingTags(remainingTags + 1);
  };

  return (
    <div>
      <div>
        <p className="text-lg">Categories</p>
        <p className="text-sm">Press enter or add a comma after each tag</p>
        <div className="w-full border-grey text-sm mt-2 border border-gray-300 rounded-md bg-white flex items-center">
          <span className="w-7 px-2 border-r border-gray-300 ">{remainingTags}</span>
          <input
            type="text"
            className="w-full p-2"
            spellCheck="false"
            onKeyUp={addTag}
            placeholder="Type a tag and press enter"
          />
        </div>
      </div>
      <div className="">
        <div className="flex flex-wrap items-center p-2 mt-2 border bg-white rounded-md">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="text-sm font-medium text-gray-800 bg-gray-100 rounded-full p-2 flex items-center"
            >
              {tag}
              <div
                className="uit uit-multiply text-gray-500 ml-2 cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                <svg id="Layer_1" version="1.1" viewBox="0 0 512 512" width="10px" xmlns="http://www.w3.org/2000/svg"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesTagsForm;
