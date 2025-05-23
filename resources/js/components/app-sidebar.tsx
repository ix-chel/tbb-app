import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Store, Wrench, MessageSquare, Building2, Package, PersonStanding, QrCode } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const iconMap: Record<string, any> = {
    'home': LayoutGrid,
    'office-building': Building2,
    'store': Store,
    'cube': Package,
    'wrench-screwdriver': Wrench,
    'chat-bubble-left-right': MessageSquare,
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Companies',
        href: '/companies',
        icon: Building2,
    },
    {
        title: 'Stores',
        href: '/stores',
        icon: Store,
    },
    {
        title: 'Inventory',
        href: '/inventory',
        icon: Package,
    },
    {
        title: 'QR Code',
        href: '/FilterQR',
        icon: QrCode,
    },
    {
        title: 'Maintenance Schedule',
        href: '/schedules',
        icon: Wrench,
    },
    {
        title: 'Feedback',
        href: '/feedback',
        icon: MessageSquare,
    },
    {
        title: 'Users',
        href: '/users',
        icon: PersonStanding,
    },
];

interface AppSidebarProps {
    user?: any;
}

export function AppSidebar({ user }: AppSidebarProps) {
    const { props } = usePage();
    const currentPath = (props?.url as string) || '/';
    
    // Update current state for menu items
    const navItems = useMemo(() => {
        return mainNavItems.map(item => ({
            ...item,
            current: currentPath.startsWith(item.href)
        }));
    }, [currentPath]);
    
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
