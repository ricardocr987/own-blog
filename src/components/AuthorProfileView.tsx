import { Loader } from "@/components";
import ImagesDropdown from "@/components/ImagesDropdown";
import { authorInitValues, tokens } from "@/constants";
import { useNotification } from "@/hooks";
import { getTokenInfo } from "@/services";
import { Author, NotificationType, TokenInfo } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { connection } from '@/constants';
import TokenDropdown from "@/components/TokenDropdown";

type AuthorProfileViewProps = {
    profile: Author
}

export const AuthorProfileView = ({profile}: AuthorProfileViewProps) => {
    const wallet = useWallet();
    const [isEditing, setIsEditing] = useState(false);
    const [isMonetizeConfigOpen, setMonetizeConfigOpen] = useState(false);
    const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);
    const { addNotification, notifications, removeNotification } = useNotification();
    const [showImagesDropdown, setShowImagesDropdown] = useState(false);
    const [tokensImages, setTokensImages] = useState<TokenInfo[]>([]);
    const [formImage, setFormImage] = useState(profile?.uri || "");
    const [formUsername, setFormUsername] = useState(profile?.username || "");
    const [formBio, setFormBio] = useState(profile?.bio || "");
    const [subToken, setSubToken] = useState(tokens[0].image);
    const [subPrice, setSubPrice] = useState('0');
    
    useEffect(() => { 
        async function fetchData() {
            if (wallet.publicKey) {
                const tokens: TokenInfo[] = await getTokenInfo(wallet.publicKey, connection);
                setTokensImages(tokens);
                setShowImagesDropdown(true);
                setFormImage(tokens[0].image);
            } 
        }
        fetchData();
    }, []);

    const handleMonetize = async () => {

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
                                onClick={() => handleMonetize()}
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
                                className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </div>
                            <div 
                                className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                                onClick={() => setMonetizeConfigOpen(!isMonetizeConfigOpen)}
                            >
                                Monetize
                            </div>                                
                        </div>
                    </div>
            }
        </>
    )
}