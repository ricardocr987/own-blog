import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect } from "react";
import Author from "./Author";
import { GetUserResponse, NotificationType } from "@/types";
import { useSession } from "next-auth/react";
import { Get as getAggregate } from 'aleph-sdk-ts/dist/messages/aggregate';
import { messagesAddress } from "@/constants";
import { NotificationContext } from "@/contexts/NotificationContext";

interface AuthWrapperProps {
  children: React.ReactNode
  setAuthorDetails: (value: React.SetStateAction<Author>) => void
}

const AuthWrapper = ({ children, setAuthorDetails }: AuthWrapperProps) => {
  const wallet = useWallet();
  const { addNotification } = useContext(NotificationContext);
  const { status, update, data: session } = useSession();

  const fetchAuthorDetails = async () => {
    if (!wallet.publicKey) return;

    let details: Author | undefined = undefined
    try {
      const response = await getAggregate<GetUserResponse>({
        keys: [wallet.publicKey.toString()],
        address: messagesAddress,
        APIServer: 'https://api2.aleph.im'
      });
      details = response[wallet.publicKey.toString()]
      setAuthorDetails(details);
    } catch {
      return;
    }
  };

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
  }, [wallet.publicKey, session?.user.username]);
  

  return (
    <div>
      {wallet.publicKey && wallet.connected && status === "authenticated" && <>{children}</> }
    </div>
  )
}

export default AuthWrapper;
