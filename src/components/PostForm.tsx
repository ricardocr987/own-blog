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
        <div className="w-auto bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex-1 mb-4 lg:mb-0">
                    <label htmlFor="title" className="block mb-1">Title:</label>
                    <div className="border border-gray-300 rounded-md">
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="block w-full rounded-md text-sm py-2 px-3 bg-white"
                            placeholder="Enter the title"
                            value={post.title}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-center">
                <div className="flex-1 mb-4 lg:mb-0">
                    <label htmlFor="summary" className="block mb-2 mt-2">Summary:</label>
                    <div className="border border-gray-300 rounded-md mb-4">
                        <textarea
                            id="summary"
                            name="summary"
                            rows={3}
                            className="block w-full rounded-md text-sm py-2 px-3 bg-white"
                            placeholder="Enter the summary"
                            value={post.summary}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="flex-1 mb-4 lg:mb-0 lg:ml-10">
                    <label className="block mb-2">Featured Image:</label>
                    <div className="border border-gray-300 rounded-md mb-4">
                        <FileUpload setFile={setFile} file={file}/>
                    </div>
                </div>
            </div>
            <CategoriesTagsForm setPost={setPost} tags={post.tags}/>
        </div>
    );
};

export default PostForm;
