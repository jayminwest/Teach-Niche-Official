import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  label: string
  isLoading?: boolean // Add isLoading prop to ButtonProps
}

export const Button = ({
  variant = 'primary',
  label,
  className = '',
  isLoading = false, // Add isLoading to the destructured props with a default value
  ...props // Keep the rest of the props
}: ButtonProps) => { // Destructure isLoading here
  const baseStyles = `px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 ${isLoading || props.disabled ? 'opacity-50 cursor-not-allowed' : ''}` // Disable and style when isLoading or disabled
  const variants = {
    primary: `bg-blue-500 text-white ${!(isLoading || props.disabled) && 'hover:bg-blue-600'} focus:ring-blue-300`, // Conditional hover style
    secondary: `bg-gray-200 text-gray-800 ${!(isLoading || props.disabled) && 'hover:bg-gray-300'} focus:ring-gray-200` // Conditional hover style
  }

  // Separate isLoading from the props that are spread
  const { isLoading: _isLoading, ...restProps } = props;


  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...restProps} // Spread only the rest of the props
      disabled={isLoading || props.disabled} // Keep using isLoading for disabled
    >
      {label}
      {isLoading && (
        <span className="ml-2 loading loading-spinner loading-sm"></span> // Optional: Add a spinner if you want visual feedback
      )}
    </button>
  )
}
