export type Author = {
    username: string // ID
    createdAt: number
    bio: string
    uri: string
    pubkey: string
    subscriptionPrice: number
    subscriptionToken: string
    subscriptionBrickToken: string
    tags: string[]
}

export type UpdateSubscriptionPayload = {
    subscriptionPrice: number
    subscriptionToken: string
    subscriptionBrickToken: string
    brickSignature: string
}

export type Subscription = {
    subs: SubscriptionInfo[]
}

export type SubscriptionInfo = {
    pubkey: string
    timestamp: number
    subTransaction: string
    authorId: string
    brickToken: string
}

export type Uri = {
    name: string;
    symbol: string;
    description: string;
    image: string;
    attributes: Array<{
        trait_type: string;
        value: string;
    }>;
    properties: {
        files: Array<{
            uri: string;
            type: string;
        }>;
        category: string;
    };
};

export type Post = {
    id: string
    author: AuthorInfo
    createdAt: number
    featuredImage: string
    title: string
    summary: string
    content: string
    tags: string[]
    commentsPostHash: string
}

export type Comments = {
    articleId: string
    comments: CommentInfo[]
}

export type CommentInfo = {
    createdAt: number
    username: string
    message: string
    hashId: string
}

export type NavLink = {
    url: string
    name: string
}

type Breakpoint = {
    min: number
    max: number
};

export type Responsive = {
    breakpoint: Breakpoint
    width: string
    height: string
};

export type TokenInfo = {
    name: string
    image: string
}

export enum NotificationType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

export interface Notification {
    id: string;
    text: string;
    type: NotificationType
}

export type NextAuthUser = {
    id: string,
    username: string,
    uri: string,
}

export type Withdrawals = {
    tokenAccount: string
    tokenMint: string
    paidMint: string
    seller: string
    pubkey: string
    buyer: string
    price: number
    paymentTimestamp: string
    refundConsumedAt: string
    bump: number
    bumpVault: number
}

export type PostStoredAleph = {
    data: string,
    tags: string[]
}

export type AuthorInfo = {
    username: string
    uri: string
    id: string
}