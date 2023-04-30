import { getAuthorDetails } from "@/services";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Author from "./Author";
import NotificationsContainer from "./Notification";
import { useNotification } from "@/hooks";
import { NotificationType } from "@/types";

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
              addNotification('Please sign in to get access', NotificationType.WARNING);
            }
          } else {
            addNotification('Please connect wallet to get access', NotificationType.WARNING);
          }
        };
        fetchAuthorDetails();
      }, 500);
    
      return () => clearTimeout(timeout);
    }, [wallet.publicKey]);
    
  
    return (
      <div>
        {wallet.publicKey && wallet.connected && signed && <>{children}</> }
        <NotificationsContainer 
          notifications={notifications} 
          removeNotification={removeNotification}
        />
      </div>
    )
}

export default AuthWrapper;
