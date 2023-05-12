import React, { useEffect } from 'react';
import { PostDetail, Comments, CommentsForm } from '@/components';
import { NotificationType, Post } from '@/types';
import {  GetArticleResponse } from '@/types';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { GetServerSidePropsContext } from 'next';
import { messagesAddress } from '@/constants';
import NotificationsContainer from '@/components/Notification';
import { useNotification } from '@/hooks';

type ServerSideProps = {
    props: {
        post: Post | null
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
                return {
                    props: {
                        post: response[params.id],
                    }
                }
            }
        } catch(e) {
            return {
                props: {
                    post: null,
                }
            }
        }
    }
    return {
        props: {
            post: null,
        }
    }
}


const PostDetails = ({ post }: ServerSideProps['props']) => {
    const { addNotification, notifications, removeNotification } = useNotification();

    useEffect(() => {
        if (!post) {
        addNotification('This article does not exist', NotificationType.ERROR);
        }
    }, []);
    
    return (
        <>
            {post &&
                <div className="container mx-auto px-10 mb-8">
                    <PostDetail post={post} />
                    <CommentsForm post={post} />
                    { post.comments && <Comments comments={post.comments} /> }
                </div>
            }
            <NotificationsContainer 
                notifications={notifications} 
                removeNotification={removeNotification}
            />
        </>
    );
};

export default PostDetails;