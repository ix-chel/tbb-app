import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import type { Route } from 'ziggy-js';
import { User } from '@/types';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    current?: boolean;
    roles?: string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: string[];
    [key: string]: unknown;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[]; // Array data utama (misalnya array StoreData, ScheduleData)
    links: PaginationLink[]; // Link pagination (first, last, prev, next, pages)
    current_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    from: number;
    to: number;
    total: number;
}

export interface PageProps<T extends Record<string, unknown> = Record<string, unknown>> {
    auth: {
        user: User;
    };
    flash?: { // Flash messages
        success?: string;
        error?: string;
        message?: string; // Sesuai dengan controller Anda
    };
    filters?: Record<string, string>; // Untuk filter di halaman index
    // Tambahkan props umum lainnya yang mungkin dikirim dari backend
    [key: string]: any; // Izinkan prop lain
}

export interface OptionType {
    value: string | number;
    label: string;
}
export interface Store {
    id: number;
    name: string;
}

export type FeedbackType = 'bug_report' | 'suggestion' | 'complaint' | 'compliment' | 'general';
export type FeedbackStatus = 'new' | 'pending' | 'in_progress' | 'resolved' | 'closed';

export interface FeedbackData {
    id: number;
    user_id: number;
    store_id: number | null;
    maintenance_schedule_id: number | null;
    title: string | null; // Jika Anda memutuskan untuk memiliki judul
    comment: string;
    type: FeedbackType;
    rating: number | null;
    status: FeedbackStatus;
    admin_response: string | null;
    created_at: string;
    updated_at: string;
    user?: User;       // Untuk data user yang di-eager load
    store?: Store;     // Untuk data store yang di-eager load
    // Tambahkan relasi lain jika ada, misal: maintenance_schedule
}