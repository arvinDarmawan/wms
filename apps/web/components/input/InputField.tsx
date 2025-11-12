import { VariantProps, cva } from 'class-variance-authority';
import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    error?: boolean;
    errorMessage?: string;
}

const inputVariants = cva(
    'h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:placeholder:text-white/30',
    {
        variants: {
            state: {
                default:
                    'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800',
                error: 'text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500',
                disabled:
                    'text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
            }
        },
        defaultVariants: {
            state: 'default'
        }
    }
);

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, errorMessage, className, disabled, ...props }, ref) => {
        const state = disabled ? 'disabled' : error ? 'error' : 'default';

        return (
            <div className="relative">
                <input
                    ref={ref}
                    className={inputVariants({ state, className })}
                    disabled={disabled}
                    {...props}
                />
                {errorMessage && (
                    <p
                        className={`mt-1.5 text-xs ${error ? 'text-error-500' : 'text-gray-500'}`}>
                        {errorMessage}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
