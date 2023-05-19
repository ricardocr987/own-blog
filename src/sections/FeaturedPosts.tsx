import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Post } from '@/types';
import { CustomLeftArrow, CustomRightArrow, responsiveCarousel } from '@/constants';
import FeaturedPostCard from '@/components/FeaturedPostCard';

const featuredPosts: Post[] = [
  {     
    id: '1',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Solana',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },
    summary: 'Solana is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
  {     
    id: '2',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },
    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
  {     
    id: '2',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
  {     
    id: '2',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
  {     
    id: '2',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
  {     
    id: '2',
    createdAt: Date.now(),
    featuredImage: 'https://res.cloudinary.com/dtzqgftjk/image/upload/v1675415515/SolanaCC_Poap_Sq_qhhojm.jpg',
    title: 'Aleph',
    author: {
      username: 'Riki',
      id: '',
      uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
    },    summary: 'Aleph is great',
    content: 'because is cheap, fast and with an awesome UX',
    tags: [  
      'Aleph'
    ],
    commentsPostHash: '',
  },
]

const FeaturedPosts = () => {
  return (
    <div className="mb-8">
      <Carousel 
        infinite
        swipeable
        customLeftArrow={<CustomLeftArrow />} 
        customRightArrow={<CustomRightArrow />} 
        responsive={responsiveCarousel} 
        itemClass="px-2" 
      >
        {featuredPosts.map((post, index) => (
          <FeaturedPostCard key={index} post={post} />
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedPosts;
