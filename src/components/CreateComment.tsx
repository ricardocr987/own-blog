import React, { useState } from 'react';
import { Comment } from '@/types'
import Button from './Button';

const CreateComment = ({id}: {id: string}) => {
  const [error, setError] = useState<boolean>(false);
  const [localStorage, setLocalStorage] = useState<Storage | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [formData, setFormData] = useState<Comment>({ id: '', createdAt: 0, username: '', message: '' });

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a Reply</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea value={formData.message} className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700" name="comment" placeholder="Comment" />
      </div>
      {error && <p className="text-xs text-red-500">All fields are mandatory</p>}
      <div className="mt-8">
        <Button text="Post Comment" />
        {showSuccessMessage && <span className="text-xl float-right font-semibold mt-3 text-green-500">Comment submitted for review</span>}
      </div>
    </div>
  );
};

export default CreateComment;
