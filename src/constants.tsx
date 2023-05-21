import { Author, Post, Responsive, TokenInfo } from "@/types";
import { ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { Envs } from "@/config";

type ArrowProps = {
    onClick?: void
}

export const CustomLeftArrow = ({ onClick }: ArrowProps) => {
    return (
        onClick ? 
            <div className="absolute arrow-btn left-0 text-center py-3 cursor-pointer border rounded-full transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </div>
        : <></>
    )
}
  
export const CustomRightArrow = ({ onClick }: ArrowProps) => {
    return (
        onClick ? 
            <div className="absolute arrow-btn right-0 text-center py-3 cursor-pointer border rounded-full transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white" onClick={() => onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
        : <></>
    );
}
  
export const responsiveCarousel = {
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

export const responsiveEditor: Record<string, Responsive> = {
    'superLargeDesktop': {
        breakpoint: { max: 4000, min: 1024 },
        width: '100%',
        height: '500px'
    },
    'desktop': {
        breakpoint: { max: 1024, min: 768 },
        width: '100%',
        height: '450px'
    },
    'tablet': {
        breakpoint: { max: 768, min: 640 },
        width: '100%',
        height: '400px'
    },
    'mobile': {
        breakpoint: { max: 640, min: 0 },
        width: '100%',
        height: '320px'
    }
};

export const confirmOptions: ConfirmOptions = { commitment: "confirmed" };
export const connection = new Connection(Envs.RPC || "https://api.mainnet-beta.solana.com");

export const BRICK_PROGRAM_ID = 'BrickarF2QeREBZsapbhgYPHJi5FYkJVnx7mZhxETCt5'
export const BRICK_PROGRAM_ID_PK = new PublicKey(BRICK_PROGRAM_ID)

export const METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
export const METADATA_PROGRAM_ID_PK = new PublicKey(METADATA_PROGRAM_ID)

export const symbolFromMint: Record<string, string> = {
    'So11111111111111111111111111111111111111112': 'SOL',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'USDC',
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 'MSOL',
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'BONK',
}
export const mintFromSymbol: Record<string, string> = {
    'SOL': 'So11111111111111111111111111111111111111112',
    'USDC': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    'MSOL': 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    'BONK': 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
}
export const decimalsFromPubkey: Record<string, number> = {
    'So11111111111111111111111111111111111111112': 9,
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 6,
    'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': 9,
    'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 5,
}

export const imagesPathFromMint: Record<string, string> = {
    'So11111111111111111111111111111111111111112': '/solanaLogoMark.svg',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': '/usdcLogo.svg',
}

export const messagesAddress = "BriCkuwezZFQhaSuwF833uZUkepeaKK5jz95nnGMS9JE";
export const authorInitValues: Author = {
    username: '',
    pubkey: '',
    createdAt: 0,
    bio: '',
    uri: '',
    subscriptionPrice: 0,
    subscriptionToken: '',
    subscriptionBrickToken: '',
    tags: []
}
export const postInitialValues: Post = {
    id: '',
    createdAt: 0,
    featuredImage: '',
    title: '',
    author: {
        id: '',
        username: '',
        uri: ''
    }, 
    summary: '',
    content: '',
    tags: [],
    commentsPostHash: ''
};

export const tokens: TokenInfo[] = [ 
    {
        name: "SOL",
        image: "/solanaLogoMark.svg"
    },
    {
        name: "USDC",
        image: "/usdcLogo.svg"
    },
];

export function initialTokenValues(mint: string | undefined) : TokenInfo | undefined {
    if(!mint) return undefined
    return ({
        name: symbolFromMint[mint],
        image: imagesPathFromMint[mint]
    })
}