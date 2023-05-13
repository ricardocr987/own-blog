import NotificationsContainer from '@/components/Notification';
import ProfilePostCard from '@/components/ProfilePostCard';
import { confirmOptions, connection, messagesAddress } from '@/constants';
import { useNotification } from '@/hooks';
import { Author, GetArticleResponse, GetUserResponse, NextAuthUser, NotificationType, Post } from '@/types';
import { convertToLamports } from '@/utils/solToLamports';
import { PublicKey } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram, Transaction } from '@solana/web3.js';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from '../api/auth/[...nextauth]';
import { AuthorProfileView } from '@/components/AuthorProfileView';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';

type ServerSideProps = {
    props: {
        profile: Author | null
        articles: Post[] | null
        author: boolean
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<ServerSideProps> {
    const session = await getServerSession(context.req, context.res, authOptions)
    let author = false
    const { params } = context
    if (params && typeof params.id === "string" && session) {
        const user = Object.fromEntries(
            Object.entries(session.user).filter(([_, value]) => value !== undefined)
        ) as NextAuthUser;
        if (user.id === params.id) author = true
        try {
            const response = await getAggregate<GetUserResponse>({
                keys: [params.id],
                address: messagesAddress,
                APIServer: 'https://api2.aleph.im'
            });
            const articlesResponse = response[params.id].articles;
            console.log(articlesResponse)
            if (articlesResponse.length > 0) {
                const articlesPromises = articlesResponse.map(async (article) => {
                    const res = await getAggregate<GetArticleResponse>({
                        keys: [article],
                        address: messagesAddress,
                        APIServer: 'https://api2.aleph.im'
                    });
                    return res[article];
                });
                const articles = await Promise.all(articlesPromises);
                if (response && response[params.id]) {
                    return {
                        props: {
                            profile: response[params.id],
                            articles,
                            author
                        }
                    }
                }
            }
            else {
                return {
                    props: {
                        profile: response[params.id],
                        articles: null,
                        author
                    }
                }
            }
        } catch(e) {
            return {
                props: {
                    profile: null,
                    articles: null,
                    author
                }
            }
        }
    }
    return {
        props: {
            profile: null,
            articles: null,
            author
        }
    }
}

export default function Profile({ profile, articles, author }: ServerSideProps['props']) {
    const { addNotification, notifications, removeNotification } = useNotification();
    if (!profile) {
        addNotification('This user does not exist', NotificationType.ERROR);
    }
    const wallet = useWallet()

    const handleTip = async () => {
        if (profile && wallet.publicKey) {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(profile?.pubkey),
                    lamports: convertToLamports(0.1),
                }),
            );
            
            const signature = await wallet.sendTransaction(transaction, connection, confirmOptions)
            if (signature) addNotification(`Tip sent!`, NotificationType.SUCCESS)
        }
    }

    const handleSuscription = () => {

    }

    return (
        <div className="container mx-auto md:px-16 lg:px-68">
            {profile &&
                <>
                    <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 md:py-10 px-10 flex justify-center items-center">
                            <div className="w-full space-y-4 flex flex-col items-center">
                                <Image
                                    unoptimized
                                    width={100}
                                    height={100}
                                    alt={profile.username}
                                    className="drop-shadow-lg rounded-full flex justify-center items-center"
                                    src={profile.uri}
                                />
                                <p className="text-black text-2xl text-center whitespace-normal">{profile.username}</p>
                                <p className="text-black text-lg text-center whitespace-normal">{profile.bio}</p>
                            </div>
                        </div>
                        <div className="py-5 md:py-10 px-10 mb-5 mt-5 flex justify-center items-center border rounded-lg">
                            {author ?
                                <AuthorProfileView profile={profile}/>
                            :
                                <div className="w-full">
                                    <div className="mb-4 min-h-18">
                                        <p className="text-black font-bold text-lg">Bio:</p>
                                        <p className="text-black text-base max-w-full break-words">{profile.bio}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-black font-bold text-lg">Created at:</p>
                                        <p className="text-black text-base max-w-full break-words">{moment(profile.createdAt).format('MMM DD, YYYY')}</p>
                                    </div>
                                    <div className="flex flex-col items-center mt-4">
                                        {profile.subscriptionToken ?
                                            <div className="flex flex-col items-center">
                                                <p className="mb-2">
                                                    This user requiere to pay a {profile.subscriptionPrice} on {profile.subscriptionToken}
                                                </p>
                                                <div 
                                                    className="flex justify-center py-2 w-32 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                                    onClick={() => handleSuscription}
                                                >
                                                    Subscribe
                                                </div>  
                                            </div>
                                        :
                                            <div className="flex flex-col items-center">
                                                <p className="mb-2">
                                                    This user publishes content for free, but you can support with a tip!
                                                </p>
                                                <div 
                                                    className="flex justify-center py-2 w-32 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                                    onClick={() => handleTip}
                                                >
                                                    TIP 0.1 SOL
                                                </div>  
                                            </div>      
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {articles && articles.length > 0 &&
                        <div className='mb-4'>
                            {articles.map((post, index) => (
                                <ProfilePostCard key={index} post={post} />
                            ))}
                        </div>
                    }
                    <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 px-10 flex justify-center text-center">
                            <p className="text-black text-4xl text-center">Dashboard</p>
                        </div>
                        <div className="py-5 h-96 border rounded mb-4 flex justify-center text-center">
                            CREATE DATA CHARTS
                        </div>
                    </div>
                </>
            }
            {/*<NotificationsContainer 
                notifications={notifications} 
                removeNotification={removeNotification}
            />*/}
        </div>
    );
}