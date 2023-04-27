import { useClickOutside } from "@/hooks";
import { useRef, useState } from "react";

const SearchBar = () => {
  const [showSearchBarPopup, setShowSearchBarPopup] = useState(false);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(searchBarRef, () => setShowSearchBarPopup(false));

    return (
        <>
            {showSearchBarPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-80 z-10 transition-all ease-in-out duration-1000 ">
                    <div ref={searchBarRef}>
                        <form className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <input
                                type="text"
                                className="bg-gray-200 text-gray-800 rounded-full w-72 sm:w-80 md:w-96 py-2 px-1 pl-8"
                                placeholder="Search..."
                            />
                            <div className="absolute top-0 left-0">
                                <svg
                                    className="fill-current w-4 h-4 mt-3 ml-2 text-gray-800 cursor-pointer"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    onClick={() => setShowSearchBarPopup(false)}
                                >
                                    <path d="M19.707 4.293a1 1 0 0 0-1.414 0L12 10.586 5.707 4.293a1 1 0 1 0-1.414 1.414L10.586 12l-6.293 6.293a1 1 0 0 0 1.414 1.414L12 13.414l6.293 6.293a1 1 0 0 0 1.414-1.414L13.414 12l6.293-6.293a1 1 0 0 0 0-1.414z" />
                                </svg>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="float-right my-2 px-2 cursor-pointer text-white hover:text-black" onClick={() => setShowSearchBarPopup(true)}>
                <div className="relative border rounded-full px-2 py-2 transition-colors duration-300 ease-in-out hover:bg-white">
                    <svg className="fill-current w-4 h-4 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M23.707 22.293l-6.271-6.271c1.136-1.448 1.865-3.256 1.865-5.277 0-4.971-4.029-9-9-9s-9 4.029-9 9 4.029 9 9 9c2.021 0 3.829-.729 5.277-1.865l6.271 6.271a1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414zM4 9c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" />
                    </svg>
                </div>
            </div>
        </>
    );
}

export default SearchBar