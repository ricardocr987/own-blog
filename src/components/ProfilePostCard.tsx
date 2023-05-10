import React from 'react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types';

const ProfilePostCard = ({post}: {post: Post}) => (
  <div className="relative h-40">
    <Link href={`/post/${post.id}`}><span className="cursor-pointer absolute w-full h-full" />
      <div className="w-full h-full flex rounded-lg shadow-md mb-4 bg-white">
        <Image
          unoptimized
          width={30}
          height={30}
          alt={post.featuredImage}
          className="rounded-lg bg-center bg-no-repeat bg-cover shadow-md inline-block w-40 h-40"
          src={post.featuredImage}
        />
        <div className="flex flex-col flex-1 justify-center p-4">
          <div className="grid grid-cols-10 grid-rows-3 gap-y-2">
            <p className="text-black font-semibold text-2xl col-start-1 col-end-4 row-start-1 row-end-2">{post.title}</p>
            <p className="text-black text-xl col-start-1 col-end-8 row-start-2 row-end-3">{post.summary}</p>
            <p className="text-black text-xs col-start-9 col-end-11 row-start-3 row-end-4">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
          </div>
        </div>
      </div>
    </Link>
  </div>
);

export default ProfilePostCard;
