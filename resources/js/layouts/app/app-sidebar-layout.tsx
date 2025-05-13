import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, type ReactNode } from 'react';

interface AppSidebarLayoutProps extends PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[]; user?: any; header?: ReactNode }> {}

export default function AppSidebarLayout({ children, breadcrumbs = [], user, header }: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar user={user} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {header && <div className="mb-4">{header}</div>}
                {children}
            </AppContent>
        </AppShell>
    );
}
