export type Author = {
    username: string // ID
    createdAt: number
    bio: string
    uri: string
    pubkey: string
    articles: string[]
}

export type ReducedAuthor = {
    username: string
    uri: string
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
    categories: string[]
}

export type Comment = {
    id: string
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
    id: number;
    text: string;
    type: NotificationType
}

export type GetUserResponse = {
    [key: string]: Author
}