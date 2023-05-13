import React, { useContext, useState } from 'react';
import { Comment, NotificationType, Post } from '@/types'
import { useSession } from 'next-auth/react';
import { NotificationContext } from '@/contexts/NotificationContext';

const CreateComment = ({post}: {post: Post})  => {
  const [formData, setFormData] = useState<Comment>({ createdAt: 0, username: '', message: '' });
  const { data: session } = useSession();
  const { addNotification } = useContext(NotificationContext);

  const submitComment = () => {
    const postComment = async () => {
      if (!session) return

      formData.createdAt = Date.now()
      formData.username = session.user.username
      if (post.comments) {
        post.comments.push(formData)
      } else {
        post.comments = [formData]
      }
      try {
        const res = await fetch('/api/postComment', {
          method: 'POST',
          body: JSON.stringify(post)
        })
        if (res.status === 201) addNotification('Comment posted successfully', NotificationType.SUCCESS)
        setFormData({ createdAt: 0, username: '', message: '' })
      } catch (e) {
        addNotification('Error: Comment has not posted', NotificationType.ERROR)
      }
    }

    postComment()
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
