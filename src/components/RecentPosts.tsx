import React from 'react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import { Post } from '@/types';

const posts: Post[] = [
  {     
    id: '1',
    createdAt: Date.now(),
    price: 0,
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Solana',
    author: {
      username: 'Riki',
      createdAt: Date.now(),
      bio: 'vibing',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },
    summary: 'Solana is great',
    content: 'because is cheap, fast and with an awesome UX',
    categories: [  
      'Solana',
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
    price: 0,
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      createdAt: Date.now(),
      bio: 'vibing',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },
    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    categories: [  
      'Aleph',
    ]
  },
]

const RecentPosts = ({ id }: {id?: string}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">{id ? 'Related Posts' : 'Recent Posts'}</h3>
      {posts.map((post, index) => (
        <div key={index} className="flex items-center w-full mb-4">
          <div className="w-16 flex-none">
            <Image
              alt={post.title}
              unoptimized
              className="align-middle rounded-full"
              width={50}
              height={50}
              src={post.featuredImage}
            />
          </div>
          <div className="flex-grow ml-4">
            <p className="text-gray-500 font-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
            <Link href={`/post/${post.id}`} className="text-md" key={index}>{post.title}</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentPosts;
