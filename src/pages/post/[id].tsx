import { Author, Comments, NextAuthUser, NotificationType, Post, PostStoredAleph, Subscription } from '@/types';
import { PostDetail, CommentsForm, CommentsComponent } from '@/components';
import { NotificationContext } from '@/contexts/NotificationContext';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { authOptions } from '../api/auth/[...nextauth]';
import React, { useContext, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { messagesAddress } from '@/constants';
import { decryptData } from '@/utils/encrypt';

type ServerSideProps = {
    props: {
        post: Post | null
        comments: Comments | null
        allowed: boolean
        isAuthor: boolean
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
            isAuthor: false
        },
    };
    if (params && typeof params.id === "string") {
        try {
            const articleResponse = await getPost<PostStoredAleph>({
                types: 'PostStoredAleph',
                pagination: 1,
                page: 1,
                refs: [],
                addresses: [messagesAddress],
                tags: [`article:${params.id}`],
                hashes: [],
                APIServer: "https://api2.aleph.im"
            });
            props.props.post = JSON.parse(decryptData(articleResponse.posts[0].content.data)) as Post
            const commentsResponse = await getPost<PostStoredAleph>({
                types: 'PostStoredAleph',
                pagination: 1,
                page: 1,
                refs: [],
                addresses: [messagesAddress],
                tags: [],
                hashes: [props.props.post.commentsPostHash],
                APIServer: "https://api2.aleph.im"
            });
            props.props.comments = JSON.parse(decryptData(commentsResponse.posts[0].content.data)) as Comments
            props.props.comments.comments.sort((a, b) => b.createdAt - a.createdAt)
            const userResponse = await getPost<PostStoredAleph>({
                types: 'PostStoredAleph',
                pagination: 1,
                page: 1,
                refs: [],
                addresses: [messagesAddress],
                tags: [`user:${props.props.post.author.id}`],
                hashes: [],
                APIServer: "https://api2.aleph.im"
            });
            if (userResponse.posts[0].content.data) {
                props.props.author = JSON.parse(decryptData(userResponse.posts[0].content.data)) as Author
                if (props.props.author.subscriptionPrice > 0) {
                    const session = await getServerSession(context.req, context.res, authOptions());
                    if (session && session.user.username) {
                        const user = Object.fromEntries(
                            Object.entries(session.user).filter(([_, value]) => value !== undefined)
                        ) as NextAuthUser;
                        if (user.id === params.id){
                            props.props.allowed = true;
                            props.props.isAuthor = true;
                        } 
                        else {
                            const subsResponse = await getPost<PostStoredAleph>({
                                types: 'PostStoredAleph',
                                pagination: 1,
                                page: 1,
                                refs: [],
                                addresses: [messagesAddress],
                                tags: [`subscription:${props.props.post.author.id}`],
                                hashes: [],
                                APIServer: "https://api2.aleph.im"
                            });
                            if (subsResponse.posts[0].content.data) {
                                const subscription = JSON.parse(decryptData(subsResponse.posts[0].content.data)) as Subscription
                                props.props.allowed = subscription.subs.some((sub) => sub.pubkey === user.id && sub.timestamp > Date.now());
                            }
                        }

                    }
                } else {
                    props.props.allowed = true
                }
            }
        } catch(e) {
            if (!props.props.allowed) props.props.post = null
            return props
        }
    }
    return props
}


const PostDetails = ({ post, comments, allowed }: ServerSideProps['props']) => {
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
                    { comments && 
                        <>
                            <CommentsForm comments={comments} hashId={post.commentsPostHash} />
                            <CommentsComponent comments={comments.comments} /> 
                        </>
                    }
                </div>
            }
        </>
    );
};

export default PostDetails;