import { VariantProps, cva } from 'class-variance-authority';
import React, { ReactNode } from 'react';

interface ButtonProps extends VariantProps<typeof buttonStyles> {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const buttonStyles = cva(
    'inline-flex items-center justify-center font-medium gap-2 rounded-lg transition',
    {
        variants: {
            size: {
                sm: 'px-4 py-3 text-sm',
                md: 'px-5 py-3.5 text-sm'
            },
            variant: {
                primary:
                    'bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300',
                outline:
                    'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300'
            },
            disabled: {
                true: 'cursor-not-allowed opacity-50',
                false: ''
            }
        },
        defaultVariants: {
            size: 'md',
            variant: 'primary',
            disabled: false
        }
    }
);

const Button: React.FC<ButtonProps> = ({
    children,
    type = 'button',
    startIcon,
    endIcon,
    onClick,
    className = '',
    size,
    variant,
    disabled = false
}) => {
    return (
        <button
            type={type}
            className={buttonStyles({ size, variant, disabled, className })}
            onClick={onClick}
            disabled={disabled}>
            {startIcon && (
                <span className="flex items-center">{startIcon}</span>
            )}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );
};

export default Button;
