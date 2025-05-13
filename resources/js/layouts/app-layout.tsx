import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    user?: any;
    header?: ReactNode;
}

export default ({ children, breadcrumbs, user, header, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} user={user} header={header} {...props}>
        {children}
    </AppLayoutTemplate>
);
