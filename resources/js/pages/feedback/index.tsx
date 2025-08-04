import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { FeedbackData, OptionType, PageProps, PaginatedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { pickBy } from 'lodash';
import React, { useEffect, useState } from 'react';

// Modern Icon Components with proper props interface
interface IconProps {
    className?: string;
}

const EditIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
    </svg>
);

const DeleteIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
);

const ViewIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
);

const SearchIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const FilterIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
        />
    </svg>
);

const RefreshIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
    </svg>
);

interface IndexProps extends PageProps {
    feedbackItems: PaginatedData<FeedbackData>;
    filters: Record<string, string>;
    feedbackTypes: OptionType[];
    feedbackStatuses: OptionType[];
}

export default function Index({ auth, feedbackItems, filters: initialFilters, feedbackTypes, feedbackStatuses }: IndexProps) {
    const { flash } = usePage<PageProps>().props;
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        type: initialFilters.type || '',
        status: initialFilters.status || '',
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Feedback', href: route('feedback.index') },
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            const query = pickBy(filters);
            router.get(route('feedback.index'), query, {
                preserveState: true,
                replace: true,
            });
        }, 500);
        return () => clearTimeout(handler);
    }, [filters]);

    function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const key = e.target.id;
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: value,
        }));
    }

    function resetFilters() {
        setFilters({ search: '', type: '', status: '' });
    }

    function handleDelete(feedbackId: number) {
        if (confirm('Apakah Anda yakin ingin menghapus feedback ini?')) {
            router.delete(route('feedback.destroy', feedbackId), {
                preserveScroll: true,
                onSuccess: () => {
                    // Success notification handled by flash message
                },
            });
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'in_progress':
                return 'bg-sky-100 text-sky-800 border-sky-200';
            case 'resolved':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Daftar Feedback" />

            <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50/30" style={{ padding: '0 50px' }}>
                <div className="w-full py-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-8 rounded-r-xl border-l-4 border-emerald-400 bg-emerald-50 p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-emerald-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-8 rounded-r-xl border-l-4 border-red-400 bg-red-50 p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-red-800">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.message && (
                        <div className="mb-8 rounded-r-xl border-l-4 border-sky-400 bg-sky-50 p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-6 w-6 text-sky-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="font-medium text-sky-800">{flash.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content Card */}
                    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-sky-500 to-sky-600 px-8 py-8">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h2 className="mb-2 text-2xl font-bold text-white">Manajemen Feedback</h2>
                                    <p className="text-sky-100">Total {feedbackItems.total} feedback ditemukan</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white">
                                        Halaman {feedbackItems.current_page} dari {feedbackItems.last_page}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="border-b border-sky-100 bg-sky-50/50 px-8 py-8">
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                                {/* Search Input */}
                                <div className="lg:col-span-4">
                                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                                        <SearchIcon className="mr-2 inline h-4 w-4" />
                                        Pencarian
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            id="search"
                                            value={filters.search}
                                            onChange={handleFilterChange}
                                            placeholder="Cari feedback, pengguna, atau komentar..."
                                            className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-lg placeholder-gray-400 transition-colors duration-200 focus:border-sky-500 focus:ring-0"
                                        />
                                        <SearchIcon className="absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    </div>
                                </div>

                                {/* Type Filter */}
                                <div className="lg:col-span-3">
                                    <label className="mb-3 block text-sm font-semibold text-gray-700">
                                        <FilterIcon className="mr-2 inline h-4 w-4" />
                                        Tipe Feedback
                                    </label>
                                    <select
                                        id="type"
                                        value={filters.type}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-lg transition-colors duration-200 focus:border-sky-500 focus:ring-0"
                                    >
                                        <option value="">Semua Tipe</option>
                                        {feedbackTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="lg:col-span-3">
                                    <label className="mb-3 block text-sm font-semibold text-gray-700">Status</label>
                                    <select
                                        id="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                        className="w-full rounded-xl border-2 border-gray-200 px-5 py-4 text-lg transition-colors duration-200 focus:border-sky-500 focus:ring-0"
                                    >
                                        <option value="">Semua Status</option>
                                        {feedbackStatuses.map((status) => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Reset Button */}
                                <div className="flex items-end lg:col-span-2">
                                    <button
                                        onClick={resetFilters}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-sky-200 bg-white px-6 py-4 text-lg font-semibold text-sky-600 transition-all duration-200 hover:border-sky-300 hover:bg-sky-50"
                                    >
                                        <RefreshIcon />
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="overflow-x-auto">
                            {feedbackItems.data.length === 0 ? (
                                <div className="py-20 text-center">
                                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                                        <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">Tidak ada feedback ditemukan</h3>
                                    <p className="text-gray-600">Coba ubah filter pencarian atau tambahkan feedback baru.</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-50/80">
                                        <tr>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Pengguna</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Komentar</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Tipe</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Status</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Toko</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Tanggal</th>
                                            <th className="px-8 py-6 text-left text-sm font-bold tracking-wider text-gray-700 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {feedbackItems.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className={`transition-colors duration-150 hover:bg-sky-50/30 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center">
                                                        <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                                                            <span className="text-lg font-bold text-sky-600">
                                                                {(item.user?.name || 'N').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-semibold text-gray-900">{item.user?.name || 'N/A'}</div>
                                                            <div className="text-sm text-gray-500">{item.user?.email || ''}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="max-w-md">
                                                        <p className="line-clamp-3 text-base leading-relaxed text-gray-900">{item.comment}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-800">
                                                        {item.type.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span
                                                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(item.status)}`}
                                                    >
                                                        {item.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-lg font-medium text-gray-900">{item.store?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-lg text-gray-900">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(item.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <Link
                                                            href={route('feedback.show', item.id)}
                                                            title="Lihat Detail"
                                                            className="rounded-xl bg-emerald-50 p-3 text-emerald-600 transition-all duration-200 hover:bg-emerald-100 hover:text-emerald-700"
                                                        >
                                                            <ViewIcon />
                                                        </Link>
                                                        <Link
                                                            href={route('feedback.edit', item.id)}
                                                            title="Edit Feedback"
                                                            className="rounded-xl bg-sky-50 p-3 text-sky-600 transition-all duration-200 hover:bg-sky-100 hover:text-sky-700"
                                                        >
                                                            <EditIcon />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Hapus Feedback"
                                                            className="rounded-xl bg-red-50 p-3 text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700"
                                                        >
                                                            <DeleteIcon />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {feedbackItems.links.length > 3 && (
                            <div className="border-t border-gray-100 bg-gray-50/50 px-8 py-8">
                                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                    <div className="text-gray-600">
                                        Menampilkan <span className="font-semibold">{feedbackItems.from}</span> -{' '}
                                        <span className="font-semibold">{feedbackItems.to}</span> dari{' '}
                                        <span className="font-semibold">{feedbackItems.total}</span> hasil
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {feedbackItems.links.map((link, index) =>
                                            link.url === null ? (
                                                <div
                                                    key={index}
                                                    className="cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-gray-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <Link
                                                    key={index}
                                                    className={`rounded-xl border px-5 py-3 font-medium transition-all duration-200 ${
                                                        link.active
                                                            ? 'border-sky-500 bg-sky-500 text-white shadow-lg'
                                                            : 'border-gray-200 bg-white text-gray-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600'
                                                    }`}
                                                    href={link.url}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    preserveScroll
                                                />
                                            ),
                                        )}
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
