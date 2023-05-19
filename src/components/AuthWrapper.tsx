import { useWallet } from "@solana/wallet-adapter-react";
import { useContext, useEffect } from "react";
import Author from "./Author";
import { NotificationType } from "@/types";
import { useSession } from "next-auth/react";
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
      const res = await fetch(`/api/getUser?param=${encodeURIComponent(wallet.publicKey.toString())}`, {
        method: 'GET',
      });      
      details = JSON.parse(await res.json()) as Author
      setAuthorDetails(details);
    } catch(e) {
      return;
    }
  };

  useEffect(() => {
    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session
    const visibilityHandler = () => document.visibilityState === "visible" && update()
    window.addEventListener("visibilitychange", visibilityHandler, false)
    window.removeEventListener("visibilitychange", visibilityHandler, false)

    // TIP: You can also use `navigator.onLine` and some extra event handlers
    // to check if the user is online and only update the session if they are.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
    const interval = setInterval(() => update(), 1000 * 60 * 60)
    clearInterval(interval)
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
