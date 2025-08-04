// resources/js/Pages/Schedules/Index.tsx
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { PageProps, PaginatedData, User, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import {
    AlertCircle,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Edit,
    Filter,
    Plus,
    Search,
    Trash2,
    User as UserIcon,
    XCircle,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

// Definisikan tipe data spesifik (sesuaikan)
interface StoreSimple {
    id: number;
    name: string;
}
interface ScheduleData {
    id: number;
    store: {
        name: string;
    };
    scheduled_at: string;
    status: 'pending' | 'completed' | 'cancelled';
    notes: string | null;
    technician?: {
        name: string;
    };
}

// Definisikan Props menggunakan tipe generik dan PageProps
interface IndexProps extends PageProps {
    schedules: PaginatedData<ScheduleData>;
    filters: {
        search?: string;
        status?: string;
        store_id?: string;
        technician_id?: string;
        date_from?: string;
        date_to?: string;
        sort_by?: string;
        sort_direction?: string;
    };
    stores: StoreSimple[];
    technicians: User[];
    statuses: { value: string; label: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal',
        href: route('schedules.index'),
    },
];

export default function Index({ auth, schedules, filters, stores, technicians, statuses: statusOptions, flash }: IndexProps) {
    const { appearance } = useAppearance();

    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedStore, setSelectedStore] = useState(filters.store_id || '');
    const [selectedTechnician, setSelectedTechnician] = useState(filters.technician_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'scheduled_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');
    const [showFilters, setShowFilters] = useState(false);

    // Fungsi untuk mengirim parameter filter ke backend
    const applyFilters = useCallback(
        debounce((params: Record<string, string | undefined>) => {
            router.get(route('schedules.index'), params, {
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
            status: selectedStatus || undefined,
            store_id: selectedStore || undefined,
            technician_id: selectedTechnician || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            sort_by: sortBy,
            sort_direction: sortDirection,
        };
        Object.keys(currentParams).forEach((key) => {
            if (currentParams[key] === undefined || currentParams[key] === '') {
                delete currentParams[key];
            }
        });
        applyFilters(currentParams);
    }, [searchTerm, selectedStatus, selectedStore, selectedTechnician, dateFrom, dateTo, sortBy, sortDirection, applyFilters]);

    const handleDelete = (scheduleId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            router.delete(route('schedules.destroy', scheduleId), {
                preserveScroll: true,
                onSuccess: () => {
                    if (flash && flash.message) {
                        // Tampilkan flash message jika ada
                    }
                },
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
            setSortBy('scheduled_at');
            setSortDirection('desc');
        }
    };

    // Helper untuk format tanggal
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch (e) {
            return 'Tanggal tidak valid';
        }
    };

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (e) {
            return 'Waktu tidak valid';
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === 'completed') {
            return (
                <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 transition-all">
                    <CheckCircle2 className="h-2 w-2" />
                    Selesai
                </div>
            );
        } else if (status === 'cancelled') {
            return (
                <div className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-gradient-to-r from-red-50 to-red-100 px-2 py-1 text-xs font-semibold text-red-700 transition-all">
                    <XCircle className="h-2 w-2" />
                    Dibatalkan
                </div>
            );
        } else {
            return (
                <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100 px-2 py-1 text-xs font-semibold text-amber-700 transition-all">
                    <Clock className="h-2 w-2" />
                    Menunggu
                </div>
            );
        }
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Jadwal" />
            <div className="min-h-screen bg-gradient-to-br from-sky-50/30 via-white to-blue-50/30">
                {/* Hero Header Section */}
                <div className="w-full px-0 py-8">
                    <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="space-y-2">
                            <div className="flex items-center gap-5">
                                <div className="ml-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                                        Manajemen Jadwal
                                    </h1>
                                    <p className="text-lg text-slate-600">Kelola jadwal perawatan dan pemeliharaan dengan mudah</p>
                                </div>
                            </div>
                        </div>
                        <Link
                            href={route('schedules.create')}
                            className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl"
                        >
                            <Plus className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
                            <span>Tambah Jadwal Baru</span>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full px-0 py-6">
                    <div className="w-full space-y-6">
                        {/* Advanced Search & Filter Section */}
                        <div className="w-full overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
                            <div className="space-y-6 p-8">
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Search className="h-6 w-6 text-sky-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nama toko, catatan, atau teknisi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/50 to-blue-50/50 py-5 pr-4 pl-14 text-lg transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>

                                {/* Filter Toggle */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2 rounded-lg px-5 py-3 text-base text-sky-600 transition-all duration-200 hover:bg-sky-50 hover:text-sky-700"
                                    >
                                        <Filter className="h-5 w-5" />
                                        <span className="font-medium">Filter Lanjutan</span>
                                        <ChevronRight className={`h-5 w-5 transition-transform duration-200 ${showFilters ? 'rotate-90' : ''}`} />
                                    </button>

                                    {(selectedStatus || selectedStore || selectedTechnician || dateFrom || dateTo || searchTerm) && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setSelectedStatus('');
                                                setSelectedStore('');
                                                setSelectedTechnician('');
                                                setDateFrom('');
                                                setDateTo('');
                                            }}
                                            className="rounded-lg px-4 py-2 text-base text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            Reset Filter
                                        </button>
                                    )}
                                </div>

                                {/* Advanced Filters */}
                                {showFilters && (
                                    <div className="space-y-6 border-t border-sky-100 pt-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Status</label>
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                >
                                                    <option value="">Semua Status</option>
                                                    {statusOptions.map((status) => (
                                                        <option key={status.value} value={status.value}>
                                                            {status.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Toko</label>
                                                <select
                                                    value={selectedStore}
                                                    onChange={(e) => setSelectedStore(e.target.value)}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                >
                                                    <option value="">Semua Toko</option>
                                                    {stores.map((store) => (
                                                        <option key={store.id} value={store.id.toString()}>
                                                            {store.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Teknisi</label>
                                                <select
                                                    value={selectedTechnician}
                                                    onChange={(e) => setSelectedTechnician(e.target.value)}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                >
                                                    <option value="">Semua Teknisi</option>
                                                    {technicians.map((tech) => (
                                                        <option key={tech.id} value={tech.id.toString()}>
                                                            {tech.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Urutkan</label>
                                                <select
                                                    value={`${sortBy}:${sortDirection}`}
                                                    onChange={handleSortChange}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                >
                                                    <option value="scheduled_at:desc">Tanggal Terdekat</option>
                                                    <option value="scheduled_at:asc">Tanggal Terjauh</option>
                                                    <option value="status:asc">Status (A-Z)</option>
                                                    <option value="status:desc">Status (Z-A)</option>
                                                    <option value="store.name:asc">Toko (A-Z)</option>
                                                    <option value="store.name:desc">Toko (Z-A)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Dari Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={dateFrom}
                                                    onChange={(e) => setDateFrom(e.target.value)}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-base font-medium text-slate-700">Sampai Tanggal</label>
                                                <input
                                                    type="date"
                                                    value={dateTo}
                                                    onChange={(e) => setDateTo(e.target.value)}
                                                    className="w-full rounded-xl border-2 border-sky-100 bg-gradient-to-r from-sky-50/30 to-blue-50/30 px-5 py-4 text-base transition-all duration-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Schedule Cards Grid */}
                        {schedules.data.length > 0 ? (
                            <div
                                className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
                                style={{ minHeight: '900px' }}
                            >
                                {schedules.data.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-sky-200 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-sky-300 hover:shadow-xl"
                                        style={{ minHeight: '360px' }}
                                    >
                                        {/* Card Header */}
                                        <div className="border-b border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 shadow-sm">
                                                        <Calendar className="h-7 w-7 text-white" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-xl font-bold text-slate-800 transition-colors duration-200 group-hover:text-sky-600">
                                                            <Link href={route('schedules.show', schedule.id)}>{schedule.store.name}</Link>
                                                        </h3>
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Building2 className="h-4 w-4 text-slate-400" />
                                                            <span className="truncate text-sm font-medium text-slate-600">Jadwal Perawatan</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">{getStatusBadge(schedule.status)}</div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="flex-1 space-y-4 p-6">
                                            {/* Schedule Date & Time */}
                                            <div className="flex items-start gap-2">
                                                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-sky-500" />
                                                <div className="min-w-0">
                                                    <p className="truncate text-base font-medium text-slate-700">
                                                        {formatDate(schedule.scheduled_at)}
                                                    </p>
                                                    <p className="mt-1 truncate text-sm text-slate-500">{formatTime(schedule.scheduled_at)}</p>
                                                </div>
                                            </div>

                                            {/* Technician */}
                                            {schedule.technician && (
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="h-5 w-5 text-slate-400" />
                                                    <span className="truncate text-sm text-slate-600">{schedule.technician.name}</span>
                                                </div>
                                            )}

                                            {/* Notes */}
                                            {schedule.notes && (
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                                                    <p className="line-clamp-3 text-sm text-slate-600">{schedule.notes}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Actions */}
                                        <div className="mt-auto p-6 pt-0">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={route('schedules.show', schedule.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-50 px-4 py-3 text-base font-semibold text-sky-700 transition-all duration-200 hover:border-sky-300 hover:from-sky-100 hover:to-blue-100"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    Lihat
                                                </Link>
                                                <Link
                                                    href={route('schedules.edit', schedule.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:from-sky-600 hover:to-blue-700 hover:shadow-md"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(schedule.id)}
                                                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* Fill empty grid to always show consistent layout */}
                                {Array.from({ length: Math.max(0, 12 - schedules.data.length) }).map((_, idx) => (
                                    <div key={`empty-${idx}`} className="rounded-2xl border-2 border-blue-50 bg-slate-50 opacity-0" />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full rounded-2xl border border-sky-100 bg-white p-16 text-center shadow-sm">
                                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100">
                                    <Calendar className="h-12 w-12 text-sky-500" />
                                </div>
                                <h3 className="mb-2 text-2xl font-bold text-slate-800">Tidak ada jadwal ditemukan</h3>
                                <p className="mb-6 text-slate-600">Belum ada jadwal yang sesuai dengan kriteria pencarian Anda.</p>
                                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSelectedStatus('');
                                            setSelectedStore('');
                                            setSelectedTechnician('');
                                            setDateFrom('');
                                            setDateTo('');
                                        }}
                                        className="rounded-xl bg-slate-100 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200"
                                    >
                                        Reset Filter
                                    </button>
                                    <Link
                                        href={route('schedules.create')}
                                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:from-sky-600 hover:to-blue-700"
                                    >
                                        <Plus className="h-5 w-5" />
                                        Tambah Jadwal Baru
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Pagination */}
                        {schedules.links && schedules.data.length > 0 && (
                            <div className="w-full rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
                                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                    <div className="text-base text-slate-600">
                                        Menampilkan <span className="font-semibold text-slate-800">{schedules.from}</span> -
                                        <span className="font-semibold text-slate-800">{schedules.to}</span> dari
                                        <span className="font-semibold text-slate-800"> {schedules.total}</span> jadwal
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {schedules.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                                                    link.active
                                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
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
