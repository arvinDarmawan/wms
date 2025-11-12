import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    desc?: string;
}

const Card: React.FC<CardProps> = ({
    title,
    children,
    className = '',
    desc = ''
}) => {
    return (
        <div
            className={`rounded-2xl border border-gray-200 bg-white ${className}`}>
            <div className="px-6 py-5">
                <h3 className="text-base font-medium text-gray-8000">
                    {title}
                </h3>
                {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
            </div>

            <div className="p-4 border-t border-gray-100 sm:p-6">
                <div className="space-y-6">{children}</div>
            </div>
        </div>
    );
};

export default Card;
