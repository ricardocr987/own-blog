import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { FeaturedPostCard } from '@/components';
import { Post } from '@/types';
import { customLeftArrow, customRightArrow, responsive } from '@/constants';

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

const FeaturedPosts = () => {
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
