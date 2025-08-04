// resources/js/Pages/Stores/Index.tsx
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { PageProps, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Briefcase, Building2, Calendar, CheckCircle, ChevronRight, Edit, Eye, Filter, MapPin, Plus, Search, Trash2, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// --- Definisi Tipe ---
interface CompanySimple {
    id: number;
    name: string;
}

interface StoreData {
    id: number;
    name: string;
    address: string | null;
    city: string | null;
    status: 'active' | 'inactive';
    company?: CompanySimple;
    created_at: string;
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Toko',
        href: route('stores.index'),
    },
];

export default function Index({ auth, stores, filters, companies, storeStatuses, flash }: StoresIndexProps) {
    const { appearance } = useAppearance();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCompany, setSelectedCompany] = useState(filters.company_id || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'name');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'asc');
    const [showFilters, setShowFilters] = useState(false);

    const applyFilters = useCallback(
        debounce((params: Record<string, string | undefined>) => {
            router.get(route('stores.index'), params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300),
        [],
    );

    useEffect(() => {
        const currentParams: Record<string, string | undefined> = {
            search: searchTerm || undefined,
            company_id: selectedCompany || undefined,
            status: selectedStatus || undefined,
            sort_by: sortBy,
            sort_direction: sortDirection,
        };
        Object.keys(currentParams).forEach((key) => {
            if (currentParams[key] === undefined || currentParams[key] === '') {
                delete currentParams[key];
            }
        });
        applyFilters(currentParams);
    }, [searchTerm, selectedCompany, selectedStatus, sortBy, sortDirection, applyFilters]);

    const handleDelete = (storeId: number, storeName: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus toko "${storeName}"?`)) {
            router.delete(route('stores.destroy', storeId), {
                preserveScroll: true,
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
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch (e) {
            return 'Invalid date';
        }
    };

    const getStatusBadge = (status: string) => {
        const isActive = status === 'active';
        return (
            <div
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold transition-all ${
                    isActive
                        ? 'border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700'
                        : 'border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 text-slate-600'
                }`}
            >
                {isActive ? <CheckCircle className="h-2 w-2" /> : <XCircle className="h-2 w-2" />}
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        );
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Daftar Toko" />
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
                {/* Hero Header Section */}
                <div className="w-full px-12 py-8">
                    <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="ml-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                                    <Briefcase className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                                        Manajemen Toko
                                    </h1>
                                    <p className="text-lg text-slate-600">Kelola semua toko dari berbagai perusahaan dengan mudah</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('stores.create')}
                            className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl"
                        >
                            <Plus className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
                            <span>Tambah Toko Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-12 py-6">
                    <div className="w-full space-y-6">
                        {/* Advanced Search & Filter Section */}
                        <div className="w-full overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-sm">
                            <div className="space-y-6 p-8">
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Search className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari nama toko, alamat, atau kota..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-cyan-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 py-5 pr-4 pl-14 text-lg transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                {/* Filter Toggle */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 rounded-lg px-5 py-3 text-base text-cyan-600 transition-all duration-200 hover:bg-cyan-50 hover:text-cyan-700"
                                    >
                                        <Filter className="h-5 w-5" />
                                        <span className="font-medium">Filter Lanjutan</span>
                                        <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${showFilters ? 'rotate-90' : ''}`} />
                                    </button>

                                    {(selectedCompany || selectedStatus || searchTerm) && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedCompany('');
                                                setSelectedStatus('');
                                            }}
                                            className="rounded-lg px-4 py-2 text-base text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            Reset Filter
                                        </button>
                                    )}
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div className="grid grid-cols-1 gap-6 border-t border-cyan-100 pt-6 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <label className="text-base font-medium text-slate-700">Perusahaan</label>
                                            <select
                                                value={selectedCompany}
                                                onChange={(e) => setSelectedCompany(e.target.value)}
                                                className="w-full rounded-xl border-2 border-cyan-100 bg-gradient-to-r from-cyan-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                                            >
                                                <option value="">Semua Perusahaan</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id.toString()}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-base font-medium text-slate-700">Status</label>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-full rounded-xl border-2 border-cyan-100 bg-gradient-to-r from-cyan-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                                            >
                                                <option value="">Semua Status</option>
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Tidak Aktif</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-base font-medium text-slate-700">Urutkan</label>
                                            <select
                                                value={`${sortBy}:${sortDirection}`}
                                                onChange={handleSortChange}
                                                className="w-full rounded-xl border-2 border-cyan-100 bg-gradient-to-r from-cyan-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
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
                                )}
                            </div>
                        </div>

                        {/* Store Cards Grid */}
                        {stores.data.length > 0 ? (
                            <div
                                className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                                style={{ minHeight: '900px' }}
                            >
                                {stores.data.map((store) => (
                                    <div
                                        key={store.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-cyan-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-cyan-300 hover:shadow-xl"
                                        style={{ minHeight: '320px' }}
                                    >
                                        {/* Card Header */}
                                        <div className="border-b border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className={`flex h-14 w-14 items-center justify-center rounded-lg shadow-sm ${
                                                            store.status === 'active'
                                                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                                                : 'bg-gradient-to-br from-slate-400 to-slate-600'
                                                        }`}
                                                    >
                                                        <Briefcase className="h-7 w-7 text-white" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-cyan-600">
                                                            {store.name}
                                                        </h3>
                                                        {store.company && (
                                                            <div className="mt-1 flex items-center gap-1">
                                                                <Building2 className="h-4 w-4 text-slate-400" />
                                                                <span className="truncate text-sm font-medium text-slate-600">
                                                                    {store.company.name}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">{getStatusBadge(store.status)}</div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="flex-1 space-y-4 p-6">
                                            {/* Address */}
                                            {store.address && (
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-base font-medium text-slate-700">{store.address}</p>
                                                        {store.city && <p className="mt-1 truncate text-sm text-slate-500">{store.city}</p>}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Created Date */}
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-slate-400" />
                                                <span className="text-sm text-slate-600">{formatDate(store.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="mt-auto p-6 pt-0">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={route('stores.show', store.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 text-base font-semibold text-cyan-700 transition-all duration-200 hover:border-cyan-300 hover:from-cyan-100 hover:to-blue-100"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    Lihat
                                                </Link>
                                                <Link
                                                    href={route('stores.edit', store.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:from-blue-600 hover:to-cyan-700 hover:shadow-md"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(store.id, store.name)}
                                                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Fill empty grid to always show 4x3 (12) cards */}
                                {Array.from({ length: Math.max(0, 12 - stores.data.length) }).map((_, idx) => (
                                    <div key={`empty-${idx}`} className="rounded-2xl border-2 border-cyan-50 bg-slate-50 opacity-0" />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full rounded-2xl border border-cyan-100 bg-white p-16 text-center shadow-sm">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100">
                                    <Briefcase className="h-12 w-12 text-cyan-500" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-slate-800">Tidak ada toko ditemukan</h3>
                                <p className="mb-6 text-slate-600">Belum ada toko yang sesuai dengan kriteria pencarian Anda.</p>
                                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedCompany('');
                                            setSelectedStatus('');
                                        }}
                                        className="rounded-xl bg-slate-100 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200"
                                    >
                                        Reset Filter
                                    </button>
                                    <Link
                                        href={route('stores.create')}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-blue-700"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Tambah Toko Baru
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Pagination */}
                        {stores.links && stores.data.length > 0 && (
                            <div className="w-full rounded-2xl border border-cyan-100 bg-white p-8 shadow-sm">
                                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                    <div className="text-base text-slate-600">
                                        Menampilkan <span className="font-semibold text-slate-800">{stores.from}</span> -
                                        <span className="font-semibold text-slate-800">{stores.to}</span> dari
                                        <span className="font-semibold text-slate-800"> {stores.total}</span> toko
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {stores.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                                                        : link.url
                                                          ? 'bg-slate-100 text-slate-700 hover:scale-105 hover:bg-slate-200'
                                                          : 'cursor-not-allowed bg-slate-50 text-slate-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                preserveScroll
                                                preserveState
                                                // @ts-ignore
                                                disabled={!link.url}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
