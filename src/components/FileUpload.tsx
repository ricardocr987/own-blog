import { useState } from "react";

const validExtensions = ["image/jpeg", "image/jpg", "image/png"];

interface UploadFileProps {
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
  file: File | undefined
}

const UploadFile: React.FC<UploadFileProps> = ({setFile, file}) => {
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileValidation = (file: File) => {
    const fileType = file.type;
    if (validExtensions.includes(fileType)) {
      return true;
    } else {
      alert("This is not an Image File!");
      return false;
    }
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Do something with the image once it's loaded
  };

  return (
    <div
        className={`drag-area ${
            isDragActive ? "border-2 border-white" : "border-2 dashed border-white"
        } flex items-center justify-center flex-col h-44 w-full rounded-md`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        {file ? (
            <img
                className="w-full h-full object-cover rounded-md"
                src={URL.createObjectURL(file)}
                alt="uploaded file"
                onLoad={handleImageLoad}
            />
        ) : (
            <>
                <button className="px-4 py-2 text-2xl font-medium bg-white text-blue-600 rounded-md">
                    Drag & drop image
                </button>
                <input type="file" hidden onChange={handleInputChange} />
            </>
        )}
    </div>
  );
};

export default UploadFile;
