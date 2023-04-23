import parse from 'html-react-parser';

const PreviewContent = ({content}: {content: string}) => {
    return (
        <div className="h-auto bg-white w-full px-8 py-8">
            {parse(content)}
        </div>
    );
};

export default PreviewContent;
