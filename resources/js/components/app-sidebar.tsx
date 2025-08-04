import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Building2, FileText, LayoutGrid, MessageSquare, Package, PersonStanding, QrCode, Store, Wrench, User } from 'lucide-react';
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
        title: 'Client',
        href: '/client',
        icon: User,
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

    const role = (usePage().props.auth as any)?.role_name;

    const filteredNavItems = useMemo(() => {
        if (!role) return [];

        const roleMap: Record<string, string[]> = {
            'super-admin': ['Dashboard', 'Companies', 'Stores', 'Inventory', 'QR Code', 'Maintenance Reports', 'Maintenance Schedule', 'Feedback', 'Users'],
            'admin':       ['Dashboard', 'Companies', 'Stores', 'Inventory', 'QR Code', 'Maintenance Reports', 'Maintenance Schedule', 'Feedback'],
            'technician':  ['Dashboard', 'Stores', 'Inventory','QR Code', 'Maintenance Reports', 'Maintenance Schedule', 'Feedback'],
            'client':      ['Client', 'Companies', 'Stores', 'Feedback'],
        };

        const allowed = roleMap[role] || [];

        return mainNavItems
            .filter((item) => allowed.includes(item.title))
            .map((item) => ({
                ...item,
                current: currentPath.startsWith(item.href),
            }));
    }, [role, currentPath]);


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
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
