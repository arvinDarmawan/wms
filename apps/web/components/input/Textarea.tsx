import { VariantProps, cva } from 'class-variance-authority';
import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextAreaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement>,
        VariantProps<typeof textAreaVariants> {
    error?: boolean;
    errorMessage?: string;
}

const textAreaVariants = cva(
    'w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden focus:ring-3 placeholder:text-gray-400',
    {
        variants: {
            state: {
                default:
                    'bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10',
                error: 'text-error-800 border-error-500 focus:border-error-500 focus:ring-error-500/10',
                disabled:
                    'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed opacity-50'
            }
        },
        defaultVariants: {
            state: 'default'
        }
    }
);

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ error, errorMessage, className, disabled, ...props }, ref) => {
        const state = disabled ? 'disabled' : error ? 'error' : 'default';

        return (
            <div className="relative">
                <textarea
                    ref={ref}
                    className={textAreaVariants({ state, className })}
                    disabled={disabled}
                    {...props}
                />
                {errorMessage && (
                    <p
                        className={`mt-2 text-sm ${error ? 'text-error-500' : 'text-gray-500'}`}>
                        {errorMessage}
                    </p>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
export default TextArea;
