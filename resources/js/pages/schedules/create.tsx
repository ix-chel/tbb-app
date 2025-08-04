// resources/js/Pages/Schedules/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps, User, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Clock, FileText, Save, User as UserIcon, X } from 'lucide-react';
import React from 'react';

// Definisikan tipe data spesifik
interface StoreSimple {
    id: number;
    name: string;
}

interface CreateProps extends PageProps {
    stores: StoreSimple[];
    technicians: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal',
        href: route('schedules.index'),
    },
    {
        title: 'Tambah Jadwal',
        href: route('schedules.create'),
    },
];

export default function Create({ auth, stores, technicians }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        store_id: '',
        user_id: '',
        scheduled_at: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('schedules.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Tambah Jadwal Baru" />

            {/* Background with subtle gradient */}
            <div className="min-h-screen bg-gradient-to-br from-sky-50/30 via-white to-blue-50/30">
                <div className="w-full px-0 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="mb-6 flex items-center gap-4">
                            <Link
                                href={route('schedules.index')}
                                className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-sky-200 bg-white text-sky-600 shadow-sm transition-all duration-200 hover:border-sky-300 hover:bg-sky-50"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Main Form Container */}
                    <div className="mx-12">
                        <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-lg">
                            {/* Form Header */}
                            <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-12 py-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                                        <Calendar className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-slate-900">Buat Jadwal Baru</h1>
                                        <p className="mt-2 text-lg text-slate-600">Tambahkan jadwal perawatan dan pemeliharaan untuk toko</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-12">
                                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                    {/* Left Column */}
                                    <div className="space-y-8">
                                        {/* Store Selection */}
                                        <div className="space-y-4">
                                            <label htmlFor="store_id" className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                                                <Building2 className="h-6 w-6 text-sky-500" />
                                                Pilih Toko
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="store_id"
                                                    name="store_id"
                                                    value={data.store_id}
                                                    onChange={(e) => setData('store_id', e.target.value)}
                                                    className={`w-full rounded-xl border-2 bg-white px-6 py-6 text-lg transition-all duration-200 focus:ring-4 focus:ring-sky-500/20 focus:outline-none ${
                                                        errors.store_id
                                                            ? 'border-red-300 focus:border-red-500'
                                                            : 'border-sky-200 hover:border-sky-300 focus:border-sky-500'
                                                    }`}
                                                >
                                                    <option value="" className="text-slate-500">
                                                        Pilih toko yang akan dijadwalkan
                                                    </option>
                                                    {stores.map((store) => (
                                                        <option key={store.id} value={store.id} className="text-slate-900">
                                                            {store.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.store_id && (
                                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                                                    <X className="h-5 w-5" />
                                                    {errors.store_id}
                                                </div>
                                            )}
                                        </div>

                                        {/* Technician Selection */}
                                        <div className="space-y-4">
                                            <label htmlFor="user_id" className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                                                <UserIcon className="h-6 w-6 text-sky-500" />
                                                Pilih Teknisi
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <select
                                                    id="user_id"
                                                    name="user_id"
                                                    value={data.user_id}
                                                    onChange={(e) => setData('user_id', e.target.value)}
                                                    className={`w-full rounded-xl border-2 bg-white px-6 py-6 text-lg transition-all duration-200 focus:ring-4 focus:ring-sky-500/20 focus:outline-none ${
                                                        errors.user_id
                                                            ? 'border-red-300 focus:border-red-500'
                                                            : 'border-sky-200 hover:border-sky-300 focus:border-sky-500'
                                                    }`}
                                                >
                                                    <option value="" className="text-slate-500">
                                                        Pilih teknisi yang bertugas
                                                    </option>
                                                    {technicians.map((tech) => (
                                                        <option key={tech.id} value={tech.id} className="text-slate-900">
                                                            {tech.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.user_id && (
                                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                                                    <X className="h-5 w-5" />
                                                    {errors.user_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-8">
                                        {/* Scheduled Date & Time */}
                                        <div className="space-y-4">
                                            <label htmlFor="scheduled_at" className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                                                <Clock className="h-6 w-6 text-sky-500" />
                                                Tanggal & Waktu
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="datetime-local"
                                                    id="scheduled_at"
                                                    name="scheduled_at"
                                                    value={data.scheduled_at}
                                                    onChange={(e) => setData('scheduled_at', e.target.value)}
                                                    className={`w-full rounded-xl border-2 bg-white px-6 py-6 text-lg transition-all duration-200 focus:ring-4 focus:ring-sky-500/20 focus:outline-none ${
                                                        errors.scheduled_at
                                                            ? 'border-red-300 focus:border-red-500'
                                                            : 'border-sky-200 hover:border-sky-300 focus:border-sky-500'
                                                    }`}
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                                    <Clock className="h-6 w-6 text-sky-400" />
                                                </div>
                                            </div>
                                            {errors.scheduled_at && (
                                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                                                    <X className="h-5 w-5" />
                                                    {errors.scheduled_at}
                                                </div>
                                            )}
                                            <p className="flex items-center gap-2 text-base text-slate-500">
                                                <CheckCircle className="h-5 w-5" />
                                                Pilih tanggal dan waktu yang tepat untuk jadwal
                                            </p>
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-4">
                                            <label htmlFor="notes" className="flex items-center gap-3 text-xl font-semibold text-slate-700">
                                                <FileText className="h-6 w-6 text-sky-500" />
                                                Catatan
                                                <span className="text-lg font-normal text-slate-400">(Opsional)</span>
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    rows={6}
                                                    placeholder="Tambahkan catatan khusus untuk jadwal ini..."
                                                    className={`w-full resize-none rounded-xl border-2 bg-white px-6 py-6 text-lg transition-all duration-200 focus:ring-4 focus:ring-sky-500/20 focus:outline-none ${
                                                        errors.notes
                                                            ? 'border-red-300 focus:border-red-500'
                                                            : 'border-sky-200 hover:border-sky-300 focus:border-sky-500'
                                                    }`}
                                                />
                                            </div>
                                            {errors.notes && (
                                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-base text-red-600">
                                                    <X className="h-5 w-5" />
                                                    {errors.notes}
                                                </div>
                                            )}
                                            <p className="text-base text-slate-500">
                                                Berikan detail tambahan yang perlu diperhatikan saat jadwal dilaksanakan
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="mt-12 border-t border-sky-100 pt-10">
                                    <div className="flex flex-col justify-end gap-6 sm:flex-row">
                                        <Link
                                            href={route('schedules.index')}
                                            className="flex items-center justify-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-10 py-5 text-lg font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
                                        >
                                            <X className="h-6 w-6" />
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`flex transform items-center justify-center gap-3 rounded-xl px-10 py-5 text-lg font-semibold text-white transition-all duration-200 ${
                                                processing
                                                    ? 'cursor-not-allowed bg-slate-400'
                                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-lg hover:scale-105 hover:from-sky-600 hover:to-blue-700 hover:shadow-xl'
                                            }`}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-6 w-6" />
                                                    Simpan Jadwal
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
