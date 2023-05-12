import { tokens } from "@/constants";
import { useClickOutside } from "@/hooks";
import { TokenInfo } from "@/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";



type TokenDropdownProps = {
    selectedToken: TokenInfo
    setSelectedToken: Dispatch<SetStateAction<TokenInfo>>
}

const TokenDropdown = ({ selectedToken, setSelectedToken }: TokenDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const tokenForm = useRef<HTMLDivElement | null>(null);
    useClickOutside(tokenForm, () => setIsOpen(false));

    const handleItemClick = (token: TokenInfo) => {
        setSelectedToken(token);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={tokenForm}>
            <div className="border-gray-300 border bg-white rounded-md w-12 h-10" onClick={() => setIsOpen(!isOpen)}>
                <img className='block rounded-md text-sm py-2 px-3 w-full h-full' src={selectedToken.image} width={80} height={80} alt={selectedToken.image} />
            </div>
            {isOpen && (
                <div className="absolute z-10 w-24 max-h-64 overflow-y-auto bg-white border rounded-md shadow-md">
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
                                    className="w-5 h-5 object-cover"
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

export default TokenDropdown;
