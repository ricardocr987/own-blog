import ProfilePostCard from '@/components/ProfilePostCard';
import { confirmOptions, connection, messagesAddress, symbolFromMint } from '@/constants';
import { Author, GetArticleResponse, GetUserResponse, NextAuthUser, NotificationType, Post } from '@/types';
import { convertToLamports } from '@/utils/solToLamports';
import { PublicKey, Sft } from '@metaplex-foundation/js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from '@solana/web3.js';
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import moment from 'moment';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from '../api/auth/[...nextauth]';
import { AuthorProfileView } from '@/components/AuthorProfileView';
import { NotificationContext } from '@/contexts/NotificationContext';
import { useContext } from 'react';
import { getTokenPubkey, getPaymentPubkey, getPaymentVaultPubkey } from '@/services';
import { BuyTokenInstructionAccounts, BuyTokenInstructionArgs, PaymentArgs, UseTokenInstructionAccounts, createBuyTokenInstruction, createUseTokenInstruction } from '@/utils/solita';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';
import { getWithdrawals } from '@/utils/getWithdrawals';

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
            const response = await getAggregate<GetUserResponse>({
                keys: [params.id],
                address: messagesAddress,
                APIServer: 'https://api2.aleph.im',
            });
            const session = await getServerSession(context.req, context.res, authOptions());
            if (session) {
                const user = Object.fromEntries(
                    Object.entries(session.user).filter(([_, value]) => value !== undefined)
                ) as NextAuthUser;
                const { subs } = response[params.id];
                const originalSubs = subs ? [...subs] : [];
                if (subs) {
                    const monthTimestamp = 30 * 24 * 60 * 60 * 1000
                    const oneMonthAgo = Date.now() - monthTimestamp;
                    const updatedSubs = subs.filter((sub) => sub.timestamp >= oneMonthAgo);
                
                    if (JSON.stringify(updatedSubs) !== JSON.stringify(originalSubs)) {
                        fetch('api/updateSubs', {
                            method: 'POST',
                            body: JSON.stringify(updatedSubs),
                            headers: {
                            'Content-Type': 'application/json',
                            },
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                
                    if (session) {
                        props.props.subscriber.is = updatedSubs.some((sub) => sub.pubkey === user.id);
                        const subscriber = updatedSubs.find((sub) => sub.pubkey === user.id);
                        if (subscriber) props.props.subscriber.timeleft = subscriber.timestamp + monthTimestamp;
                    }
                }
                if (user.id === params.id) {
                    props.props.author = true;
                    const withdrawals = JSON.stringify(await getWithdrawals(new PublicKey(params.id), connection));
                    if (withdrawals) props.props.withdrawals
                }
            }
            const articlesResponse = response[params.id].articles;
            if (articlesResponse.length > 0) {
                const articlesPromises = articlesResponse.map(async (article) => {
                    try {
                        const res = await getAggregate<GetArticleResponse>({
                            keys: [article],
                            address: messagesAddress,
                            APIServer: 'https://api2.aleph.im',
                        });
                        return res[article];
                    } catch (e) {
                        console.error(`Error while fetching article ${article}: ${e}`);
                        return null;
                    }
                });
                const articles = await Promise.all(articlesPromises);
                props.props.articles = articles.filter((a) => a !== null) as Post[];
            } else {
                props.props.articles = null;
            }
    
            props.props.profile = response[params.id];
        } catch (e) {
            props.props.profile = null;
            props.props.articles = null;
            props.props.author = false;
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
                if (!profile.subs) {
                    profile.subs = [{ pubkey: wallet.publicKey?.toString(), timestamp: Date.now() }];
                } else {
                    profile.subs.push({ pubkey: wallet.publicKey?.toString(), timestamp: Date.now() });
                }
                const updateSubsPayload = {
                    profile,
                    signature
                }
                const res = await fetch('/api/updateSubs', {
                    method: 'POST',
                    body: JSON.stringify(updateSubsPayload)
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
        </div>
    );
}