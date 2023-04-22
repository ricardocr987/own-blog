import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { FeaturedPostCard } from '@/components';
import { Post } from '@/types';

const featuredPosts: Post[] = [
  {     
    id: '1',
    createdAt: Date.now(),
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
      {     
        id: '1',
        name: 'Solana'
      },
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
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
      {     
        id: '2',
        name: 'Aleph'
      },
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
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
      {     
        id: '2',
        name: 'Aleph'
      },
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
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
      {     
        id: '2',
        name: 'Aleph'
      },
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
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
      {     
        id: '2',
        name: 'Aleph'
      },
    ]
  },
  {     
    id: '2',
    createdAt: Date.now(),
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
      {     
        id: '2',
        name: 'Aleph'
      },
    ]
  },
]

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 640 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

const FeaturedPosts = () => {
  const customLeftArrow = (
    <div className="absolute arrow-btn left-0 text-center py-3 cursor-pointer bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </div>
  );

  const customRightArrow = (
    <div className="absolute arrow-btn right-0 text-center py-3 cursor-pointer bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800 rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 text-white w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  );

  return (
    <div className="mb-8">
      <Carousel infinite customLeftArrow={customLeftArrow} customRightArrow={customRightArrow} responsive={responsive} itemClass="px-4">
        {featuredPosts.map((post, index) => (
          <FeaturedPostCard key={index} post={post} />
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedPosts;
