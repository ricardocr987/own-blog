import { Author, NavLink, AuthorInfo } from "@/types";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { useClickOutside } from "@/hooks";
import { useState, useRef } from "react";

interface ProfileMenuProps {
    session: AuthorInfo
    links: NavLink[]
    authorDetails: Author
}

const HeaderAuthorDetails = ({ session, links, authorDetails }: ProfileMenuProps)  => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const handleProfileMenuToggle = () => {
        setShowProfileMenu(!showProfileMenu);
    };
    const profileMenuRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(profileMenuRef, () => setShowProfileMenu(false));

    return (
        <div onClick={handleProfileMenuToggle} ref={profileMenuRef} className="relative px-2 md:px-3 py-2 font-medium cursor-pointer">
            <div className="flex items-center"  ref={profileMenuRef}>
                <Image
                    unoptimized
                    width={30}
                    height={30}
                    alt={session.username || authorDetails.username}
                    className="drop-shadow-lg rounded-full"
                    src={session.uri || authorDetails.uri}
                />
                <p className="inline align-middle ml-2 font-medium">{session.username || authorDetails.username}</p>
            </div>
            {showProfileMenu && (
                <ProfileMenu links={links} handleProfileMenuToggle={handleProfileMenuToggle}/>
            )}
        </div>
    );
}

export default HeaderAuthorDetails;