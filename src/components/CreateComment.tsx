import React, { useContext, useState } from 'react';
import { CommentInfo, NotificationType } from '@/types'
import { useSession } from 'next-auth/react';
import { NotificationContext } from '@/contexts/NotificationContext';

const CreateComment = ({postId}: {postId: string})  => {
  const [formData, setFormData] = useState<CommentInfo>({ createdAt: 0, username: '', message: '', postId });
  const { data: session } = useSession();
  const { addNotification } = useContext(NotificationContext);

  const submitComment = async () => {
    if (!session) {
      addNotification('You need to be signed', NotificationType.ERROR)
      return
    }

    formData.createdAt = Date.now()
    formData.username = session.user.username
    formData.postId = postId
    
    try {
      const res = await fetch('/api/postComment', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      if (res.status === 201) {
        addNotification('Comment posted successfully', NotificationType.SUCCESS)
        setFormData({ createdAt: 0, username: '', message: '', postId })
      } else {
        addNotification(res.statusText, NotificationType.ERROR)
      }
    } catch (e) {
      addNotification('Error: Comment has not posted', NotificationType.ERROR)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Leave a comment</h3>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              message: e.target.value,
            }))
          }
          className="p-4 outline-none w-full rounded-lg h-40 focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700"
          name="comment"
          placeholder="Comment"
        />
      </div>
      <div className="mt-8">
        <div className="flex justify-end">
          <div
            onClick={(e) => submitComment()}
            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
          >
            Post
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
