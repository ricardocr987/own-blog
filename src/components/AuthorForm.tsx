import { Author, NotificationType, TokenInfo } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { connection } from '@/constants';
import { getTokenInfo } from '@/services';
import { useWallet } from '@solana/wallet-adapter-react';
import { useClickOutside } from '@/hooks';
import { Notification } from '@/types';
import Loader from './Loader';
import ImagesDropdown from './ImagesDropdown';

interface AuthorFormProps {
    onAuthorCreate: (author: Author) => void
    setNewAuthor: (value: React.SetStateAction<boolean>) => void
    addNotification: (text: string, type: NotificationType) => void,
    notifications: Notification[],
    removeNotification: (id: number) => void
    newAuthor: boolean
}  

const AuthorForm = ({ onAuthorCreate, setNewAuthor, addNotification, newAuthor }: AuthorFormProps) => {
    const { publicKey } = useWallet();
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [selectedToken, setSelectedToken] = useState('');
    const [tokens, setTokens] = useState<TokenInfo[]>([]);
    const [showImagesDropdown, setShowImagesDropdown] = useState(false);

    const handleSubmit = async () => {
        if (username !== '' && selectedToken !== '' && publicKey) {
            try {
                onAuthorCreate({ username, pubkey: publicKey.toString() , bio, uri: selectedToken, createdAt: Date.now(), articles: [] }); 
            } catch(e) {
                addNotification('Aleph network error', NotificationType.ERROR);
            }
        } else {
            addNotification('Please, fill all fields', NotificationType.WARNING);
        }       
    };

    useEffect(() => {
        async function fetchData() {
            if (publicKey && newAuthor) {
                const tokens: TokenInfo[] = await getTokenInfo(publicKey, connection);
                setTokens(tokens);
                setShowImagesDropdown(true);
                setSelectedToken(tokens[0].image);
            } 
        }
        fetchData();
    }, []);

    const authorFormRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(authorFormRef, () => setNewAuthor(false));

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20">
            <div ref={authorFormRef} className="bg-white rounded-lg w-96 p-8 relative">
                <div
                    className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer"
                    onClick={() => setNewAuthor(false)}
                >
                    <svg id="Layer_1" version="1.1" viewBox="0 0 512 512" width="25px" xmlns="http://www.w3.org/2000/svg"><path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/></svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Sign-in?</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="bio">
                            Bio
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="bio"
                            placeholder="Bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
                            Image
                        </label>
                        <div className="flex items-center">
                            {showImagesDropdown && tokens ?
                                <ImagesDropdown tokens={tokens} selectedToken={selectedToken} setSelectedToken={setSelectedToken}/>
                            :
                                <Loader />
                            }
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div
                            className="py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white font-medium cursor-pointer"
                            onClick={() => handleSubmit()}
                        >
                            Save
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthorForm;
