import { useClickOutside } from "@/hooks";
import { Post } from "@/types";
import { useEffect, useRef, useState } from "react";
import Author from "./Author";
import moment from "moment";
import { debounce } from 'lodash';
import Link from "next/link";


const SearchBar = () => {
    const [showSearchBarPopup, setShowSearchBarPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('')
    const [authorsResult, setAuthorsResult] = useState<Author[]>([])
    const [postsResult, setPostResult] = useState<Post[]>([])
    const [authorsFiltered, setAuthorsFiltered] = useState<Author[]>([])
    const [postsFiltered, setPostFiltered] = useState<Post[]>([])
    const searchBarRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(searchBarRef, () => setShowSearchBarPopup(false));

    const handleChange = (value: string) => {
        setSearchTerm(value);
    };

    // Fetch data function
    const fetchData = async () => {
        try {
            const userResponse = await fetch('/api/getUser', { method: 'GET' });
            const userArray: string[] = JSON.parse(await userResponse.json());
            const users = userArray
                .map((user: string) => JSON.parse(user))
                .filter((user: Author) => {
                    return Object.values(user).every((value) => value !== undefined);
                }) as Author[];
      
            const articleResponse = await fetch('/api/getArticle', { method: 'GET' });
            const postsArray: string[] = JSON.parse(await articleResponse.json());
            const posts = postsArray
                .map((post: string) => JSON.parse(post))
                .filter((post: Post) => {
                    return Object.values(post).every((value) => value !== undefined);
                }) as Post[];
        
            setAuthorsResult(users);
            setPostResult(posts);
            setAuthorsFiltered(users);
            setPostFiltered(posts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
      
    
    // Search function
    const search = (searchTerm: string) => {
        console.log(authorsResult)
        const authors = authorsResult
        .filter((author) => {
            if (author.username) {
              return author.username.toLowerCase().includes(searchTerm.toLowerCase());
            }
            return false;
          })
            .sort((a, b) => {
                const aScore = a.username.toLowerCase().indexOf(searchTerm.toLowerCase());
                const bScore = b.username.toLowerCase().indexOf(searchTerm.toLowerCase());
                return bScore - aScore;
            });
        
        const posts = postsResult
            .filter((obj) => obj.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const aScore = a.title.toLowerCase().indexOf(searchTerm.toLowerCase());
                const bScore = b.title.toLowerCase().indexOf(searchTerm.toLowerCase());
                return bScore - aScore;
            });
      
        console.log(authors)
        setAuthorsFiltered(authors);
        setPostFiltered(posts);
    };

    // Fetch data useEffect
    useEffect(() => {
        if (showSearchBarPopup) fetchData();
    }, [showSearchBarPopup]);

    // Debounce search function
    const debouncedSearch = debounce(search, 200);

    // Search useEffect
    useEffect(() => {
        debouncedSearch(searchTerm);

        return debouncedSearch.cancel;
    }, [searchTerm]);
  

    return (
        <>
            {showSearchBarPopup &&
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-80 z-10 transition-all ease-in-out duration-1000">
                    <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2' ref={searchBarRef}>
                        <input
                            type="text"
                            placeholder={"Search..."}
                            value={searchTerm}
                            onChange={(e) => handleChange(e.target.value)}
                            required
                            className="bg-gray-200 text-gray-800 rounded-full w-72 sm:w-80 md:w-96 py-2 px-1 pl-8 mb-4"
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
                        <div className="grid grid-cols-2 gap-2" style={{ gridAutoRows: 'minmax(0, 1fr)' }}>
                            {authorsFiltered.length > 0 && (
                                <div className="max-w-screen-md mx-auto h-32 w-44">
                                    <h2 className="text-xl text-white font-bold mb-4">Authors:</h2>
                                    {authorsFiltered.map((author) => (
                                        <Link href={`/profile/${author.pubkey}`} key={author.pubkey} onClick={() => setShowSearchBarPopup(false)}>
                                            <div className="bg-gray-200 p-4 mb-4 rounded-md h-full w-full truncate cursor-pointer">
                                                <h3 className="text-xl font-bold mb-2">{author.username}</h3>
                                                <p className="text-base text-gray-700 mb-2">{author.bio}</p>
                                                <p className="text-xs text-gray-500">{moment(author.createdAt).format("MMM DD, YYYY")}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {postsFiltered.length > 0 && (
                                <div className="max-w-screen-md mx-auto h-32 w-44">
                                    <h2 className="text-xl text-white font-bold mb-4">Articles:</h2>
                                    {postsFiltered.map((post) => (
                                        <Link href={`/post/${post.id}`} key={post.id} onClick={() => setShowSearchBarPopup(false)}>
                                            <div className="bg-gray-200 p-4 mb-4 rounded-md h-full w-full truncate cursor-pointer">
                                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                                <p className="text-sm text-gray-700 mb-2">{post.summary}</p>
                                                <p className="text-xs text-gray-500">{moment(post.createdAt).format("MMM DD, YYYY")}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
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