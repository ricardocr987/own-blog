import React, { useContext, useEffect } from 'react';
import { PostDetail, Comments, CommentsForm } from '@/components';
import { GetUserResponse, NextAuthUser, NotificationType, Post } from '@/types';
import {  GetArticleResponse } from '@/types';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { GetServerSidePropsContext } from 'next';
import { messagesAddress } from '@/constants';
import { NotificationContext } from '@/contexts/NotificationContext';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

type ServerSideProps = {
    props: {
        post?: Post
        notAllowed?: boolean 
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<ServerSideProps> {
    const { params } = context
    if (params && typeof params.id === "string") {
        try {
            const response = await getAggregate<GetArticleResponse>({
                keys: [params.id],
                address: messagesAddress,
                APIServer: 'https://api2.aleph.im'
            });
            if (response) {
                if (response[params.id].comments) response[params.id].comments?.sort((a, b) => b.createdAt - a.createdAt)
                const authorResponse = await getAggregate<GetUserResponse>({
                    keys: [response[params.id].author.id],
                    address: messagesAddress,
                    APIServer: 'https://api2.aleph.im'
                });
                if (!authorResponse[response[params.id].author.id].subscriptionPrice || authorResponse[response[params.id].author.id].subscriptionPrice === 0) {
                    return {
                        props: {
                            post: response[params.id],
                        }
                    }
                } else {
                    const session = await getServerSession(context.req, context.res, authOptions());
                    if (session) {
                        if (authorResponse[response[params.id].author.id].subs?.some(sub => sub.pubkey === session.user.id)) {
                            return {
                                props: {
                                    post: response[params.id],
                                }
                            }
                        } else {
                            const user = Object.fromEntries(
                                Object.entries(session.user).filter(([_, value]) => value !== undefined)
                            ) as NextAuthUser
                            if (user.id === authorResponse[response[params.id].author.id].pubkey){
                                return {
                                    props: {
                                        post: response[params.id],
                                    }
                                }
                            }
                            return {
                                props: {
                                    notAllowed: true
                                }
                            }
                        }
                    }
                }
            }
        } catch(e) {
            return {
                props: {}
            }
        }
    }
    return {
        props: {}
    }
}


const PostDetails = ({ notAllowed, post }: ServerSideProps['props']) => {
    const { addNotification } = useContext(NotificationContext);

    useEffect(() => {
        if (notAllowed) {
            addNotification('You are not subscribed to this author', NotificationType.INFO);
        } else {
            if (!post) addNotification('This article does not exist', NotificationType.ERROR);
        }
    }, []);
    
    return (
        <>
            {post &&
                <div className="container mx-auto px-10 mb-8">
                    <PostDetail post={post} />
                    <CommentsForm postId={post.id} />
                    { post.comments && <Comments comments={post.comments} /> }
                </div>
            }
        </>
    );
};

export default PostDetails;