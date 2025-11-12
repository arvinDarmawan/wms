import './globals.css';
import { SidebarProvider } from '@/context/SidebarContext';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
    subsets: ['latin']
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.className} dark:bg-gray-900`}>
                <SidebarProvider>{children}</SidebarProvider>
            </body>
        </html>
    );
}
