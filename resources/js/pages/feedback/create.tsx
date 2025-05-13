import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'// Sesuaikan path
import { PageProps, Store, OptionType, FeedbackType } from '@/types'; // Sesuaikan path

interface CreateProps extends PageProps {
    stores: Store[];
    feedbackTypes: OptionType[]; // Dari controller
}

export default function Create({ auth, stores, feedbackTypes }: CreateProps) {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors, reset } = useForm<{
        store_id: string | number; // Form value bisa string
        type: FeedbackType | '';
        rating: number | null;
        comment: string;
        title: string; // Jika ada title
        maintenance_schedule_id: string | number; // Jika ada
    }>({
        store_id: '',
        type: '',
        rating: null,
        comment: '',
        title: '', // Default title
        maintenance_schedule_id: '', // Default
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        // { title: 'Feedback', href: route('feedback.index') }, // Jika admin
        { title: 'Beri Feedback', href: route('feedback.create') },
    ];

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('feedback.store'), {
            onSuccess: () => reset(), // Reset form setelah sukses
        });
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Beri Feedback</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title="Beri Feedback" />

            <div className="py-6 md:py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
                            {flash.success}
                        </div>
                    )}
                     {flash?.message && ( // Jika Anda menggunakan 'message' dari controller
                        <div className="mb-4 p-4 bg-blue-100 text-blue-700 border border-blue-300 rounded">
                            {flash.message}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Jika ada field Title */}
                            {/* <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Judul (Opsional)
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                            </div> */}

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipe Feedback <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value as FeedbackType)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                >
                                    <option value="" disabled>Pilih tipe feedback</option>
                                    {feedbackTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                                {errors.type && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.type}</p>}
                            </div>

                            <div>
                                <label htmlFor="store_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Toko (Opsional)
                                </label>
                                <select
                                    id="store_id"
                                    value={data.store_id}
                                    onChange={e => setData('store_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                >
                                    <option value="">Pilih Toko (Jika Spesifik)</option>
                                    {stores.map(store => (
                                        <option key={store.id} value={store.id}>{store.name}</option>
                                    ))}
                                </select>
                                {errors.store_id && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.store_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rating (1-5, Opsional)
                                </label>
                                <div className="mt-1 flex space-x-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', data.rating === star ? null : star)}
                                            className={`p-2 rounded-md text-2xl ${
                                                (data.rating || 0) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
                                            } hover:text-yellow-400`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.rating}</p>}
                            </div>

                            <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Komentar <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="comment"
                                    value={data.comment}
                                    onChange={e => setData('comment', e.target.value)}
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    required
                                />
                                {errors.comment && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.comment}</p>}
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <Link
                                    href={route('dashboard')} // Atau halaman sebelumnya
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}