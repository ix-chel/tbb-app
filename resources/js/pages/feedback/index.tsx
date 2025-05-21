import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Sesuaikan path jika berbeda
import { PageProps, FeedbackData, PaginatedData, OptionType } from '@/types'; // Sesuaikan path
import { pickBy } from 'lodash'; // Anda mungkin perlu menginstal lodash: npm install lodash @types/lodash
import { useAppearance } from '@/hooks/use-appearance';

// Placeholder untuk ikon, ganti dengan library ikon Anda
const EditIcon = () => <span className="text-blue-500 hover:text-blue-700">✏️</span>;
const DeleteIcon = () => <span className="text-red-500 hover:text-red-700">🗑️</span>;
const ViewIcon = () => <span className="text-green-500 hover:text-green-700">👁️</span>;

interface IndexProps extends PageProps {
    feedbackItems: PaginatedData<FeedbackData>;
    filters: Record<string, string>;
    feedbackTypes: OptionType[];
    feedbackStatuses: OptionType[];
}

export default function Index({ auth, feedbackItems, filters: initialFilters, feedbackTypes, feedbackStatuses }: IndexProps) {
    const { flash } = usePage<PageProps>().props;
    const { appearance } = useAppearance();
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
        // Debounce filter changes
        const handler = setTimeout(() => {
            const query = pickBy(filters); // Hanya kirim filter yang ada isinya
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
        setFilters(prevFilters => ({
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
                    // Bisa tambahkan notifikasi sukses jika flash message tidak cukup
                },
            });
        }
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Daftar Feedback</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Daftar Feedback" />

            <div className="py-6 md:py-12 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 border border-green-300 dark:border-green-700 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 border border-red-300 dark:border-red-700 rounded">
                            {flash.error}
                        </div>
                    )}
                    {flash?.message && (
                        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 border border-blue-300 dark:border-blue-700 rounded">
                            {flash.message}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                            {/* Filter Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                <input
                                    type="text"
                                    id="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Cari feedback..."
                                    className="form-input w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                />
                                <select
                                    id="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="form-select w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">Semua Tipe</option>
                                    {feedbackTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                                <select
                                    id="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="form-select w-full rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                >
                                    <option value="">Semua Status</option>
                                    {feedbackStatuses.map(status => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                                >
                                    Reset Filter
                                </button>
                            </div>
                            {/* Tombol Tambah hanya jika admin/user yang berhak */}
                            {/* <Link
                                href={route('feedback.create')}
                                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Beri Feedback
                            </Link> */}
                        </div>

                        {/* Tabel Feedback */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pengguna</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Komentar</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipe</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Toko</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {feedbackItems.data.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                                Tidak ada feedback ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                    {feedbackItems.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.user?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                {item.comment}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.type.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.status === 'new' || item.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100' :
                                                    item.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100' :
                                                    item.status === 'resolved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100' :
                                                    item.status === 'closed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' : ''
                                                }`}>
                                                    {item.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{item.store?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <Link href={route('feedback.show', item.id)} title="Lihat Detail" className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                                                    <ViewIcon />
                                                </Link>
                                                {/* Asumsi hanya admin atau pemilik yang bisa edit/delete */}
                                                {/* Anda perlu menambahkan logic otorisasi di sini jika perlu di frontend, meski backend sudah meng-handle */}
                                                <Link href={route('feedback.edit', item.id)} title="Edit Feedback" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                                    <EditIcon />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} title="Hapus Feedback" className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginasi */}
                        <div className="mt-6">
                            {feedbackItems.links.length > 3 && (
                                <div className="flex flex-wrap -mb-1">
                                    {feedbackItems.links.map((link, index) => (
                                        link.url === null ? (
                                            <div
                                                key={index}
                                                className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 dark:text-gray-600 border rounded"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <Link
                                                key={index}
                                                className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white dark:hover:bg-gray-700 focus:border-indigo-500 focus:text-indigo-500 dark:focus:border-indigo-700 dark:focus:text-indigo-300 ${
                                                    link.active ? 'bg-blue-500 text-white dark:bg-blue-600' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'
                                                }`}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                preserveScroll
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}