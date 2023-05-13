import { NavLink } from "@/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface ProfileMenuProps {
    links: NavLink[]
    handleProfileMenuToggle: () => void
}

const ProfileMenu = ({links, handleProfileMenuToggle}: ProfileMenuProps)  => {
    const { disconnect } = useWallet();

    const handleDisconnect = () => {
        disconnect()
        signOut()
    }

    return (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10" onClick={handleProfileMenuToggle}>
            <ul className="py-1">
                {links.map((link, index) => (
                    link.url === 'Disconnect' ? (
                        <li onClick={() => handleDisconnect()} key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">{link.name}</span>
                        </li>
                    ) : (
                        <li key={index} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                            <Link href={`/${link.url}`}><span className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">{link.name}</span></Link>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
}

export default ProfileMenu;