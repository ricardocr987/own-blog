import React from 'react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';
import Button from './Button';

const EditPostCard = ({post}: {post: Post}) => (
  <div className="relative h-40">
    <div className="absolute rounded-lg bg-center bg-no-repeat bg-cover shadow-md inline-block w-full h-40" style={{ backgroundImage: `url('${post.featuredImage}')` }} />
    <div className="absolute rounded-lg bg-center bg-gradient-to-b opacity-50 from-gray-400 via-gray-700 to-black w-full h-40" />
    <div className="flex flex-col rounded-lg p-4 items-center justify-center absolute w-full h-full">
      <p className="text-white mb-4 text-shadow font-semibold text-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
      <p className="text-white mb-4 text-shadow font-semibold text-2xl text-center">{post.title}</p>
      <div className="flex items-center w-full justify-center mb-4">
        <Button text='Edit' />
      </div>
    </div>
    <Link href={`/post/${post.id}`}><span className="cursor-pointer absolute w-full h-full" /></Link>
  </div>
);

export default EditPostCard;
