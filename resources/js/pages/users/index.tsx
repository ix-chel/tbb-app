import AppLayout from '@/layouts/app-layout';
import { PageProps, User, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserData extends User {
    roles: string[];
    company?: {
        name: string;
    };
}

interface IndexProps extends PageProps {
    users: {
        data: UserData[];
        links: any[]; // Pagination links
    };
    filters: {
        search?: string;
        role?: string;
        company_id?: string;
        page?: string; // Add page to filters for pagination
    };
    roles: { value: string; label: string }[];
    companies: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
];

export default function Index({ auth, users, filters, roles, companies }: IndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || '');
    const [selectedCompany, setSelectedCompany] = useState(filters.company_id || '');
    const [currentPage, setCurrentPage] = useState(filters.page || '1'); // Track current page

    const applyFilters = () => {
        router.get(
            route('users.index'),
            {
                search: searchTerm || undefined,
                role: selectedRole || undefined,
                company_id: selectedCompany || undefined,
                page: currentPage || undefined, // Include current page in filters
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm !== filters.search) {
                setCurrentPage('1'); // Reset to page 1 on search term change
                applyFilters();
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
        if (selectedRole !== filters.role || selectedCompany !== filters.company_id) {
            setCurrentPage('1'); // Reset to page 1 on role or company change
            applyFilters();
        }
    }, [selectedRole, selectedCompany]);

    // Update currentPage when filters.page changes (e.g., from pagination)
    useEffect(() => {
        setCurrentPage(filters.page || '1');
    }, [filters.page]);

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Manajemen User" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                                        <Users className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-800 lg:text-4xl">Manajemen User</h1>
                                        <p className="text-lg text-slate-600">Kelola pengguna sistem dengan mudah</p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={route('users.create')}
                                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-cyan-600 hover:to-blue-600 hover:shadow-xl"
                            >
                                <Plus className="h-6 w-6 transition-transform group-hover:rotate-90" />
                                <span>Tambah User</span>
                            </Link>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="mb-10 rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-sm">
                        <h3 className="mb-6 text-xl font-semibold text-slate-800">Filter & Pencarian</h3>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="group relative">
                                <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400 transition-colors group-focus-within:text-cyan-500" />
                                <input
                                    type="text"
                                    placeholder="Cari user..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-6 pl-16 text-lg transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                />
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 px-6 py-4 text-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                            >
                                <option value="">Semua Role</option>
                                {roles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 px-6 py-4 text-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                            >
                                <option value="">Semua Perusahaan</option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="mb-10 overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                                    <tr>
                                        <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-slate-700 uppercase">Nama</th>
                                        <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-slate-700 uppercase">Email</th>
                                        <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-slate-700 uppercase">Role</th>
                                        <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-slate-700 uppercase">Perusahaan</th>
                                        <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-slate-700 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.data.map((user, index) => (
                                        <tr key={user.id} className="group transition-all duration-200 hover:bg-cyan-50/50">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 text-lg font-bold text-white shadow-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-lg font-semibold text-slate-800">{user.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-lg text-slate-600">{user.email}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="rounded-full bg-gradient-to-r from-cyan-100 to-blue-100 px-4 py-2 text-sm font-semibold text-cyan-800 shadow-sm"
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-lg text-slate-600">{user.company?.name || '-'}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-3">
                                                    <Link
                                                        href={route('users.edit', user.id)}
                                                        className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-cyan-500 hover:to-cyan-600 hover:shadow-xl"
                                                    >
                                                        <Edit className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                    </Link>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
                                                                // TODO: Implement delete logic
                                                            }
                                                        }}
                                                        className="group flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-red-400 to-red-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-red-500 hover:to-red-600 hover:shadow-xl"
                                                    >
                                                        <Trash2 className="h-5 w-5 transition-transform group-hover:scale-110" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 0 && (
                        <div className="flex justify-center">
                            <div className="flex gap-3 rounded-2xl border border-white/20 bg-white/70 p-4 shadow-xl backdrop-blur-sm">
                                {users.links.map((link: any, index: number) => {
                                    // Clean up the label to show "Previous" and "Next" instead of HTML entities
                                    let displayLabel = link.label;
                                    if (link.label.includes('&laquo;') || link.label.includes('Previous')) {
                                        displayLabel = 'Previous';
                                    } else if (link.label.includes('&raquo;') || link.label.includes('Next')) {
                                        displayLabel = 'Next';
                                    } else {
                                        displayLabel = link.label; // Use page number for other links
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (link.url) {
                                                    const url = new URL(link.url);
                                                    const pageParam = url.searchParams.get('page') || '1';
                                                    setCurrentPage(pageParam);
                                                    router.get(
                                                        route('users.index'),
                                                        {
                                                            search: searchTerm || undefined,
                                                            role: selectedRole || undefined,
                                                            company_id: selectedCompany || undefined,
                                                            page: pageParam,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            replace: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className={`rounded-xl px-6 py-3 text-lg font-semibold transition-all duration-300 ${
                                                link.active
                                                    ? 'scale-110 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                                    : 'text-slate-700 hover:scale-105 hover:bg-cyan-50 hover:text-cyan-600'
                                            } ${!link.url ? 'cursor-not-allowed text-slate-400' : ''}`}
                                            as="button"
                                        >
                                            {displayLabel}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
