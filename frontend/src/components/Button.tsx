import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  label: string
}

export const Button = ({ 
  variant = 'primary', 
  label, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2'
  const variants = {
    primary: `bg-blue-500 text-white ${!props.disabled && 'hover:bg-blue-600'} focus:ring-blue-300`,
    secondary: `bg-gray-200 text-gray-800 ${!props.disabled && 'hover:bg-gray-300'} focus:ring-gray-200`
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {label}
    </button>
  )
} 
