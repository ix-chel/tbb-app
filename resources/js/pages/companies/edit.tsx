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
        <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit Company</h2>}>
            <Head title={`Edit Company - ${company.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {flash?.message && (
                                <div className="mb-4 rounded border border-green-400 bg-green-100 p-4 text-green-700">{flash.message}</div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Perusahaan *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan nama perusahaan"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan email perusahaan"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
                                        Alamat
                                    </label>
                                    <textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan alamat perusahaan"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                <div>
                                    <label htmlFor="registration_number" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nomor Registrasi
                                    </label>
                                    <input
                                        type="text"
                                        id="registration_number"
                                        value={data.registration_number}
                                        onChange={(e) => setData('registration_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan nomor registrasi"
                                    />
                                    {errors.registration_number && <p className="mt-1 text-sm text-red-600">{errors.registration_number}</p>}
                                </div>

                                <div>
                                    <label htmlFor="contact_person_name" className="mb-2 block text-sm font-medium text-gray-700">
                                        Nama Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        id="contact_person_name"
                                        value={data.contact_person_name}
                                        onChange={(e) => setData('contact_person_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan nama contact person"
                                    />
                                    {errors.contact_person_name && <p className="mt-1 text-sm text-red-600">{errors.contact_person_name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="contact_person_email" className="mb-2 block text-sm font-medium text-gray-700">
                                        Email Contact Person
                                    </label>
                                    <input
                                        type="email"
                                        id="contact_person_email"
                                        value={data.contact_person_email}
                                        onChange={(e) => setData('contact_person_email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan email contact person"
                                    />
                                    {errors.contact_person_email && <p className="mt-1 text-sm text-red-600">{errors.contact_person_email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="contact_person_phone" className="mb-2 block text-sm font-medium text-gray-700">
                                        Telepon Contact Person
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact_person_phone"
                                        value={data.contact_person_phone}
                                        onChange={(e) => setData('contact_person_phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                                        placeholder="Masukkan telepon contact person"
                                    />
                                    {errors.contact_person_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_person_phone}</p>}
                                </div>

                                <div className="flex items-center justify-end space-x-4 pt-6">
                                    <Link
                                        href={route('companies.index')}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Menyimpan...' : 'Update Company'}
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
