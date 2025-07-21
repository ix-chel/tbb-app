// resources/js/Pages/Schedules/Index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { Link, usePage, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Menggunakan AppLayout
import { PaginatedData, PageProps, User } from '@/types'; // Import tipe
import { Calendar, Search, Filter, Plus, Clock, CheckCircle2, AlertCircle, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { debounce } from 'lodash'; // Anda mungkin perlu menginstal lodash: npm install lodash @types/lodash
import { useAppearance } from '@/hooks/use-appearance';

// Definisikan tipe data spesifik (sesuaikan)
interface StoreSimple { id: number; name: string; }
interface ScheduleData {
    id: number;
    store: {
        name: string;
    };
    scheduled_at: string;
    status: 'pending' | 'completed' | 'cancelled';
    notes: string | null;
    // Tambahkan properti lain jika ada, misal technician
    technician?: {
        name: string;
    };
}

// Definisikan Props menggunakan tipe generik dan PageProps
interface IndexProps extends PageProps { // Extend PageProps
    schedules: PaginatedData<ScheduleData>; // Gunakan PaginatedData
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
    technicians: User[]; // Gunakan tipe User
    statuses: { value: string; label: string; }[]; // Ubah menjadi array objek untuk kemudahan di select
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal',
        href: route('schedules.index'), // Pastikan rute ini ada
    },
];

export default function Index({ auth, schedules, filters, stores, technicians, statuses: statusOptions, flash }: IndexProps) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // State untuk filter dan pencarian
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedStore, setSelectedStore] = useState(filters.store_id || '');
    const [selectedTechnician, setSelectedTechnician] = useState(filters.technician_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'scheduled_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

    // Fungsi untuk mengirim parameter filter ke backend
    const applyFilters = useCallback(
        debounce((params: Record<string, string | undefined>) => {
            router.get(route('schedules.index'), params, {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            });
        }, 300), // Debounce 300ms
    []);

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
        // Hapus parameter undefined agar URL lebih bersih
        Object.keys(currentParams).forEach(key => {
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
                    // Tambahkan notifikasi jika perlu
                    if (flash && flash.message) {
                        // Tampilkan flash message (asumsi Anda punya komponen Notifikasi)
                        // Misalnya: showNotification(flash.message, 'success');
                    }
                }
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
            setSortBy('scheduled_at'); // Default sort
            setSortDirection('desc');
        }
    };

    // Helper untuk format tanggal
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
        } catch (e) {
            return "Tanggal tidak valid";
        }
    };

    const formatTime = (dateString: string) => {
         try {
            return new Date(dateString).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) {
            return "Waktu tidak valid";
        }
    };


    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}> {/* Pastikan user prop dikirim ke AppLayout jika diperlukan */}
            <Head title="Jadwal" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                   <div>
                    <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daftar Jadwal</h1>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Kelola jadwal perawatan dan pemeliharaan</p>
                   </div>
                    <Link
                        href={route('schedules.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-150"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Jadwal</span>
                    </Link>
                </div>

                {/* Filter dan Pencarian */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama toko, catatan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    isDark 
                                        ? 'bg-card text-card-foreground border-border' 
                                        : 'bg-white text-gray-900 border-gray-200'
                                }`}
                            />
                        </div>
                         <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                        <select
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                        >
                            <option value="">Semua Toko</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id.toString()}>{store.name}</option>
                            ))}
                        </select>
                         <select
                            value={selectedTechnician}
                            onChange={(e) => setSelectedTechnician(e.target.value)}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                        >
                            <option value="">Semua Teknisi</option>
                            {technicians.map(tech => (
                                <option key={tech.id} value={tech.id.toString()}>{tech.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                         <div className="flex flex-col gap-1">
                            <label htmlFor="date_from" className="text-sm font-medium text-gray-700 dark:text-gray-300">Dari Tanggal</label>
                            <input
                                type="date"
                                id="date_from"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    isDark 
                                        ? 'bg-card text-card-foreground border-border' 
                                        : 'bg-white text-gray-900 border-gray-200'
                                }`}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label htmlFor="date_to" className="text-sm font-medium text-gray-700 dark:text-gray-300">Sampai Tanggal</label>
                            <input
                                type="date"
                                id="date_to"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    isDark 
                                        ? 'bg-card text-card-foreground border-border' 
                                        : 'bg-white text-gray-900 border-gray-200'
                                }`}
                            />
                        </div>
                        <select
                            value={`${sortBy}:${sortDirection}`}
                            onChange={handleSortChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                        >
                            <option value="scheduled_at:desc">Tanggal Terdekat</option>
                            <option value="scheduled_at:asc">Tanggal Terjauh</option>
                            <option value="status:asc">Status (A-Z)</option>
                            <option value="status:desc">Status (Z-A)</option>
                            <option value="store.name:asc">Toko (A-Z)</option> {/* Pastikan backend mendukung sort by store.name */}
                            <option value="store.name:desc">Toko (Z-A)</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Jadwal */}
                {schedules.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schedules.data.map((schedule) => (
                            <div
                                key={schedule.id}
                                className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                                    isDark 
                                        ? 'bg-card text-card-foreground border-border' 
                                        : 'bg-white text-gray-900 border-gray-200'
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        isDark ? 'bg-primary/20' : 'bg-blue-100'
                                    }`}>
                                        <Calendar className={`w-6 h-6 ${isDark ? 'text-primary' : 'text-blue-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                <Link href={route('schedules.show', schedule.id)}>
                                                    {schedule.store.name}
                                                </Link>
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                schedule.status === 'cancelled'
                                                    ? isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
                                                    : schedule.status === 'completed'
                                                        ? isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
                                                        : isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {formatDate(schedule.scheduled_at)} {formatTime(schedule.scheduled_at)}
                                                </span>
                                            </div>
                                            {schedule.technician && (
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        Teknisi: {schedule.technician.name}
                                                    </span>
                                                </div>
                                            )}
                                            {schedule.notes && (
                                                <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                                    <AlertCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                    <p className="italic line-clamp-2">{schedule.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-4 gap-2">
                                    <Link
                                        href={route('schedules.edit', schedule.id)}
                                        className={`text-sm font-medium ${
                                            isDark ? 'text-primary hover:text-primary/90' : 'text-blue-600 hover:text-blue-700'
                                        }`}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(schedule.id)}
                                        className={`text-sm font-medium ${
                                            isDark ? 'text-destructive hover:text-destructive/90' : 'text-red-600 hover:text-red-700'
                                        }`}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Calendar className={`w-16 h-16 ${isDark ? 'text-gray-400' : 'text-gray-500'} mx-auto mb-4`} />
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tidak ada jadwal yang ditemukan.</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Coba ubah filter atau kata kunci pencarian Anda.</p>
                    </div>
                )}


                {/* Pagination */}
                {schedules.links && schedules.data.length > 0 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        {schedules.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-4 py-2 border rounded-lg transition duration-150
                                    ${link.active ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700' : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
                                    ${!link.url ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : ''}
                                `}
                                dangerouslySetInnerHTML={{ __html: link.label }} // Untuk render Previous & Next HTML entities
                                preserveScroll
                                preserveState
                                disabled={!link.url} // Non-aktifkan jika URL tidak ada
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}