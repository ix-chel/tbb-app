import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Sesuaikan path
import { PageProps, FeedbackData, OptionType, FeedbackStatus } from '@/types'; // Sesuaikan path

interface EditProps extends PageProps {
    feedback: FeedbackData;
    feedbackStatuses: OptionType[]; // Dari controller
}

export default function Edit({ auth, feedback, feedbackStatuses }: EditProps) {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        admin_response: feedback.admin_response || '',
        status: feedback.status,
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Feedback', href: route('feedback.index') },
        { title: `Edit Feedback #${feedback.id}`, href: route('feedback.edit', feedback.id) },
    ];

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('feedback.update', feedback.id), {
             preserveScroll: true,
        });
    }

    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Feedback #{feedback.id}</h2>}
            breadcrumbs={breadcrumbs}
        >
            <Head title={`Edit Feedback #${feedback.id}`} />

            <div className="py-6 md:py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded">
                            {flash.success}
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                        {/* Detail Feedback (Read-only) */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Detail Feedback</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dari</p>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">{feedback.user?.name || 'N/A'}</p>
                                </div>
                                {feedback.title && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Judul</p>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">{feedback.title}</p>
                                </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Komentar</p>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{feedback.comment}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipe</p>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">{feedback.type.replace('_', ' ')}</p>
                                </div>
                                {feedback.store && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Toko</p>
                                        <p className="mt-1 text-gray-900 dark:text-gray-100">{feedback.store.name}</p>
                                    </div>
                                )}
                                {feedback.rating && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                                        <p className="mt-1 text-yellow-400 text-xl">
                                            {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Dibuat</p>
                                    <p className="mt-1 text-gray-900 dark:text-gray-100">{new Date(feedback.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Edit */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status Feedback <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value as FeedbackStatus)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                >
                                    {feedbackStatuses.map(statusOpt => (
                                        <option key={statusOpt.value} value={statusOpt.value}>{statusOpt.label}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.status}</p>}
                            </div>

                            <div>
                                <label htmlFor="admin_response" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Respon Admin (Opsional)
                                </label>
                                <textarea
                                    id="admin_response"
                                    value={data.admin_response}
                                    onChange={e => setData('admin_response', e.target.value)}
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                />
                                {errors.admin_response && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.admin_response}</p>}
                            </div>

                            <div className="flex items-center justify-end space-x-3">
                                <Link
                                    href={route('feedback.index')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}