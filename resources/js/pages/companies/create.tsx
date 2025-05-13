// resources/js/Pages/Companies/Create.tsx
import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';

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
        name: '', email: '', phone: '', address: '',
        registration_number: '', contact_person_name: '',
        contact_person_email: '', contact_person_phone: '',
        redirect_to_store: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('companies.store'));
    };

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            user={auth.user}
            header={<h2 className="font-semibold text-xl">Tambah Perusahaan</h2>}
        >
            <Head title="Tambah Perusahaan" />
             <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white shadow-sm rounded-lg p-6">
                            <div className="grid grid-cols-1 gap-6">
                                {/* Nama Perusahaan */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Nama Perusahaan
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                {/* Nomor Telepon */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Alamat
                                    </label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>

                                {/* Contact Person Name */}
                                <div>
                                    <label htmlFor="contact_person_name" className="block text-sm font-medium text-gray-700">
                                        Nama Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        id="contact_person_name"
                                        value={data.contact_person_name}
                                        onChange={e => setData('contact_person_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.contact_person_name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_person_name}</p>
                                    )}
                                </div>

                                {/* Contact Person Email */}
                                <div>
                                    <label htmlFor="contact_person_email" className="block text-sm font-medium text-gray-700">
                                        Email Contact Person
                                    </label>
                                    <input
                                        type="email"
                                        id="contact_person_email"
                                        value={data.contact_person_email}
                                        onChange={e => setData('contact_person_email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.contact_person_email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_person_email}</p>
                                    )}
                                </div>

                                {/* Contact Person Phone */}
                                <div>
                                    <label htmlFor="contact_person_phone" className="block text-sm font-medium text-gray-700">
                                        Telepon Contact Person
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact_person_phone"
                                        value={data.contact_person_phone}
                                        onChange={e => setData('contact_person_phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.contact_person_phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_person_phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
             </div>
        </AppLayout>
    );
}