import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Author, NavLink } from '@/types';
import { useClickOutside } from '@/hooks';

const links: NavLink[] = [
  {     
    name: 'Create Article',
    url: 'CreateArticle'
  },
  {     
    name: 'My Articles',
    url: 'MyArticles'
  },
  {     
    name: 'Profile',
    url: 'Profile'
  },
  {     
    name: 'Disconnect',
    url: 'Disconnect'
  },
]

const author: Author = {
  username: 'Riki',
  createdAt: Date.now(),
  bio: 'vibing',
  uri: 'https://arweave.net/uNWOKfIZWEGcd5GIlW-vruvi2NUlpW0SHe6rc4qG95Q',
}

const Header = () => {
  const connected = true;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleProfileMenuToggle = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  useClickOutside(profileMenuRef, () => setShowProfileMenu(false));

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="w-full py-8 flex items-center">
        <div className="hidden md:float-left md:block mr-10">
          <Link href="/">
            <span className="cursor-pointer font-bold text-3xl text-white">Own Blog</span>
          </Link>
        </div>
        <div className="md:float-right block">
          <form className="relative">
            <input type="text" className="bg-gray-200 text-gray-800 rounded-full w-40 sm:w-80 md:w-90 py-2 px-1 pl-8 leading-tight focus:outline-none focus:shadow-outline" placeholder="Search..." />
            <div className="absolute top-0">
              <svg className="fill-current w-4 h-4 mt-3 ml-2 text-gray-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.707 22.293l-6.271-6.271c1.136-1.448 1.865-3.256 1.865-5.277 0-4.971-4.029-9-9-9s-9 4.029-9 9 4.029 9 9 9c2.021 0 3.829-.729 5.277-1.865l6.271 6.271a1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414zM4 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z"/></svg>
            </div>
          </form>
        </div>
        <div className="absolute right-0 mr-10 px-2 md:px-5 py-2 rounded-lg border border-gray-400">
          {connected ?
            <div className="relative">
              <div className="flex items-center cursor-pointer" onClick={handleProfileMenuToggle} ref={profileMenuRef}>
                <Image
                  unoptimized
                  width={30}
                  height={30}
                  alt={author.username}
                  className="drop-shadow-lg rounded-full"
                  src={author.uri}
                />
                <p className="inline align-middle text-white text-shadow ml-2 font-medium">{author.username}</p>
              </div>
              {showProfileMenu && (
                <div ref={profileMenuRef} className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <ul className="py-1">
                    {links.map((link, index) => (
                      <li key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <Link href={`/category/${link.url}`}><span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">{link.name}</span></Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          : 
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded-md">
              Connect Wallet
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
