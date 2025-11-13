'use client';

import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
    BoxesIcon,
    EllipsisIcon,
    LogOutIcon,
    PencilIcon,
    ScaleIcon,
    TruckIcon,
    UserIcon,
    UsersIcon,
    WarehouseIcon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
};

const operationItems: NavItem[] = [
    {
        icon: <TruckIcon />,
        name: 'Order',
        path: '/order'
    },
    {
        icon: <PencilIcon />,
        name: 'Adjustment',
        path: '/inventory-adjustment'
    }
];

const masterItems: NavItem[] = [
    {
        icon: <UserIcon />,
        name: 'User',
        path: '/users'
    },
    {
        icon: <BoxesIcon />,
        name: 'Item',
        path: '/items'
    },
    {
        icon: <ScaleIcon />,
        name: 'Uom',
        path: '/uoms'
    },
    {
        icon: <UsersIcon />,
        name: 'Customer',
        path: '/customers'
    },
    {
        icon: <WarehouseIcon />,
        name: 'Warehouse',
        path: '/warehouses'
    }
];

const otherItems: NavItem[] = [
    {
        icon: <LogOutIcon />,
        name: 'Sign out',
        path: '/signin'
    }
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { user } = useAuth();
    const pathname = usePathname();

    const renderMenuItems = (navItems: NavItem[]) => (
        <ul className="flex flex-col gap-4">
            {navItems.map((nav) => (
                <li key={nav.name}>
                    {nav.path && (
                        <Link
                            href={nav.path}
                            className={`menu-item group ${
                                isActive(nav.path)
                                    ? 'menu-item-active'
                                    : 'menu-item-inactive'
                            }`}>
                            <span
                                className={`${
                                    isActive(nav.path)
                                        ? 'menu-item-icon-active'
                                        : 'menu-item-icon-inactive'
                                }`}>
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className={`menu-item-text`}>
                                    {nav.name}
                                </span>
                            )}
                        </Link>
                    )}
                </li>
            ))}
        </ul>
    );

    const isActive = useCallback(
        (path: string) => path === pathname,
        [pathname]
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
            isExpanded || isMobileOpen
                ? 'w-[290px]'
                : isHovered
                  ? 'w-[290px]'
                  : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <div
                className={`py-8 flex  ${
                    !isExpanded && !isHovered
                        ? 'lg:justify-center'
                        : 'justify-start'
                }`}>
                <div className="flex flex-col">
                    {user && (isExpanded || isHovered || isMobileOpen) ? (
                        <>
                            <span className="block font-medium text-gray-700 text-theme-sm">
                                Hi, {user.fullName}
                            </span>
                            <span className="mt-0.5 block text-theme-xs text-gray-500">
                                {user.email}
                            </span>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Operation'
                                ) : (
                                    <EllipsisIcon />
                                )}
                            </h2>
                            {renderMenuItems(operationItems)}
                        </div>

                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Master'
                                ) : (
                                    <EllipsisIcon />
                                )}
                            </h2>
                            {renderMenuItems(masterItems)}
                        </div>

                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? 'lg:justify-center'
                                        : 'justify-start'
                                }`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    'Other'
                                ) : (
                                    <EllipsisIcon />
                                )}
                            </h2>
                            {renderMenuItems(otherItems)}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

export default AppSidebar;
