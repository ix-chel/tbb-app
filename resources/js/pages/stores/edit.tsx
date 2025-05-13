import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // <-- Menggunakan AppLayout

// Definisikan tipe data
interface CompanySimple {
    id: number;
    name: string;
}
interface StoreData {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    company_id: number; // ID company yang terpilih
    company: CompanySimple; // Data company relasi
}
interface EditProps {
    auth: any;
    store: StoreData; // Data store yang akan diedit
    companies: CompanySimple[]; // Daftar semua company
    flash: { message?: string };
}

export default function Edit({ auth, store, companies, flash }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name || '',
        address: store.address || '',
        phone: store.phone || '',
        company_id: String(store.company_id) || '', // Pastikan string untuk value select
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('stores.update', store.id)); // Method PUT ke route update
    };

    return (
         <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Store</h2>}
        >
            <Head title={`Edit Store - ${store.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">

                            {flash?.message && (
                                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                                    {flash.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                               {/* Store Name */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Store Name</label>
                                    <input
                                        type="text" id="name" value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Company Selection */}
                                <div className="mb-4">
                                    <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">Company</label>
                                    <select
                                        id="company_id" value={data.company_id}
                                        onChange={(e) => setData('company_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                                </div>

                                {/* Address */}
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        id="address" rows={3} value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text" id="phone" value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center justify-end mt-6">
                                    <Link
                                        href={route('stores.index')}
                                        className="mr-4 inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Update Store'}
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