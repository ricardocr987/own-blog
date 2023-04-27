import { Author, NavLink } from "@/types";
import Image from "next/image";
import ProfileMenu from "./ProfileMenu";
import { useClickOutside } from "@/hooks";
import { useState, useRef } from "react";

interface ProfileMenuProps {
    authorDetails: Author
    links: NavLink[]
}

const HeaderAuthorDetails = ({ authorDetails, links }: ProfileMenuProps)  => {
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
                    alt={authorDetails.username}
                    className="drop-shadow-lg rounded-full"
                    src={authorDetails.uri}
                />
                <p className="inline align-middle ml-2 font-medium">{authorDetails.username}</p>
            </div>
            {showProfileMenu && (
                <ProfileMenu links={links} handleProfileMenuToggle={handleProfileMenuToggle}/>
            )}
        </div>
    );
}

export default HeaderAuthorDetails;