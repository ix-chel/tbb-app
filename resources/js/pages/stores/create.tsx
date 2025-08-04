import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Store } from 'lucide-react';
import React from 'react';

interface CompanySimple {
    id: number;
    name: string;
}
interface CreateProps {
    auth: any;
    companies: CompanySimple[];
    initial_company_id?: string | number;
}

const breadcrumbs = [
    {
        title: 'Toko',
        href: '/stores',
    },
    {
        title: 'Tambah Toko',
        href: '/stores/create',
    },
];

export default function Create({ auth, companies, initial_company_id }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        phone: '',
        company_id: initial_company_id ? String(initial_company_id) : '',
        contact_person: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('stores.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Tambah Toko" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
                <div className="mx-auto w-full max-w-none px-0 py-8 sm:px-0 lg:px-0">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Main Card */}
                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-12 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100">
                                        <Store className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Tambah Toko Baru</h1>
                                        <p className="mt-1 text-sm text-gray-600">Lengkapi informasi toko yang akan didaftarkan</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="px-12 py-12">
                                {/* Informasi Toko */}
                                <div className="mb-10">
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Nama Toko */}
                                        <div className="col-span-2">
                                            <label htmlFor="name" className="mb-3 block text-base font-semibold text-gray-900">
                                                Nama Toko *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Masukkan nama toko"
                                            />
                                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        {/* PIC Name */}
                                        <div>
                                            <label htmlFor="contact_person" className="mb-3 block text-base font-semibold text-gray-900">
                                                Nama PIC
                                            </label>
                                            <input
                                                type="text"
                                                id="contact_person"
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Nama lengkap PIC"
                                            />
                                            {errors.contact_person && <p className="mt-2 text-sm text-red-600">{errors.contact_person}</p>}
                                        </div>

                                        {/* Nomor Telepon */}
                                        <div>
                                            <label htmlFor="phone" className="mb-3 block text-base font-semibold text-gray-900">
                                                Nomor Telepon
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                                                placeholder="+62 xxx-xxxx-xxxx"
                                            />
                                            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
                                        </div>

                                        {/* Perusahaan */}
                                        <div className="col-span-2">
                                            <label htmlFor="company_id" className="mb-3 block text-base font-semibold text-gray-900">
                                                Perusahaan
                                            </label>
                                            <select
                                                id="company_id"
                                                value={data.company_id}
                                                onChange={(e) => setData('company_id', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                                            >
                                                <option value="">Pilih Perusahaan</option>
                                                {companies.map((company) => (
                                                    <option key={company.id} value={company.id}>
                                                        {company.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.company_id && <p className="mt-2 text-sm text-red-600">{errors.company_id}</p>}
                                        </div>

                                        {/* Alamat */}
                                        <div className="col-span-2">
                                            <label htmlFor="address" className="mb-3 block text-base font-semibold text-gray-900">
                                                Alamat Toko
                                            </label>
                                            <textarea
                                                id="address"
                                                rows={4}
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500"
                                                placeholder="Masukkan alamat lengkap toko"
                                            />
                                            {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-8">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl hover:shadow-cyan-500/30 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing ? 'Menyimpan...' : 'Simpan Toko'}
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
