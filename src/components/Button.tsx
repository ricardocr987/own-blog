import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false, className = '' }) => {
  const buttonClasses = `py-2 px-4 border rounded-lg transition-colors duration-300 ease-in-out text-white hover:text-black hover:bg-white font-medium ${
    disabled
      ? 'bg-gray-300 cursor-not-allowed'
      : ''
  } ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
