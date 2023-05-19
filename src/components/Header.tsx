import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { Author, NavLink, NotificationType } from '@/types';
import dynamic from 'next/dynamic';
import { useWallet } from "@solana/wallet-adapter-react";
import AuthorForm from './AuthorForm';
import SearchBar from './SearchBar';
import HeaderAuthorDetails from './HeaderAuthorDetails';
import { authorInitValues, messagesAddress } from '@/constants';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { SigninMessage } from '@/utils/SignMessage';
import bs58 from 'bs58';
import { NotificationContext } from '@/contexts/NotificationContext';
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

let links: NavLink[] = [
  {     
    name: 'Create Article',
    url: 'CreateArticle'
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

const Header = () => {
  const wallet = useWallet();
  const [authorDetails, setAuthorDetails] = useState<Author>(authorInitValues);
  const [newAuthor, setNewAuthor] = useState(false);
  const { data: session, status } = useSession();
  const { addNotification } = useContext(NotificationContext);

  if (session && session.user && session?.user.id) links[1].url = `profile/${session.user.id}`

  const handleCreateAuthor = async (authorDetails: Author) => {
    if (wallet.publicKey && wallet.connected) {
      authorDetails.pubkey = wallet.publicKey.toString()
      const res = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify(authorDetails)
      })
      if (res.status === 406) addNotification("User already exists", NotificationType.ERROR)
      if (res.status === 201) {
        addNotification("User created", NotificationType.SUCCESS);
        setNewAuthor(false);
      }
    }
  };
  
  const handleSignIn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const fetchAuthorDetails = async () => {
      try {
        const csrf = await getCsrfToken();
        if (!wallet.publicKey || !csrf || !wallet.signMessage) return;

        let details: Author | undefined = undefined
        try {
          const res = await fetch(`/api/getUser?param=${encodeURIComponent(wallet.publicKey.toString())}`, {
            method: 'GET',
          });
          setAuthorDetails(JSON.parse(await res.json()))
          console.log(details)
        }
        catch(e) {
          setNewAuthor(!newAuthor)
        }
        if (details) {
          const message = new SigninMessage({
            domain: window.location.host,
            publicKey: wallet.publicKey?.toBase58(),
            username: authorDetails.username,
            uri: authorDetails.uri,
            statement: `Sign in.`,
            nonce: csrf,
          });
          const data = new TextEncoder().encode(message.prepare());
          const signature = await wallet.signMessage(data);
          const serializedSignature = bs58.encode(signature);

          e.preventDefault()
          //signIn() function will handle obtaining the CSRF token in the background
          const res = await signIn("credentials", {
            message: JSON.stringify(message),
            redirect: false,
            signature: serializedSignature,
          });
          if (res?.status === 200) addNotification('Sing in successfully', NotificationType.SUCCESS)
          if (res && res.ok) setAuthorDetails(details);
        }
      } catch(e) {
        console.log(e)
      }
    };
    fetchAuthorDetails();
  }

  return (
    <>
      <div className="container mx-auto px-5 mb-16 mt-2">        
        <div className="w-full py-8">
          <div className="float-left inline-block mr-10">
            <Link href="/">
              <span className="hidden sm:inline-block cursor-pointer font-bold text-3xl text-white">Own Blog</span>
            </Link>
          </div>
          <div className="float-right py-1 cursor-pointer text-white hover:text-black">
            <div className="rounded-lg border border-white hover:border-white text-white font-medium cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-black">
              {wallet.connected ? 
                status === "authenticated" && session?.user.username ? 
                  <HeaderAuthorDetails authorDetails={authorDetails} session={session.user} links={links}/>
                :
                  <div className='relative px-2 md:px-3 py-2 font-medium cursor-pointer' onClick={(e) => handleSignIn(e)}>
                    Sign in
                  </div>
              :
                <WalletMultiButtonDynamic className='font-medium cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white hover:text-black !important'/>
              }
            </div>
          </div>
          <SearchBar />
          <div className='float-right my-2'>
            <Link href="/">
              <div className="border rounded-full px-2 py-2 transition-colors duration-300 ease-in-out text-white hover:bg-white hover:text-black flex items-center justify-center">
                  <svg className="fill-current" baseProfile="tiny"  id="Layer_1" version="1.2" viewBox="0 0 24 24" width="15px" xmlns="http://www.w3.org/2000/svg"><path d="M12,3c0,0-6.186,5.34-9.643,8.232C2.154,11.416,2,11.684,2,12c0,0.553,0.447,1,1,1h2v7c0,0.553,0.447,1,1,1h3  c0.553,0,1-0.448,1-1v-4h4v4c0,0.552,0.447,1,1,1h3c0.553,0,1-0.447,1-1v-7h2c0.553,0,1-0.447,1-1c0-0.316-0.154-0.584-0.383-0.768  C18.184,8.34,12,3,12,3z"/></svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {newAuthor && (
        <AuthorForm
          newAuthor={newAuthor}
          onAuthorCreate={handleCreateAuthor} 
          setNewAuthor={setNewAuthor}
        />
      )}
    </>
  );
};

export default Header;