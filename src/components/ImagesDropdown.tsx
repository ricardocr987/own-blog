import { useClickOutside } from '@/hooks';
import { TokenInfo } from '@/types';
import { useRef, useState } from 'react';

interface ImageDropdownProps {
  tokens: TokenInfo[];
  selectedToken: string
  setSelectedToken: (uri: string) => void;
}

const ImageDropdown = ({ tokens, selectedToken, setSelectedToken }: ImageDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const imagesForm = useRef<HTMLDivElement | null>(null);
    useClickOutside(imagesForm, () => setIsOpen(false));

    const handleItemClick = (token: TokenInfo) => {
        setSelectedToken(token.image);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={imagesForm}>
            <div>
                <img className='rounded-lg' src={selectedToken} width={80} height={80} alt={selectedToken} />
            </div>
            <div
                className="flex cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                
            >
                <div className="py-1 px-2 border rounded-lg transition-colors duration-300 ease-in-out text-white bg-black hover:text-black hover:bg-white">
                    Change
                </div>
            </div>
            {isOpen && (
                <div className="absolute z-10 w-40 max-h-64 overflow-y-auto bg-white border rounded-md shadow-md">
                    <ul className='max-height-10'>
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
