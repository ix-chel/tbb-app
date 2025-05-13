import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, router } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Store, Wrench, MessageSquare, Building2, Package } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
        roles: ['super-admin', 'Admin'],
    },
    {
        title: 'Perusahaan',
        href: route('companies.index'),
        icon: Building2,
        roles: ['super-admin', 'Admin'],
    },
    {
        title: 'Toko',
        href: route('stores.index'),
        icon: Store,
        roles: ['super-admin', 'Admin'],
    },
    {
        title: 'Jadwal Maintenance',
        href: route('schedules.index'),
        icon: Wrench,
        roles: ['super-admin', 'Admin', 'technician'],
    },
    {
        title  :'Inventory',
        href: route('inventory.index'),
        icon: Package,
        roles: ['super-admin', 'Admin', 'technician'],
    },
    {
        title: 'Feedback',
        href: route('feedback.index'),
        icon: MessageSquare,
    },
];

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

interface AppSidebarProps {
    user?: any;
}

export function AppSidebar({ user }: AppSidebarProps) {
    
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
