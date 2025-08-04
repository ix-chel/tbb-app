// resources/js/Pages/Companies/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

interface CompanyData {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    registration_number?: string;
    contact_person_name?: string;
    contact_person_email?: string;
    contact_person_phone?: string;
}

interface EditProps extends PageProps {
    company: CompanyData;
}

export default function Edit({ auth, company, flash }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '',
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        registration_number: company.registration_number || '',
        contact_person_name: company.contact_person_name || '',
        contact_person_email: company.contact_person_email || '',
        contact_person_phone: company.contact_person_phone || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('companies.update', company.id));
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Edit Company - ${company.name}`} />

            <div className="from-sky-25 to-blue-25 min-h-screen bg-gradient-to-br via-white py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {flash?.message && (
                        <div className="animate-fade-in mb-6">
                            <div className="flex items-center rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{flash.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Form Card */}
                    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-xl">
                        {/* Card Header */}
                        <div className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-5">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                                    <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Edit Company</h3>
                                    <p className="mt-1 text-sm text-gray-600">Update informasi detail perusahaan Anda</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Company Information Section */}
                                <div className="space-y-6">
                                    <div className="border-l-4 border-sky-200 pl-4">
                                        <h4 className="mb-4 text-base font-semibold text-gray-900">Informasi Dasar</h4>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div className="lg:col-span-2">
                                            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Nama Perusahaan <span className="text-red-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    required
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="Masukkan nama perusahaan"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.name && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Email Perusahaan
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="company@example.com"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.email && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Nomor Telepon
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="+62 xxx-xxxx-xxxx"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="registration_number" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Nomor Registrasi
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="registration_number"
                                                    value={data.registration_number}
                                                    onChange={(e) => setData('registration_number', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="Nomor registrasi perusahaan"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.registration_number && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.registration_number}
                                                </p>
                                            )}
                                        </div>

                                        <div className="lg:col-span-2">
                                            <label htmlFor="address" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Alamat Perusahaan
                                            </label>
                                            <div className="relative">
                                                <textarea
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    rows={4}
                                                    className="block w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="Masukkan alamat lengkap perusahaan..."
                                                />
                                                <div className="pointer-events-none absolute top-3 right-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.address && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Person Section */}
                                <div className="space-y-6 border-t border-gray-100 pt-6">
                                    <div className="border-l-4 border-sky-200 pl-4">
                                        <h4 className="mb-1 text-base font-semibold text-gray-900">Contact Person</h4>
                                        <p className="text-sm text-gray-600">Informasi kontak person perusahaan</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                        <div className="lg:col-span-2">
                                            <label htmlFor="contact_person_name" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Nama Contact Person
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="contact_person_name"
                                                    value={data.contact_person_name}
                                                    onChange={(e) => setData('contact_person_name', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="Nama lengkap contact person"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.contact_person_name && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.contact_person_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="contact_person_email" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Email Contact Person
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="contact_person_email"
                                                    value={data.contact_person_email}
                                                    onChange={(e) => setData('contact_person_email', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="contact@example.com"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.contact_person_email && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.contact_person_email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="contact_person_phone" className="mb-2 block text-sm font-semibold text-gray-700">
                                                Telepon Contact Person
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="contact_person_phone"
                                                    value={data.contact_person_phone}
                                                    onChange={(e) => setData('contact_person_phone', e.target.value)}
                                                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3 placeholder-gray-400 shadow-sm transition-all duration-200 hover:border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                                    placeholder="+62 xxx-xxxx-xxxx"
                                                />
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <svg className="h-5 w-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.contact_person_phone && (
                                                <p className="mt-2 flex items-center text-sm text-red-600">
                                                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.contact_person_phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col items-center justify-end space-y-3 border-t border-gray-100 pt-8 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <Link
                                        href={route('companies.index')}
                                        className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
                                    >
                                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex w-full transform items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-sky-600 hover:to-blue-700 hover:shadow-xl focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="mr-3 -ml-1 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Update Company
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
