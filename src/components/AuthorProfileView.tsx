import ImagesDropdown from "@/components/ImagesDropdown";
import { METADATA_PROGRAM_ID_PK, authorInitValues, decimalsFromPubkey, initialTokenValues, messagesAddress, mintFromSymbol, tokens } from "@/constants";
import { getAppPubkey, getMetadataPubkey, getPaymentVaultPubkey, getTokenInfo, getTokenMintPubkey, getTokenPubkey } from "@/services";
import { Author, NotificationType, TokenInfo, Uri, Withdrawals } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { connection } from '@/constants';
import TokenDropdown from "@/components/TokenDropdown";
import { ACCOUNTS_DATA_LAYOUT, AccountType, AppArgs, CreateTokenInstructionAccounts, CreateTokenInstructionArgs, EditTokenPriceInstructionAccounts, EditTokenPriceInstructionArgs, PaymentArgs, TokenMetadataArgs, WithdrawFundsInstructionAccounts, createCreateTokenInstruction, createEditTokenPriceInstruction, createWithdrawFundsInstruction } from "@/utils/solita";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { NotificationContext } from "@/contexts/NotificationContext";

type AuthorProfileViewProps = {
    profile: Author
    withdrawals: string | null
}

export const AuthorProfileView = ({ profile, withdrawals }: AuthorProfileViewProps) => {
    const wallet = useWallet();
    const [isEditing, setIsEditing] = useState(false);
    const [isMonetizeConfigOpen, setMonetizeConfigOpen] = useState(false);
    const { addNotification } = useContext(NotificationContext);
    const [tokensImages, setTokensImages] = useState<TokenInfo[]>([]);
    const [formImage, setFormImage] = useState(profile?.uri || "");
    const [formUsername, setFormUsername] = useState(profile?.username || "");
    const [formBio, setFormBio] = useState(profile?.bio || "");
    const [subToken, setSubToken] = useState(initialTokenValues(profile.subscriptionToken) || tokens[0]);
    const [subPrice, setSubPrice] = useState(profile.subscriptionPrice?.toString() || '0');
    
    useEffect(() => { 
        async function fetchData() {
            if (wallet.publicKey) {
                const tokens: TokenInfo[] = await getTokenInfo(wallet.publicKey, connection);
                setTokensImages(tokens);
                setFormImage(tokens[0].image);
            } 
        }
        fetchData();
    }, [isEditing]);

    async function handleWithdrawals() {
        if (!wallet.publicKey) return;
        if (!withdrawals) return;
        const transaction = new Transaction()
        const paymentAccounts = JSON.parse(withdrawals) as Withdrawals[]
        await Promise.all(paymentAccounts.map(async (account) => {
            if (!wallet.publicKey) return;
            const encodedTokenAccount = await connection.getAccountInfo(new PublicKey(account.tokenAccount))
            if (!encodedTokenAccount) return;
            const decodedTokenAccount: TokenMetadataArgs = ACCOUNTS_DATA_LAYOUT[AccountType.TokenMetadata].deserialize(encodedTokenAccount.data)[0]
            const paymentVault = getPaymentVaultPubkey(new PublicKey(account.pubkey))
            const receiverVault = await getAssociatedTokenAddress(new PublicKey(account.paidMint), wallet.publicKey)
            const appAccount = await connection.getAccountInfo(new PublicKey(decodedTokenAccount.app))
            if (!appAccount) return;
            const decodedAppAccount: AppArgs = ACCOUNTS_DATA_LAYOUT[AccountType.App].deserialize(appAccount.data)[0]
            const appCreatorVault = await getAssociatedTokenAddress(new PublicKey(account.paidMint), decodedAppAccount.authority)
            const accounts: WithdrawFundsInstructionAccounts = {
                tokenProgram: TOKEN_PROGRAM_ID,
                authority: wallet.publicKey,
                app: decodedTokenAccount.app,
                appCreatorVault: appCreatorVault,
                token: new PublicKey(account.tokenAccount),
                tokenMint: new PublicKey(account.tokenMint),
                receiverVault: receiverVault,
                buyer: new PublicKey(account.buyer),
                payment: new PublicKey(account.pubkey),
                paymentVault: paymentVault,
            }
            transaction.add(createWithdrawFundsInstruction(accounts))
        }))
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
            addNotification('Withdraw successful!', NotificationType.SUCCESS)
        } else {
            addNotification('Can not confirm your transaction', NotificationType.ERROR)
        }
    }

    async function sendCreateTokenTransaction() {
        try {
            if (wallet.publicKey) {
                const acceptedMintDecimals = decimalsFromPubkey[mintFromSymbol[subToken.name]]
                const parsedNumber = parseFloat(subPrice.replace(/,/g, ''))
                const standardizedNumber = parsedNumber * Math.pow(10, acceptedMintDecimals)
                const offChainId = wallet.publicKey?.toString()
                const offChainId1 = offChainId.slice(0, 32)
                let offChainId2 = offChainId.slice(32, 64)
                if (offChainId.length < 32) offChainId2 = ""
                const tokenMint = getTokenMintPubkey(offChainId1)
                const tokenAccount = getTokenPubkey(tokenMint)
                const appAccount = getAppPubkey('own-blog')
                const metadataAccount = getMetadataPubkey(tokenMint)
                if (profile.subscriptionBrickToken) {
                    const accounts: EditTokenPriceInstructionAccounts = {
                        authority: wallet.publicKey,
                        token: tokenAccount,
                    }
                    const args: EditTokenPriceInstructionArgs = {
                        tokenPrice: standardizedNumber
                    }
                
                    const transaction = new Transaction().add(
                        createEditTokenPriceInstruction(accounts, args)
                    )
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
                        profile.subscriptionPrice = Number(subPrice)
                        profile.subscriptionToken = mintFromSymbol[subToken.name]
                        profile.subscriptionBrickToken = tokenMint.toString()
                        const res = await fetch('/api/updateSubscription', {
                            method: 'POST',
                            body: JSON.stringify(profile)
                        })
                        if (res.status === 201) addNotification('Monetization updated!', NotificationType.SUCCESS)
                        if (res.status === 400) addNotification(res.statusText, NotificationType.ERROR)
                    } else {
                        addNotification('Can not confirm your transaction', NotificationType.ERROR)
                    }
                } else {
                    const accounts: CreateTokenInstructionAccounts = {
                        metadataProgram: METADATA_PROGRAM_ID_PK,
                        messagesProgram: new PublicKey('ALepH1n9jxScbz45aZhBYVa35zxBNbKSvL6rWQpb4snc'),
                        systemProgram: SystemProgram.programId,
                        tokenProgram: TOKEN_PROGRAM_ID,
                        rent: SYSVAR_RENT_PUBKEY,
                        authority: wallet.publicKey,
                        app: appAccount,
                        tokenMint: tokenMint,
                        token: tokenAccount,
                        acceptedMint: new PublicKey(mintFromSymbol[subToken.name]),
                        tokenMetadata: metadataAccount,
                    }
                    /*const date = new Date();
                    const uri: Uri = {
                        name: profile.username, 
                        symbol:'Own-Blog', 
                        description:`You are a subscriber of ${profile.username} for ${date.toLocaleString('default', { month: 'long' })} month`,
                        image: profile.uri,
                        attributes:[
                            {
                                trait_type: 'author',
                                value: profile.username
                            },
                            {
                                trait_type: 'month',
                                value: date.toLocaleString('default', { month: 'long' })
                            }
                        ],
                        properties:{
                            files:[{ uri: profile.uri, type: "image/gif" }],
                            category: "image"
                        }
                    }
                    const uriResponse = await fetch('/api/uploadUri', {
                        method: 'POST',
                        body: JSON.stringify(uri)
                    })*/
                    //if (uriResponse.status === 200) {
                        const args: CreateTokenInstructionArgs = {
                            offChainId: offChainId1,
                            offChainId2: offChainId2,
                            offChainMetadata: offChainId1,
                            refundTimespan: new BN(Number(0)),
                            tokenPrice: standardizedNumber,// to convert it to the right amount
                            exemplars: -1,
                            tokenName: profile.username,
                            tokenSymbol: 'OB',
                            tokenUri: 'https://arweave.net/W0GZ1H3wql5BvcH3Hugjx-111K_IJy3LSFnAng8Zpew' // `https://api2.aleph.im/api/v0/aggregates/${messagesAddress}.json?keys=${profile.pubkey}tokenUri`,
                        }
                    
                        const transaction = new Transaction().add(
                            createCreateTokenInstruction(accounts, args)
                        )
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
                            profile.subscriptionPrice = Number(subPrice)
                            profile.subscriptionToken = mintFromSymbol[subToken.name]
                            profile.subscriptionBrickToken = tokenMint.toString()
                            const res = await fetch('/api/updateSubscription', {
                                method: 'POST',
                                body: JSON.stringify(profile)
                            })
                            if (res.status === 201) addNotification(res.statusText, NotificationType.SUCCESS)
                            if (res.status === 400) addNotification(res.statusText, NotificationType.ERROR)
                        } else {
                            addNotification('Can not confirm your transaction', NotificationType.ERROR)
                        }
                    //}
                }
            }
        } catch (e) { console.log(e) }
    }

    const handleEdit = async () => {
        if (formUsername !== '' && formImage !== '' && wallet.publicKey) {
            try {
                const formAuthorDetails: Author = {
                    ...profile,
                    username: formUsername,
                    bio: formBio,
                    uri: formImage,
                }
                const res = await fetch('/api/updateAuthor', {
                    method: 'POST',
                    body: JSON.stringify(formAuthorDetails)
                })
                if (res.status === 406) addNotification("User already exists", NotificationType.ERROR)
                if (res.status === 201) {
                    addNotification("User updated", NotificationType.SUCCESS);
                    // cambiar la info de las cookies
                    setIsEditing(false);
                }
            } catch(e) {
                addNotification('Aleph network error', NotificationType.ERROR);
            }
        } else {
            addNotification('Please, fill all fields', NotificationType.WARNING);
        }       
    };

    return (
        <>
            {isEditing ?
                <div className="space-y-2">
                    <div className="mb-2">
                        <label htmlFor="username" className="text-black font-bold block mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formUsername}
                            onChange={(e) => setFormUsername(e.target.value)}
                            className="border-gray-400 border-2 rounded-md px-2 py-1 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="bio" className="text-black font-bold block mb-2">Bio</label>
                        <input
                            name="bio"
                            id="bio"
                            value={formBio}
                            onChange={(e) => setFormBio(e.target.value)}
                            className="border-gray-400 border-2 rounded-md px-2 py-1 w-full h-18"
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <div className="flex items-center">
                            <ImagesDropdown tokens={tokensImages} selectedToken={formImage} setSelectedToken={setFormImage}/>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div 
                            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                            onClick={() => handleEdit()}
                        >
                            Save
                        </div>
                        <div 
                            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                            onClick={() => setIsEditing(false)}
                        >
                            Cancel
                        </div>
                    </div>
                </div>
            :
                isMonetizeConfigOpen ? 
                    <div className="space-y-2">
                        <div className="mb-4">
                            <p className="text-black font-bold text-base mb-2">Set the monthly subscription price:</p>
                            <div className="flex justify-center items-center">
                                <TokenDropdown setSelectedToken={setSubToken} selectedToken={subToken}/>
                                <div className="border border-gray-300 rounded-md">
                                    <input
                                        type="text"
                                        id="subPrice"
                                        name="subPrice"
                                        className="block w-20 rounded-md text-sm py-2 px-3 bg-white"
                                        value={subPrice}
                                        onChange={(e) => setSubPrice(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div 
                                className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => sendCreateTokenTransaction()}
                            >
                                Save
                            </div>
                            <div 
                                className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => setMonetizeConfigOpen(false)}
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
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
                        <div className="flex justify-center">
                            <div 
                                className="py-2 px-4 border rounded-lg text-center transition-colors w-34 duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Info
                            </div>
                            <div 
                                className="py-2 px-4 border rounded-lg transition-colors w-34 duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => setMonetizeConfigOpen(true)}
                            >
                                Monetize
                            </div>
                            {withdrawals &&                             
                                <div 
                                    className="py-2 px-4 border rounded-lg transition-colors w-34 duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                    onClick={() => handleWithdrawals()}
                                >
                                    Withdraw
                                </div>
                            }
                        </div>
                    </div>
            }
        </>
    )
}