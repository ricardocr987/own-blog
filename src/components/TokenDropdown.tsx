import { useClickOutside } from "@/hooks";
import { TokenInfo } from "@/types";
import { useRef, useState } from "react";

const tokens: TokenInfo[] = [ 
  {
    name: "SOL",
    image: "./solanaLogoMark.svg"
  },
  {
    name: "USDC",
    image: "./usdcLogo.svg"
  },
];

const TokenDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState(tokens[0].image)

  const tokenForm = useRef<HTMLDivElement | null>(null);
  useClickOutside(tokenForm, () => setIsOpen(false));

  const handleItemClick = (token: TokenInfo) => {
      setSelectedToken(token.image);
      setIsOpen(false);
  };

  return (
      <div className="relative" ref={tokenForm}>
          <div className="border-gray-300 border bg-white rounded-md w-12 h-10" onClick={() => setIsOpen(!isOpen)}>
              <img className='block rounded-md text-sm py-2 px-3 w-full h-full' src={selectedToken} width={80} height={80} alt={selectedToken} />
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
