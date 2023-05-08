import { AuthWrapper, EditPostCard } from "@/components";
import { authorInitValues } from "@/constants";
import { Author, Post } from "@/types";
import { useState } from "react";

const posts: Post[] = [
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
        categories: [  
            'Solana'
        ]
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
        categories: [  
            'Aleph'
        ]
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
        categories: [  
            'Aleph'
        ]
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
        categories: [  
            'Aleph'
        ]
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
        categories: [  
            'Aleph'
        ]
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
        categories: [  
            'Aleph'
        ]
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
        categories: [  
            'Aleph'
        ]
    },
]

const MyArticles = () => {
    const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);

    return (
        <AuthWrapper setAuthorDetails={setAuthorDetails}>
            <div className="container mx-auto px-10 mb-8">
                <div className="text-white text-2xl font-bold mb-4">
                    Your articles:
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {posts.map((post, index) => (
                        <EditPostCard key={index} post={post} />
                    ))}
                </div>
            </div>
        </AuthWrapper>
    );
};

export default MyArticles;
