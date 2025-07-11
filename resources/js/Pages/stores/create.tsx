import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// Definisikan tipe data
interface CompanySimple {
    id: number;
    name: string;
}
interface CreateProps {
    auth: any;
    companies: CompanySimple[];
    initial_company_id?: string | number;
}

export default function Create({ auth, companies, initial_company_id }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        phone: '',
        company_id: initial_company_id ? String(initial_company_id) : '', // Pastikan string untuk value select
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('stores.store'), {
            onSuccess: () => reset(), // Reset form jika sukses
        });
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Create New Store</h2>}>
            <Head title="Create Store" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    {' '}
                    {/* Max width lebih kecil untuk form */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                {/* Store Name */}
                                <div className="mb-4">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Store Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>
                                {/* PIC Name : perlu adjustment ke backend or db */}
                                <div className="mb-4">
                                    <label htmlFor="" className="block text-sm font-medium text-gray-700">
                                        PIC Name
                                    </label>
                                    <input
                                        type="text"
                                        id=""
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                </div>

                                {/* Company Selection */}
                                <div className="mb-4">
                                    <label htmlFor="company_id" className="block text-sm font-medium text-gray-700">
                                        Company
                                    </label>
                                    <select
                                        id="company_id"
                                        value={data.company_id}
                                        onChange={(e) => setData('company_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                                </div>

                                {/* Address */}
                                <div className="mb-4">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <textarea
                                        id="address"
                                        rows={3}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>

                                {/* Buttons */}
                                <div className="mt-6 flex items-center justify-end">
                                    <Link
                                        href={route('stores.index')}
                                        className="mr-4 inline-flex items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-xs font-semibold tracking-widest text-gray-700 uppercase hover:bg-gray-300"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase hover:bg-blue-700 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Store'}
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
