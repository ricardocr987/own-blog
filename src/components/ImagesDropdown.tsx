import { useClickOutside } from '@/hooks';
import { TokenInfo } from '@/types';
import { useCallback, useRef, useState } from 'react';

interface ImageDropdownProps {
  tokens: TokenInfo[];
  setSelectedToken: (uri: string) => void;
}

const ImageDropdown = ({ tokens, setSelectedToken }: ImageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(tokens[0].image);

    const imagesForm = useRef<HTMLDivElement | null>(null);
    useClickOutside(imagesForm, () => setIsOpen(false));

    const handleItemClick = useCallback((token: TokenInfo) => {
        setSelectedToken(token.image);
        setSelectedImage(token.image);
        setIsOpen(false);
    }, [tokens]);

    return (
        <div className="relative">
            <div>
                <img className='rounded-lg' src={selectedImage} width={70} height={70} alt={selectedImage} />
            </div>
            <div
                className="flex cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                ref={imagesForm}
            >
                <div className="py-1 px-2 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white">
                    Select
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-40 max-h-64 overflow-y-auto bg-white border rounded-md shadow-md">
                    <ul>
                        {tokens.map((token) => (
                            <li
                                key={token.name}
                                className="flex items-center h-8 px-2 hover:bg-gray-100 cursor-pointer select-none"
                                onClick={() => handleItemClick(token)}
                            >
                                <img
                                    src={token.image}
                                    alt={token.name}
                                    className="w-6 h-6 object-cover rounded"
                                />
                                <span className="ml-2 truncate">{token.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ImageDropdown;
