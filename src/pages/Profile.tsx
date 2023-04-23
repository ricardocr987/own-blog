import { Button } from "@/components";
import { Author } from "@/types";
import moment from "moment";
import Image from 'next/image';
import { useState } from "react";

const author: Author = {
    username: 'Riki',
    createdAt: Date.now(),
    bio: 'vibing',
    uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
}

const Profile = () => {
    const connected = true;
    const [isEditing, setIsEditing] = useState(false);
    const [updatedAuthor, setUpdatedAuthor] = useState(author);

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setUpdatedAuthor(prevAuthor => ({
            ...prevAuthor,
            [name]: value
        }));
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // TODO: Handle submission of updated author information
        setIsEditing(false);
    }

    return (
        <div className="container mx-auto px-10 mb-8">
            {connected ?
                <div className="container mx-auto px-16 lg:px-52">
                    <div className="container mx-auto px-10 grid grid-cols-1 md:grid-cols-2 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 md:py-10 px-10 flex justify-center items-center">
                            <div className="w-full space-y-4 flex flex-col items-center">
                                <Image
                                    unoptimized
                                    width={100}
                                    height={100}
                                    alt={updatedAuthor.username}
                                    className="drop-shadow-lg rounded-full flex justify-center items-center"
                                    src={updatedAuthor.uri}
                                />
                            <p className="text-black text-2xl text-center whitespace-normal">{updatedAuthor.username}</p>
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
                                            value={updatedAuthor.username}
                                            onChange={handleInputChange}
                                            className="border-gray-400 border-2 rounded-md px-2 py-1 w-full"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="bio" className="text-black font-bold block mb-2">Bio</label>
                                        <input
                                            name="bio"
                                            id="bio"
                                            value={updatedAuthor.bio}
                                            onChange={handleInputChange}
                                            className="border-gray-400 border-2 rounded-md px-2 py-1 w-full h-18"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="uri" className="text-black font-bold block mb-2">Image</label>
                                        <input
                                            name="uri"
                                            id="uri"
                                            value={updatedAuthor.uri}
                                            onChange={handleInputChange}
                                            className="border-gray-400 border-2 rounded-md px-2 py-1 w-full h-18"
                                        />
                                    </div>
                                    <div className="flex justify-between">
                                        <Button text="Save" />
                                        <Button text="Cancel" onClick={() => setIsEditing(false)} />
                                    </div>
                                </form>
                            :
                                <div className="w-full">
                                    <div className="mb-4 min-h-18">
                                        <p className="text-black font-bold text-lg">Bio:</p>
                                        <p className="text-black text-base max-w-full break-words">{updatedAuthor.bio}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-black font-bold text-lg">Created at:</p>
                                        <p className="text-black text-base max-w-full break-words">{moment(updatedAuthor.createdAt).format('MMM DD, YYYY')}</p>
                                    </div>
                                    <div className="flex justify-center">
                                        <Button text="Edit" onClick={() => setIsEditing(true)} />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="container mx-auto px-10 grid grid-rows-1 bg-white rounded-lg shadow-md mb-4">
                        <div className="py-5 px-10 flex justify-center items-center">
                            <p className="text-black text-5xl">Dashboard</p>
                        </div>
                        <div className="py-5 h-96 border rounded mb-4">
                            <p className="text-black text-5xl"></p>
                        </div>
                    </div>
                </div>
            :
                <div className="text-white text-2xl font-bold mb-4 text-center mt-32">
                    Connect your wallet
                </div>
            }
        </div>
    );
};

export default Profile;
