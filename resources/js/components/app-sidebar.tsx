import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, FileText, LayoutGrid, MessageSquare, Package, PersonStanding, QrCode, Store, Wrench } from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from './app-logo';

const iconMap: Record<string, any> = {
    home: LayoutGrid,
    'office-building': Building2,
    store: Store,
    cube: Package,
    'wrench-screwdriver': Wrench,
    'chat-bubble-left-right': MessageSquare,
    'qr-code': QrCode,
    'file-text': FileText,
};

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
        title: 'Maintenance Reports',
        href: '/maintenancereport',
        icon: FileText,
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
        return mainNavItems.map((item) => ({
            ...item,
            current: currentPath.startsWith(item.href),
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
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
