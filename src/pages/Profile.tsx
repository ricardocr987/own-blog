import { AuthWrapper, Loader } from "@/components";
import ImagesDropdown from "@/components/ImagesDropdown";
import NotificationsContainer from "@/components/Notification";
import { authorInitValues } from "@/constants";
import { useNotification } from "@/hooks";
import { getTokenInfo } from "@/services";
import { Author, NotificationType, TokenInfo } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { connection } from '@/constants';

const Profile = () => {
    const wallet = useWallet();
    const [isEditing, setIsEditing] = useState(false);
    const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);
    const { addNotification, notifications, removeNotification } = useNotification();
    const [showImagesDropdown, setShowImagesDropdown] = useState(false);
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [formImage, setFormImage] = useState(authorDetails.uri || '');
    const [formUsername, setFormUsername] = useState(authorDetails.username || '');
    const [formBio, setFormBio] = useState(authorDetails.bio || '');

    useEffect(() => { 
        async function fetchData() {
            if (wallet.publicKey) {
                const tokens: TokenInfo[] = await getTokenInfo(wallet.publicKey, connection);
                setTokens(tokens);
                setShowImagesDropdown(true);
                setFormImage(tokens[0].image);
            } 
        }
        fetchData();
    }, [wallet.publicKey]);

    const handleSubmit = async () => {
        if (formUsername !== '' && formImage !== '' && wallet.publicKey) {
            try {
                const formAuthorDetails: Author = {
                    ...authorDetails,
                    username: formUsername,
                    bio: formBio,
                    uri: formImage,
                }
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify(authorDetails)
                })
                if (res.status === 406) addNotification("User already exists", NotificationType.ERROR)
                if (res.status === 201) {
                    addNotification("User updated", NotificationType.SUCCESS);
                    setAuthorDetails(formAuthorDetails);
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
        <AuthWrapper setAuthorDetails={setAuthorDetails}>
            <div className="container mx-auto px-10 mb-8">
                <div className="container mx-auto md:px-16 lg:px-68">
                    <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 md:py-10 px-10 flex justify-center items-center">
                            <div className="w-full space-y-4 flex flex-col items-center">
                                <Image
                                    unoptimized
                                    width={100}
                                    height={100}
                                    alt={authorDetails.username}
                                    className="drop-shadow-lg rounded-full flex justify-center items-center"
                                    src={authorDetails.uri}
                                />
                                <p className="text-black text-2xl text-center whitespace-normal">{authorDetails.username}</p>
                                <p className="text-black text-lg text-center whitespace-normal">{authorDetails.bio}</p>
                            </div>
                        </div>
                        <div className="py-5 md:py-10 px-10 mb-5 mt-5 flex justify-center items-center border rounded-lg">
                            {isEditing ?
                                <form onSubmit={handleSubmit} className="space-y-2">
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
                                            {showImagesDropdown && tokens ?
                                                <ImagesDropdown tokens={tokens} selectedToken={formImage} setSelectedToken={setFormImage}/>
                                            :
                                                <Loader />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div 
                                            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                            onClick={() => handleSubmit()}
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
                                </form>
                            :
                                <div className="w-full">
                                    <div className="mb-4 min-h-18">
                                        <p className="text-black font-bold text-lg">Bio:</p>
                                        <p className="text-black text-base max-w-full break-words">{authorDetails.bio}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-black font-bold text-lg">Created at:</p>
                                        <p className="text-black text-base max-w-full break-words">{moment(authorDetails.createdAt).format('MMM DD, YYYY')}</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <div 
                                            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </div>                                    
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="container mx-auto px-6 md:px-10 grid grid-cols-1 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 px-10 flex justify-center text-center">
                            <p className="text-black text-4xl text-center">Dashboard</p>
                        </div>
                        <div className="py-5 h-96 border rounded mb-4 flex justify-center text-center">
                            CREATE DATA CHARTS
                        </div>
                    </div>
                </div>
            </div>
            <NotificationsContainer 
                notifications={notifications} 
                removeNotification={removeNotification}
            />
        </AuthWrapper>
    );
};

export default Profile;
