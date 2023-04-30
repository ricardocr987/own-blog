import { Post } from '@/types';
import CategoriesTagsForm from './CategoriesTagsForm';
import FileUpload from './FileUpload';

type Props = {
    post: Post
    setPost: React.Dispatch<React.SetStateAction<Post>>
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>
    file: File | undefined
};

// i need the post in the parent because the content of the article is there
const PostForm: React.FC<Props> = ({ post, setPost, file, setFile }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPost((prevPost: Post) => ({ ...prevPost, [name]: value }));
    };

    return (
        <div className="w-auto bg-white p-6">
            <label htmlFor="title" className="block mb-1">Title:</label>
            <div className="border border-gray-300 rounded-md mb-4">
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="block w-full rounded-md text-sm py-2 px-3"
                    placeholder="Enter the title"
                    value={post.title}
                    onChange={handleChange}
                />
            </div>
            <label htmlFor="summary" className="block mb-1">Summary:</label>
            <div className="border border-gray-300 rounded-md mb-4">
                <textarea
                    id="summary"
                    name="summary"
                    rows={3}
                    className="block w-full rounded-md text-sm py-2 px-3"
                    placeholder="Enter the summary"
                    value={post.summary}
                    onChange={handleChange}
                />
            </div>
            <label htmlFor="featuredImage" className="block mb-1">Featured Image:</label>
            <div className="border border-gray-300 rounded-md mb-4">
                <FileUpload setFile={setFile} file={file}/>
            </div>
            <CategoriesTagsForm setPost={setPost} tags={post.categories}/>
            <div className="flex justify-center items-center mt-4 space-x-4">
                <div className="flex flex-col items-center">
                    <label htmlFor="token" className="block mb-2">Token:</label>
                    <div className="border border-gray-300 rounded-md mb-4">
                        <input
                            type="text"
                            id="token"
                            name="token"
                            className="rounded-md text-sm py-2 px-3"
                            placeholder="Enter the token"
                            value={post.token}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <label htmlFor="price" className="block mb-2">Price:</label>
                    <div className="border border-gray-300 rounded-md mb-4">
                        <input
                            type="text"
                            id="price"
                            name="price"
                            className="rounded-md text-sm py-2 px-3"
                            placeholder="Enter the price"
                            value={post.price}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostForm;
