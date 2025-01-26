import { ReactNode } from 'react';

interface CustomInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export const CustomInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  required = false,
  className = ''
}: CustomInputProps) => (
  <div className={`grid gap-2 ${className}`}>
    <label htmlFor={name} className="text-sm font-medium text-[#6B5E4C]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="px-3 py-2 rounded-lg border border-[#6B5E4C]/20 focus:outline-none focus:ring-2 focus:ring-[#6B5E4C]/20 focus:border-[#6B5E4C]/40 bg-white text-[#6B5E4C] placeholder-[#6B5E4C]/40 transition-all duration-200"
    />
  </div>
);

interface CustomButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const CustomButton = ({ 
  onClick, 
  disabled, 
  variant = 'primary',
  children,
  className = '',
  type = 'button'
}: CustomButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
      ${variant === 'primary' 
        ? 'bg-[#6B5E4C] text-white hover:bg-[#8C7E6A] active:bg-[#5A4E3C]' 
        : 'bg-white text-[#6B5E4C] border border-[#6B5E4C]/20 hover:bg-[#F8F6F3] active:bg-[#F0EDE8]'}
      ${className}
    `}
  >
    {children}
  </button>
);