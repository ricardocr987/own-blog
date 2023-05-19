import { Author, Comments, NotificationType, Post, Subscription } from '@/types';
import { NotificationContext } from '@/contexts/NotificationContext';
import { authOptions } from '../api/auth/[...nextauth]';
import { PostDetail, CommentsForm, CommentsComponent } from '@/components';
import React, { useContext, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';

type ServerSideProps = {
    props: {
        post: Post | null
        comments: Comments | null
        allowed: boolean
        author: Author | null
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<ServerSideProps> {
    const { params } = context;
    let props: ServerSideProps = {
        props: {
            post: null,
            comments: null,
            allowed: false,
            author: null,
        },
    };
    if (params && typeof params.id === "string") {
        try {
            const authorResponse = await fetch(`/api/getUser?param=${encodeURIComponent(params.id)}`, { method: 'GET' });
            const author = JSON.parse(await authorResponse.json()) as Author
            const subscriptionResponse = await fetch(`/api/getSubscription?param=${encodeURIComponent(params.id)}`, { method: 'GET' });
            const subscription = JSON.parse(await subscriptionResponse.json()) as Subscription
            if (author.subscriptionPrice === 0) props.props.allowed = true
            else {
                const session = await getServerSession(context.req, context.res, authOptions());
                if (session && subscription.subs.some(sub => sub.pubkey === session.user.id)) props.props.allowed = true
            }
            if (!props.props.allowed) return props

            const articleResponse = await fetch(`/api/getArticle?param=${encodeURIComponent(params.id)}`, { method: 'GET' });
            const commentsResponse = await fetch(`/api/getComments?param=${encodeURIComponent(params.id)}`, { method: 'GET' });
            const comments = JSON.parse(await commentsResponse.json()) as Comments
            comments.comments.sort((a, b) => b.createdAt - a.createdAt)
            props.props.post = JSON.parse(await articleResponse.json()) as Post
            props.props.comments = comments
            props.props.author = author
        } catch(e) {
            return props
        }
    }
    return props
}


const PostDetails = ({ post, comments, allowed, author }: ServerSideProps['props']) => {
    const { addNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (!allowed) addNotification('You are not subscribed to this author', NotificationType.INFO);
        else if (!post) addNotification('This article does not exist', NotificationType.ERROR);
    }, []);
    
    return (
        <>
            {post &&
                <div className="container mx-auto px-10 mb-8">
                    <PostDetail post={post} />
                    <CommentsForm postId={post.id} />
                    { comments && <CommentsComponent comments={comments.comments} /> }
                </div>
            }
        </>
    );
};

export default PostDetails;