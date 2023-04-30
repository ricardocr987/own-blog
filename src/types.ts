export type Author = {
    username: string // ID
    createdAt: number
    bio: string
    uri: string
}

export type Post = {
    id: string
    price: number
    token?: string
    createdAt: number
    featuredImage: string
    title: string
    author: Author
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