// resources/js/Pages/Stores/Index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, PageProps } from '@/types'; // Sesuaikan path jika perlu
import { Search, Plus, Edit, Trash2, ChevronRight, Briefcase, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { debounce } from 'lodash';
import { type BreadcrumbItem } from '@/types'; // Sesuaikan path jika perlu
import { useAppearance } from '@/hooks/use-appearance';

// --- Definisi Tipe (bisa diimpor dari file types) ---
interface CompanySimple {
    id: number;
    name: string;
}

interface StoreData {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    status: 'active' | 'inactive'; // Contoh status
    company?: CompanySimple;
    created_at: string;
    // Tambahkan properti lain yang relevan
}

interface StoresIndexProps extends PageProps {
    stores: PaginatedData<StoreData>;
    filters: {
        search?: string;
        company_id?: string;
        status?: string;
        sort_by?: string;
        sort_direction?: string;
    };
    companies: CompanySimple[];
    storeStatuses: { value: string; label: string }[];
}
// --- Akhir Definisi Tipe ---


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Toko',
        href: route('stores.index'), // Pastikan rute 'stores.index' ada
    },
];

export default function Index({ auth, stores, filters, companies, storeStatuses, flash }: StoresIndexProps) {
    const { appearance } = useAppearance();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCompany, setSelectedCompany] = useState(filters.company_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');

    const applyFilters = useCallback(
        debounce((params: Record<string, string | undefined>) => {
            router.get(route('stores.index'), params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300),
        []
    );

    useEffect(() => {
        const currentParams: Record<string, string | undefined> = {
            search: searchTerm || undefined,
            company_id: selectedCompany || undefined,
            status: selectedStatus || undefined,
            sort_by: sortBy,
            sort_direction: sortDirection,
        };
        Object.keys(currentParams).forEach(key => {
            if (currentParams[key] === undefined || currentParams[key] === '') {
                delete currentParams[key];
            }
        });
        applyFilters(currentParams);
    }, [searchTerm, selectedCompany, selectedStatus, sortBy, sortDirection, applyFilters]);

    const handleDelete = (storeId: number, storeName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus toko "${storeName}"?`)) {
            router.delete(route('stores.destroy', storeId), { // Pastikan rute 'stores.destroy' ada
                preserveScroll: true,
                // onSuccess: () => { /* Tambah notifikasi */ }
            });
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            const [field, direction] = value.split(':');
            setSortBy(field);
            setSortDirection(direction);
        } else {
            setSortBy('name');
            setSortDirection('asc');
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch (e) { return "Invalid date"; }
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Daftar Toko" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Daftar Semua Toko</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola semua toko dari berbagai perusahaan.</p>
                    </div>
                    <Link
                        href={route('stores.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-150"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Toko Baru</span>
                    </Link>
                </div>

                {/* Filter dan Pencarian */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari nama toko, alamat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                        >
                            <option value="">Semua Perusahaan</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id.toString()}>{company.name}</option>
                            ))}
                        </select>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                        >
                        </select>
                        <select
                            value={`${sortBy}:${sortDirection}`}
                            onChange={handleSortChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                        >
                            <option value="name:asc">Nama Toko (A-Z)</option>
                            <option value="name:desc">Nama Toko (Z-A)</option>
                            <option value="company.name:asc">Perusahaan (A-Z)</option>
                            <option value="company.name:desc">Perusahaan (Z-A)</option>
                            <option value="created_at:desc">Tanggal Dibuat (Terbaru)</option>
                            <option value="created_at:asc">Tanggal Dibuat (Terlama)</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Toko */}
                {stores.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.data.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onDelete={() => handleDelete(store.id, store.name)}
                                formatDate={formatDate}
                                isDark={appearance === 'dark' || (appearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Tidak ada toko yang ditemukan.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Coba ubah filter atau buat toko baru.</p>
                    </div>
                )}

                {/* Pagination */}
                {stores.links && stores.data.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        {stores.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 border rounded-lg transition duration-150
                                    ${link.active ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                    ${!link.url ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : ''}
                                `}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                                preserveState
                                // @ts-ignore Inertia Link 'disabled' prop type issue with boolean
                                disabled={!link.url}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

// --- Komponen StoreCard ---
interface StoreCardProps {
    store: StoreData;
    onDelete: () => void;
    formatDate: (dateString: string) => string;
    isDark: boolean;
}

function StoreCard({ store, onDelete, formatDate, isDark }: StoreCardProps) {
    const statusClasses = {
        active: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700',
        inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600',
    };
    const statusIcons = {
        active: <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />,
        inactive: <XCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
            <div>
                <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${store.status === 'active' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700/30'}`}>
                        <Briefcase className={`w-6 h-6 ${store.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <Link href={route('stores.show', store.id)}>
                                    {store.name}
                                </Link>
                            </h3>
                        </div>
                        {store.company && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">Perusahaan: {store.company.name}</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                    {store.address && (
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
                            <span>{store.address}{store.city ? `, ${store.city}` : ''}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                        <span>Dibuat: {formatDate(store.created_at)}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Link
                    href={route('stores.edit', store.id)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors"
                    title="Edit Toko"
                >
                    <Edit className="w-4 h-4" />
                </Link>
                <button
                    onClick={onDelete}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                    title="Hapus Toko"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <Link
                    href={route('stores.show', store.id)}
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    Lihat Detail <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}