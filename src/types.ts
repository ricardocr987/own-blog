export type Author = {
    username: string // ID
    createdAt: number
    bio: string
    uri: string
}

export type Post = {
    id: string
    createdAt: number
    featuredImage: string
    title: string
    author: Author
    summary: string
    content: string
    categories: Category[]
}

export type Category = {
    id: string
    name: string
}

export type Comment = {
    id: string
    createdAt: number
    username: string
    message: string
}

export type AdjacentPost = {
    previous: Post
    next: Post
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