import ProfilePostCard from '@/components/ProfilePostCard';
import { confirmOptions, connection, messagesAddress, symbolFromMint } from '@/constants';
import { Author, NextAuthUser, NotificationType, Post, PostStoredAleph, Subscription, SubscriptionInfo } from '@/types';
import { convertToLamports } from '@/utils/conversions';
import { PublicKey } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from '../api/auth/[...nextauth]';
import { AuthorProfileView } from '@/components/AuthorProfileView';
import { NotificationContext } from '@/contexts/NotificationContext';
import { useContext } from 'react';
import { getTokenPubkey, getPaymentPubkey, getPaymentVaultPubkey } from '@/services';
import { BuyTokenInstructionAccounts, BuyTokenInstructionArgs, UseTokenInstructionAccounts, createBuyTokenInstruction, createUseTokenInstruction } from '@/utils/solita';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';
import { getWithdrawals } from '@/utils/getWithdrawals';
import { Get as getPost } from 'aleph-sdk-ts/dist/messages/post';
import { decryptData } from '@/utils/encrypt';

type ServerSideProps = {
    props: {
        profile: Author | null
        articles: Post[] | null
        withdrawals: string | null
        author: boolean
        subscriber: {
            is: boolean
            timeleft: number
        }
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<ServerSideProps> {
    const { params } = context;
    let props: ServerSideProps = {
        props: {
            profile: null,
            articles: null,
            withdrawals: null,
            subscriber: {
                is: false,
                timeleft: 0
            },
            author: false,
        },
    };
  
    if (params && typeof params.id === "string") {
        try {
            const userResponse = await getPost<PostStoredAleph>({
                types: 'PostStoredAleph',
                pagination: 1,
                page: 1,
                refs: [],
                addresses: [messagesAddress],
                tags: [`user:${params.id}`],
                hashes: [],
                APIServer: "https://api2.aleph.im"
            });
            if (userResponse.posts[0].content.data) {
                props.props.profile = JSON.parse(decryptData(userResponse.posts[0].content.data)) as Author
                const session = await getServerSession(context.req, context.res, authOptions());
                if (props.props.profile.subscriptionPrice > 0) {
                    if (session && session.user.username) {
                        const user = Object.fromEntries(
                            Object.entries(session.user).filter(([_, value]) => value !== undefined)
                        ) as NextAuthUser;
                        if (user.id === params.id){
                            props.props.author = true;
                            const withdrawals = JSON.stringify(await getWithdrawals(new PublicKey(params.id), connection));
                            if (withdrawals) props.props.withdrawals
                        } else {
                            const subsResponse = await getPost<PostStoredAleph>({
                                types: 'PostStoredAleph',
                                pagination: 1,
                                page: 1,
                                refs: [],
                                addresses: [messagesAddress],
                                tags: [`subscription:${params.id}`],
                                hashes: [],
                                APIServer: "https://api2.aleph.im"
                            });
                            if (subsResponse.posts[0].content.data) {
                                const subscription = JSON.parse(decryptData(subsResponse.posts[0].content.data)) as Subscription
                                if (subscription.subs.length > 0) {
                                    props.props.subscriber.is = subscription.subs.some((sub) => sub.pubkey === user.id);
                                    const subscriber = subscription.subs.find((sub) => sub.pubkey === user.id);
                                    const monthTimestamp = 30 * 24 * 60 * 60 * 1000;
                                    if (subscriber) props.props.subscriber.timeleft = subscriber.timestamp + monthTimestamp;
                                }
                            }
                        }
                    }
                }
                if (session && session.user.username) {
                    const user = Object.fromEntries(
                        Object.entries(session.user).filter(([_, value]) => value !== undefined)
                    ) as NextAuthUser;
                    if (user.id === params.id){
                        props.props.author = true;
                        const withdrawals = JSON.stringify(await getWithdrawals(new PublicKey(params.id), connection));
                        if (withdrawals) props.props.withdrawals = withdrawals
                    }
                }
                const articlesResponse = await getPost<PostStoredAleph>({
                    types: 'PostStoredAleph',
                    pagination: 1,
                    page: 1,
                    refs: [],
                    addresses: [messagesAddress],
                    tags: [`article:${params.id}`],
                    hashes: [],
                    APIServer: "https://api2.aleph.im"
                });
                props.props.articles = articlesResponse.posts.map((article) => JSON.parse(decryptData(article.content.data)) as Post);
            }
        } catch(e) {
            console.log(e)
        }
    }

    return props;
}

export default function Profile({ subscriber, profile, articles, author, withdrawals }: ServerSideProps['props']) {
    const { addNotification } = useContext(NotificationContext);

    if (!profile) addNotification('This user does not exist', NotificationType.ERROR);
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
            let blockhash = (await connection.getLatestBlockhash('finalized'));
            const confirmation = await connection.confirmTransaction({
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockhash.lastValidBlockHeight,
                signature,
            });
            if (!confirmation.value.err) addNotification(`Tip sent!`, NotificationType.SUCCESS)
        }
    }

    const handleSubscription = async () => {
        if (!wallet.publicKey) {
            addNotification('You need to connect your wallet', NotificationType.WARNING) 
            return
        } 
        if (!profile || !profile.subscriptionBrickToken || !profile.subscriptionToken) return

        const tokenMint = new PublicKey(profile.subscriptionBrickToken)
        const acceptedMint = new PublicKey(profile.subscriptionToken)
        const token = getTokenPubkey(tokenMint)
        const buyerTokenVault = await getAssociatedTokenAddress(tokenMint, wallet.publicKey)
        const buyerTransferVault = await getAssociatedTokenAddress(acceptedMint, wallet.publicKey)
        const buyTimestamp = new BN(Math.floor(Date.now()/1000))
        const payment = getPaymentPubkey(tokenMint, wallet.publicKey, Buffer.from(buyTimestamp.toArray('le', 8)))
        const paymentVault = getPaymentVaultPubkey(payment)
        const accounts: BuyTokenInstructionAccounts = {
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            clock: SYSVAR_CLOCK_PUBKEY,
            authority: wallet.publicKey,
            token,
            tokenMint,
            buyerTransferVault,
            acceptedMint,
            payment,
            paymentVault,
            buyerTokenVault,
        }
        const args: BuyTokenInstructionArgs = { timestamp: buyTimestamp }
        const useAccounts: UseTokenInstructionAccounts = {
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: SYSVAR_RENT_PUBKEY,
            authority: wallet.publicKey,
            token,
            tokenMint: new PublicKey(profile.subscriptionBrickToken),
            buyerTokenVault: buyerTokenVault,
        }
        try {
            const transaction = new Transaction().add(createBuyTokenInstruction(accounts, args)).add(createUseTokenInstruction(useAccounts))
            let blockhash = (await connection.getLatestBlockhash('finalized'));
            transaction.recentBlockhash = blockhash.blockhash;
            const signature = await wallet.sendTransaction(
                transaction,
                connection,
            )
            const confirmation = await connection.confirmTransaction({
                blockhash: blockhash.blockhash,
                lastValidBlockHeight: blockhash.lastValidBlockHeight,
                signature,
            });
            if (!confirmation.value.err) {
                const subscriptionInfo: SubscriptionInfo = {
                    pubkey: wallet.publicKey.toString(),
                    timestamp: Date.now(),
                    subTransaction: signature,
                    authorId: profile.pubkey,
                    brickToken: profile.subscriptionBrickToken
                }
                const res = await fetch('/api/registerSubscription', {
                    method: 'POST',
                    body: JSON.stringify(subscriptionInfo)
                })
                if (res.status === 406) addNotification("Internal server error", NotificationType.ERROR)
                if (res.status === 201) addNotification("Subscription completed", NotificationType.SUCCESS);
            } else {
                addNotification("Can not confirm your transaction", NotificationType.ERROR)
            }
        } catch(e) {
            console.log(e)
        }
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
                                <AuthorProfileView profile={profile} withdrawals={withdrawals}/>
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
                                    <div className=" mt-6">
                                        {profile.subscriptionToken ?
                                            subscriber.is ?
                                                <div className="flex text-center justify-center py-2 w-42 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer">
                                                    Subscribed until {moment(subscriber.timeleft).format('MMM DD, YYYY')}
                                                </div> 
                                            :
                                                <div 
                                                    className="flex text-center justify-center py-2 w-42 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                                    onClick={() => handleSubscription()}
                                                >
                                                    Subscribe for {profile.subscriptionPrice} {symbolFromMint[profile.subscriptionToken]}
                                                </div> 
                                        :
                                            <div className="flex flex-col items-center">
                                                <p className="mb-2">
                                                    This user publishes content for free, but you can support with a tip!
                                                </p>
                                                <div 
                                                    className="flex justify-center py-2 w-32 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                                    onClick={() => handleTip()}
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
                    {author &&
                        <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 bg-white rounded-lg shadow-md mb-4">
                            <div className="py-5 px-10 flex justify-center text-center">
                                <p className="text-black text-4xl text-center">Dashboard</p>
                            </div>
                            <div className="py-5 h-96 border rounded mb-4 flex justify-center text-center">
                                CREATE DATA CHARTS
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    );
}