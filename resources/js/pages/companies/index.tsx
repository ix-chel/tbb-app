// resources/js/Pages/Companies/Index.tsx
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { PageProps, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Building2, ChevronRight, Edit3, Eye, Mail, MapPin, Phone, Plus, Search, User } from 'lucide-react';
import React from 'react';

interface StoreData {
    id: number;
    name: string;
    address: string;
}

interface CompanyData {
    id: number;
    name: string;
    address: string;
    phone: string;
    email?: string;
    registration_number?: string;
    contact_person_name?: string;
    contact_person_email?: string;
    contact_person_phone?: string;
    stores: StoreData[];
}

interface IndexProps extends PageProps {
    companies: PaginatedData<CompanyData>;
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perusahaan',
        href: '/companies',
    },
];

export default function Index({ auth, companies, filters, flash }: IndexProps) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [selectedCompany, setSelectedCompany] = React.useState<CompanyData | null>(null);

    // Check user role
    const userRole = auth.user?.role_name;
    const isClient = userRole === 'client';
    const isAdmin = userRole === 'admin' || userRole === 'super-admin';

    React.useEffect(() => {
        if (companies.data.length > 0 && !selectedCompany) {
            setSelectedCompany(companies.data[0]);
        }
    }, [companies, selectedCompany]);

    const handleCompanyRowClick = (company: CompanyData) => {
        setSelectedCompany(company);
    };

    const handleDetailButtonClick = (e: React.MouseEvent, company: CompanyData) => {
        e.stopPropagation();
        setSelectedCompany(company);
        console.log('Detail button clicked for:', company.name);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Companies" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {isClient ? 'Informasi Perusahaan' : 'Daftar Perusahaan'}
                                </h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    {isClient 
                                        ? 'Informasi detail perusahaan Anda'
                                        : 'Kelola dan pantau semua perusahaan yang terdaftar dalam sistem'
                                    }
                                </p>
                            </div>
                            {isAdmin && (
                                <Link
                                    href={route('companies.create')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:shadow-sky-500/30 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none dark:focus:ring-offset-gray-900"
                                >
                                    <Plus className="h-5 w-5" />
                                    Tambah Perusahaan
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Search Section - Only show for admin */}
                    {isAdmin && (
                        <div className="mb-8">
                            <div className="relative max-w-md">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Cari perusahaan..."
                                    className="block w-full rounded-2xl border-0 bg-white py-4 pr-4 pl-12 text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:focus:ring-sky-400"
                                    value={filters.search || ''}
                                    onChange={(e) => {
                                        router.get(
                                            route('companies.index'),
                                            { search: e.target.value },
                                            { preserveState: true, preserveScroll: true, replace: true },
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Companies List */}
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                                <div className="p-6">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                                        Daftar Perusahaan ({companies.total})
                                    </h2>

                                    {companies.data.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <Building2 className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Tidak ada perusahaan</h3>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Mulai dengan menambahkan perusahaan baru</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {companies.data.map((company) => (
                                                <div
                                                    key={company.id}
                                                    onClick={() => handleCompanyRowClick(company)}
                                                    className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                                                        selectedCompany?.id === company.id
                                                            ? 'border-sky-200 bg-sky-50/50 shadow-sm dark:border-sky-800 dark:bg-sky-900/20'
                                                            : 'dark:bg-gray-750 border-gray-100 bg-white hover:border-sky-200 hover:bg-sky-50/30 dark:border-gray-700 dark:hover:border-sky-700 dark:hover:bg-sky-900/10'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="min-w-0 flex-1">
                                                            <div className="mb-2 flex items-center gap-3">
                                                                <div className="flex-shrink-0">
                                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/50">
                                                                        <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                                                    </div>
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                                                        {company.name}
                                                                    </h3>
                                                                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                                        <span className="truncate">{company.address}</span>
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                                    {company.contact_person_name && (
                                                                        <span className="flex items-center gap-1">
                                                                            <User className="h-3 w-3" />
                                                                            {company.contact_person_name}
                                                                        </span>
                                                                    )}
                                                                    {company.stores && (
                                                                        <span className="flex items-center gap-1">
                                                                            <Building2 className="h-3 w-3" />
                                                                            {company.stores.length} toko
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <ChevronRight className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {companies.links && companies.data.length > 0 && (
                                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-1 justify-between sm:hidden">
                                                {companies.prev_page_url && (
                                                    <Link
                                                        href={companies.prev_page_url}
                                                        className="relative inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    >
                                                        Previous
                                                    </Link>
                                                )}
                                                {companies.next_page_url && (
                                                    <Link
                                                        href={companies.next_page_url}
                                                        className="relative ml-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    >
                                                        Next
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        Menampilkan <span className="font-medium">{companies.from}</span> sampai{' '}
                                                        <span className="font-medium">{companies.to}</span> dari{' '}
                                                        <span className="font-medium">{companies.total}</span> hasil
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
                                                        {companies.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                aria-current={link.active ? 'page' : undefined}
                                                                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                                                                    link.active
                                                                        ? 'z-10 border-sky-500 bg-sky-50 text-sky-600 dark:border-sky-600 dark:bg-sky-900 dark:text-sky-300'
                                                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                } ${index === 0 ? 'rounded-l-lg' : ''} ${
                                                                    index === companies.links.length - 1 ? 'rounded-r-lg' : ''
                                                                } ${!link.url ? 'cursor-not-allowed opacity-50' : ''} border`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                                preserveScroll
                                                            />
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Company Details Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                {selectedCompany ? (
                                    <div className="space-y-6">
                                        {/* Company Details Card */}
                                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                                            <div className="p-6">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Perusahaan</h3>
                                                    {isAdmin && (
                                                        <Link
                                                            href={route('companies.edit', selectedCompany.id)}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-colors duration-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                            {selectedCompany.name}
                                                        </h4>
                                                        <div className="space-y-3 text-sm">
                                                            <div className="flex items-start gap-3">
                                                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                <span className="text-gray-600 dark:text-gray-300">{selectedCompany.address}</span>
                                                            </div>

                                                            {selectedCompany.phone && (
                                                                <div className="flex items-center gap-3">
                                                                    <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                    <span className="text-gray-600 dark:text-gray-300">{selectedCompany.phone}</span>
                                                                </div>
                                                            )}

                                                            {selectedCompany.email && (
                                                                <div className="flex items-center gap-3">
                                                                    <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                    <span className="text-gray-600 dark:text-gray-300">{selectedCompany.email}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {(selectedCompany.contact_person_name ||
                                                        selectedCompany.contact_person_email ||
                                                        selectedCompany.contact_person_phone) && (
                                                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                                            <h5 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">Kontak Person</h5>
                                                            <div className="space-y-2 text-sm">
                                                                {selectedCompany.contact_person_name && (
                                                                    <div className="flex items-center gap-3">
                                                                        <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {selectedCompany.contact_person_name}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {selectedCompany.contact_person_phone && (
                                                                    <div className="flex items-center gap-3">
                                                                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {selectedCompany.contact_person_phone}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {selectedCompany.contact_person_email && (
                                                                    <div className="flex items-center gap-3">
                                                                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                                                                        <span className="text-gray-600 dark:text-gray-300">
                                                                            {selectedCompany.contact_person_email}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {selectedCompany.registration_number && (
                                                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                                            <div className="text-sm">
                                                                <span className="font-medium text-gray-900 dark:text-white">No. Registrasi:</span>
                                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                                    {selectedCompany.registration_number}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stores Card */}
                                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                                            <div className="p-6">
                                                <div className="mb-4 flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        Daftar Toko ({selectedCompany.stores?.length || 0})
                                                    </h3>
                                                    <Link
                                                        href={route('stores.create', { company_id: selectedCompany.id })}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors duration-200 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Tambah
                                                    </Link>
                                                </div>

                                                {selectedCompany.stores && selectedCompany.stores.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {selectedCompany.stores.map((store) => (
                                                            <div
                                                                key={store.id}
                                                                className="dark:hover:bg-gray-750 rounded-lg border border-gray-200 p-3 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700"
                                                            >
                                                                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                                    {store.name}
                                                                </h4>
                                                                <p className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                                                    <span>{store.address}</span>
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="py-8 text-center">
                                                        <Building2 className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
                                                        <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Belum ada toko</h4>
                                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            Tambahkan toko untuk perusahaan ini
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                                        <Eye className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                                        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Pilih Perusahaan</h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Klik pada salah satu perusahaan untuk melihat detail
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
