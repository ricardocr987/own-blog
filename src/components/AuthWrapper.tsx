import { getAuthorDetails } from "@/services";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import Author from "./Author";
import NotificationsContainer from "./Notification";
import { useNotification } from "@/hooks";
import { NotificationType } from "@/types";
import { useSession } from "next-auth/react";

interface AuthWrapperProps {
  children: React.ReactNode
  setAuthorDetails: (value: React.SetStateAction<Author>) => void
}

const AuthWrapper = ({ children, setAuthorDetails }: AuthWrapperProps) => {
  const wallet = useWallet();
  const { addNotification, notifications, removeNotification } = useNotification();
  const { status, update, data: session } = useSession();

  const fetchAuthorDetails = async () => {
    if (!wallet.publicKey) return;

    const details = await getAuthorDetails(wallet.publicKey);
    if (!details) {
      return;
    }
    setAuthorDetails(details);
  };
  
  // Polling the session every 1 hour
  useEffect(() => {
    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [update])

  // Listen for when the page is visible, if the user switches tabs
  // and makes our tab visible again, re-fetch the session
  useEffect(() => {
    const visibilityHandler = () => document.visibilityState === "visible" && update()
    window.addEventListener("visibilitychange", visibilityHandler, false)
    return () => window.removeEventListener("visibilitychange", visibilityHandler, false)
  }, [update])

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (wallet.connected) {
        if (status !== "authenticated") {
          addNotification('Please sign in to get access', NotificationType.WARNING);
        } else {
          fetchAuthorDetails();
        }
      } else {
        addNotification('Please connect wallet to get access', NotificationType.WARNING);
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [wallet.publicKey]);
  

  return (
    <div>
      {wallet.publicKey && wallet.connected && status === "authenticated" && <>{children}</> }
      <NotificationsContainer 
        notifications={notifications} 
        removeNotification={removeNotification}
      />
    </div>
  )
}

export default AuthWrapper;
