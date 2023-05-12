import React from 'react';
import moment from 'moment';
import { Post } from '@/types';
import Image from 'next/image'
import parse from 'html-react-parser';
import Link from 'next/link';
const PostDetail = ({post}: {post: Post}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
      <div className="flex items-center justify-center overflow-hidden shadow-md mb-6 w-full h-96">
        <Image
          unoptimized
          src={post.featuredImage}
          alt={post.featuredImage}
          height={50}
          width={50}
          className="w-full shadow-lg rounded-t-lg lg:rounded-lg" 
        />
      </div>
      <div className="px-4 lg:px-0">
        <div className="flex items-center mb-8 w-full">
          <Link href={`/profile/${post.author.id}`}>
            <div className="hidden md:flex justify-center lg:mb-0 lg:w-auto mr-8 items-center cursor-pointer">
              <img
                alt={post.author.username}
                height="30px"
                width="30px"
                className="align-middle rounded-full"
                src={post.author.uri}
              />
              <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg">{post.author.username}</p>
            </div>
          </Link>
          <div className="font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
          </div>
        </div>
        <h1 className="mb-8 text-3xl font-semibold">{post.title}</h1>
        {parse(post.content)}
      </div>
    </div>
  );
};

export default PostDetail;
