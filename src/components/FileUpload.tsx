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
    if (droppedFile && handleFileValidation(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileValidation = (file: File) => {
    const fileType = file.type;
    if (validExtensions.includes(fileType)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
        className={`drag-area ${
            isDragActive ? "border-2 " : "border-2 dashed "
        } flex items-center justify-center flex-col h-20 w-full rounded-md transition-colors text-3xl duration-300 ease-in-out text-gray-400 bg-white hover:text-black font-medium cursor-pointer`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
    >
        {file ? (
            <img
                className="w-full h-full object-cover rounded-md "
                src={URL.createObjectURL(file)}
                alt="uploaded file"
            />
        ) : (
            <>
                Drag & drop
                <input type="image" hidden onChange={handleInputChange} />
            </>
        )}
    </div>
  );
};

export default UploadFile;
