// resources/js/Pages/Companies/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Save } from 'lucide-react';
import React from 'react';

interface CreateProps extends PageProps {}

const breadcrumbs = [
    {
        title: 'Perusahaan',
        href: '/companies',
    },
    {
        title: 'Tambah Perusahaan',
        href: '/companies/create',
    },
];

export default function Create({ auth }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        registration_number: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone: '',
        redirect_to_store: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('companies.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Tambah Perusahaan" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Main Card */}
                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-8 py-6 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/50">
                                        <Building2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tambah Perusahaan Baru</h1>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            Lengkapi informasi perusahaan yang akan didaftarkan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="px-8 py-8">
                                {/* Informasi Perusahaan */}
                                <div className="mb-10">
                                    <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Informasi Perusahaan</h2>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Nama Perusahaan */}
                                        <div className="lg:col-span-2">
                                            <label htmlFor="name" className="mb-3 block text-base font-semibold text-gray-900 dark:text-white">
                                                Nama Perusahaan *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="Masukkan nama perusahaan"
                                            />
                                            {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="mb-3 block text-base font-semibold text-gray-900 dark:text-white">
                                                Email Perusahaan
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="email@perusahaan.com"
                                            />
                                            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                                        </div>

                                        {/* Nomor Telepon */}
                                        <div>
                                            <label htmlFor="phone" className="mb-3 block text-base font-semibold text-gray-900 dark:text-white">
                                                Nomor Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="+62 xxx-xxxx-xxxx"
                                            />
                                            {errors.phone && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
                                        </div>

                                        {/* Nomor Registrasi */}
                                        <div>
                                            <label
                                                htmlFor="registration_number"
                                                className="mb-3 block text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                Nomor Registrasi
                                            </label>
                                            <input
                                                type="text"
                                                id="registration_number"
                                                value={data.registration_number}
                                                onChange={(e) => setData('registration_number', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="Nomor registrasi perusahaan"
                                            />
                                            {errors.registration_number && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.registration_number}</p>
                                            )}
                                        </div>

                                        {/* Alamat */}
                                        <div className="lg:col-span-2">
                                            <label htmlFor="address" className="mb-3 block text-base font-semibold text-gray-900 dark:text-white">
                                                Alamat Perusahaan
                                            </label>
                                            <textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                rows={4}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="Masukkan alamat lengkap perusahaan"
                                            />
                                            {errors.address && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Contact Person */}
                                <div className="mb-10">
                                    <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Informasi Contact Person</h2>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Nama Contact Person */}
                                        <div>
                                            <label
                                                htmlFor="contact_person_name"
                                                className="mb-3 block text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                Nama Contact Person
                                            </label>
                                            <input
                                                type="text"
                                                id="contact_person_name"
                                                value={data.contact_person_name}
                                                onChange={(e) => setData('contact_person_name', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="Nama lengkap contact person"
                                            />
                                            {errors.contact_person_name && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contact_person_name}</p>
                                            )}
                                        </div>

                                        {/* Telepon Contact Person */}
                                        <div>
                                            <label
                                                htmlFor="contact_person_phone"
                                                className="mb-3 block text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                Telepon Contact Person
                                            </label>
                                            <input
                                                type="tel"
                                                id="contact_person_phone"
                                                value={data.contact_person_phone}
                                                onChange={(e) => setData('contact_person_phone', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="+62 xxx-xxxx-xxxx"
                                            />
                                            {errors.contact_person_phone && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contact_person_phone}</p>
                                            )}
                                        </div>

                                        {/* Email Contact Person */}
                                        <div className="lg:col-span-2">
                                            <label
                                                htmlFor="contact_person_email"
                                                className="mb-3 block text-base font-semibold text-gray-900 dark:text-white"
                                            >
                                                Email Contact Person
                                            </label>
                                            <input
                                                type="email"
                                                id="contact_person_email"
                                                value={data.contact_person_email}
                                                onChange={(e) => setData('contact_person_email', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:bg-gray-600 dark:focus:ring-sky-400"
                                                placeholder="email@contactperson.com"
                                            />
                                            {errors.contact_person_email && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.contact_person_email}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-8 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:focus:ring-gray-400"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:shadow-sky-500/30 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing ? 'Menyimpan...' : 'Simpan Perusahaan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
