import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    Store,
    QrCode,
    FileText,
    Settings,
    Users,
    Building
} from 'lucide-react';

const menuItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: Store
    },
    {
        title: 'Stores',
        href: '/admin/stores',
        icon: Building
    },
    {
        title: 'QR Codes',
        href: '/admin/qr-codes',
        icon: QrCode
    },
    {
        title: 'Maintenance Reports',
        href: '/admin/maintenancereports',
        icon: FileText
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: Users
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings
    }
];

export function AdminSidebar() {
    const location = useLocation();

    return (
        <div className="flex flex-col h-full border-r bg-background">
            <div className="p-6">
                <h2 className="text-lg font-semibold">Admin Panel</h2>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                                location.pathname === item.href
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
} 