import React from 'react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';

const ProfilePostCard = ({post}: {post: Post}) => (
  <div className="h-40 overflow-hidden mb-2">
    <Link href={`/post/${post.id}`} className="block w-full h-full cursor-pointer">
      <div className="w-full h-full flex rounded-lg shadow-md mb-4 bg-white ">
        <div
          className="w-40 h-full bg-center bg-no-repeat bg-cover rounded-l-lg shadow-md inline-block"
          style={{ backgroundImage: `url(${post.featuredImage})` }}
        />
        <div className="flex flex-col flex-1 justify-center">
          <div className="grid grid-cols-10 grid-rows-2 px-4">
            <p className="text-black font-semibold text-2xl col-start-1 col-end-11 row-start-1 row-end-2 truncate">
              {post.title}
            </p>
            <p
              className="text-black text-xl col-start-1 col-end-11 row-start-2 row-end-3 line-clamp-2"
            >
              {post.summary}
            </p>
            <p className="text-black text-xs col-start-11 col-end-12 row-start-4 row-end-4">
              {moment(post.createdAt).format("MMM DD, YYYY")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default ProfilePostCard;
