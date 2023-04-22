import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled = false, className = '' }) => {
  const buttonClasses = `py-2 px-4 rounded-lg text-white font-medium ${
    disabled
      ? 'bg-gray-300 cursor-not-allowed'
      : 'bg-gradient-to-r from-gray-800 via-gray-900 to-black hover:from-gray-700 hover:to-gray-800'
  } ${className}`;

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
