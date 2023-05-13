export type Author = {
    username: string // ID
    createdAt: number
    bio: string
    uri: string
    pubkey: string
    subscriptionPrice?: number
    subscriptionToken?: string
    subscriptionBrickToken?: string
    articles: string[]
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

export type ReducedAuthor = {
    username: string
    uri: string
    id: string
}

export type UsernameAndPubkey = {
    username: string
    id: string
}

export type ReducedPost = {
    id: string
    title: string
    author: ReducedAuthor
}

export type Post = {
    id: string
    createdAt: number
    featuredImage: string
    title: string
    author: ReducedAuthor
    summary: string
    content: string
    tags: string[]
    comments?: Comment[]
}

export type Comment = {
    createdAt: number
    username: string
    message: string
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

export type GetUserResponse = {
    [key: string]: Author
}

export type GetArticleResponse = {
    [key: string]: Post
}

export type NextAuthUser = {
    id: string,
    username: string,
    uri: string,
}