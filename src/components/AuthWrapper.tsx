import { getAuthorDetails } from "@/services";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Author from "./Author";
import NotificationsContainer from "./Notification";
import { useNotification } from "@/hooks";

interface AuthWrapperProps {
    children: React.ReactNode
    setAuthorDetails: (value: React.SetStateAction<Author>) => void
}

const AuthWrapper = ({ children, setAuthorDetails }: AuthWrapperProps) => {
    const wallet = useWallet();
    const { addNotification, notifications, removeNotification } = useNotification();
    const [signed, setSigned] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(async () => {
        const fetchAuthorDetails = async () => {
          if (wallet.publicKey) {
            const details = await getAuthorDetails(wallet.publicKey);
            if (details !== null) {
              setAuthorDetails(details);
              setSigned(true);
            } else {
              addNotification('Please sign in to be able to write content');
            }
          } else {
            addNotification('Please connect wallet to be able to write content');
          }
        };
        fetchAuthorDetails();
      }, 500);
    
      return () => clearTimeout(timeout);
    }, [wallet.publicKey]);
    
  
    return (
      <div className="container mx-auto px-10 mb-8">
        { wallet.publicKey && wallet.connected && signed && <>{children}</> }
        <NotificationsContainer 
            notifications={notifications} 
            removeNotification={removeNotification}
        />
      </div>
    )
}

export default AuthWrapper;
