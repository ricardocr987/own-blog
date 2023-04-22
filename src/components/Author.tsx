import React from 'react';
import Image from 'next/image';
import { Author } from '@/types';

const Author = ({author}: {author: Author}) => (
  <div className="text-center mt-20 mb-8 p-12 relative rounded-lg bg-black bg-opacity-20">
    <div className="absolute left-0 right-0 -top-14">
      <Image
        unoptimized
        width={30}
        height={30}
        alt={author.username}
        className="align-middle rounded-full"
        src={author.uri}
      />
    </div>
    <h3 className="text-white mt-4 mb-4 text-xl font-bold">{author.username}</h3>
    <p className="text-white text-ls">{author.bio}</p>
  </div>
);

export default Author;
