// resources/js/Pages/Inventory/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Package, Save } from 'lucide-react';
import React from 'react';

interface CreateProps extends PageProps {
    stores?: Array<{ id: string; name: string }>;
}

const breadcrumbs = [
    {
        title: 'Inventori',
        href: '/inventory',
    },
    {
        title: 'Tambah Item Inventori',
        href: '/inventory/create',
    },
];

export default function Create({ auth, flash, stores }: CreateProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: '',
        store_id: '',
        sku: '',
        description: '',
        quantity: 0,
        unit: '',
        location: '',
        low_stock_threshold: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const transformedData = {
            ...data,
            quantity: parseFloat(String(data.quantity)),
            low_stock_threshold: data.low_stock_threshold === '' ? null : parseInt(String(data.low_stock_threshold)),
        };
        post(route('inventory.store'), {
            ...transformedData,
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                console.error(errs);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Tambah Item Inventori" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
                <div className="mx-auto w-full max-w-none px-0 py-8 sm:px-0 lg:px-0">
                    {/* Flash Message */}
                    {flash?.message && (
                        <div className="mb-8 rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                    <svg className="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-base font-medium text-emerald-800">{flash.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Main Card */}
                        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
                            {/* Header */}
                            <div className="border-b border-gray-200 px-12 py-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                                        <Package className="h-6 w-6 text-sky-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Tambah Item Inventori Baru</h1>
                                        <p className="mt-1 text-sm text-gray-600">Lengkapi informasi item yang akan ditambahkan ke inventori</p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="px-12 py-12">
                                {/* Informasi Dasar */}
                                <div className="mb-10">
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Informasi Dasar</h3>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Nama Item */}
                                        <div className="col-span-2">
                                            <label htmlFor="name" className="mb-3 block text-base font-semibold text-gray-900">
                                                Nama Item *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="Masukkan nama item inventori"
                                            />
                                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                        </div>

                                        {/* Tipe Barang */}
                                        <div>
                                            <label htmlFor="type" className="mb-3 block text-base font-semibold text-gray-900">
                                                Tipe Barang *
                                            </label>
                                            <select
                                                id="type"
                                                value={data.type}
                                                onChange={(e) => setData('type', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                            >
                                                <option value="">Pilih Tipe Barang</option>
                                                <option value="filter">Filter</option>
                                                <option value="mesin">Mesin</option>
                                                <option value="alat">Alat</option>
                                                <option value="sparepart">Sparepart</option>
                                            </select>
                                            {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
                                        </div>

                                        {/* SKU */}
                                        <div>
                                            <label htmlFor="sku" className="mb-3 block text-base font-semibold text-gray-900">
                                                SKU
                                            </label>
                                            <input
                                                type="text"
                                                id="sku"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="SKU-001"
                                            />
                                            {errors.sku && <p className="mt-2 text-sm text-red-600">{errors.sku}</p>}
                                        </div>

                                        {/* Toko */}
                                        <div className="col-span-2">
                                            <label htmlFor="store_id" className="mb-3 block text-base font-semibold text-gray-900">
                                                Toko *
                                            </label>
                                            <select
                                                id="store_id"
                                                value={data.store_id}
                                                onChange={(e) => setData('store_id', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                            >
                                                <option value="">Pilih Toko</option>
                                                {stores &&
                                                    stores.map((store) => (
                                                        <option key={store.id} value={store.id}>
                                                            {store.name}
                                                        </option>
                                                    ))}
                                            </select>
                                            {errors.store_id && <p className="mt-2 text-sm text-red-600">{errors.store_id}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Stok */}
                                <div className="mb-10">
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Informasi Stok</h3>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                        {/* Jumlah */}
                                        <div>
                                            <label htmlFor="quantity" className="mb-3 block text-base font-semibold text-gray-900">
                                                Jumlah *
                                            </label>
                                            <input
                                                type="number"
                                                id="quantity"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', Number(e.target.value))}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="0"
                                                min="0"
                                            />
                                            {errors.quantity && <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>}
                                        </div>

                                        {/* Satuan */}
                                        <div>
                                            <label htmlFor="unit" className="mb-3 block text-base font-semibold text-gray-900">
                                                Satuan
                                            </label>
                                            <input
                                                type="text"
                                                id="unit"
                                                value={data.unit}
                                                onChange={(e) => setData('unit', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="pcs, kg, liter"
                                            />
                                            {errors.unit && <p className="mt-2 text-sm text-red-600">{errors.unit}</p>}
                                        </div>

                                        {/* Batas Stok Rendah */}
                                        <div>
                                            <label htmlFor="low_stock_threshold" className="mb-3 block text-base font-semibold text-gray-900">
                                                Batas Stok Rendah
                                            </label>
                                            <input
                                                type="number"
                                                id="low_stock_threshold"
                                                value={data.low_stock_threshold}
                                                onChange={(e) => setData('low_stock_threshold', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="10"
                                                min="0"
                                            />
                                            {errors.low_stock_threshold && <p className="mt-2 text-sm text-red-600">{errors.low_stock_threshold}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Lokasi */}
                                <div className="mb-10">
                                    <h3 className="mb-6 text-lg font-semibold text-gray-900">Informasi Lokasi & Deskripsi</h3>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Lokasi */}
                                        <div>
                                            <label htmlFor="location" className="mb-3 block text-base font-semibold text-gray-900">
                                                Lokasi Penyimpanan
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                value={data.location}
                                                onChange={(e) => setData('location', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="Gudang A, Rak B-1"
                                            />
                                            {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
                                        </div>

                                        {/* Deskripsi */}
                                        <div>
                                            <label htmlFor="description" className="mb-3 block text-base font-semibold text-gray-900">
                                                Deskripsi
                                            </label>
                                            <textarea
                                                id="description"
                                                rows={4}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="block w-full rounded-xl border-0 bg-gray-50 px-5 py-4 text-base text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all duration-200 ring-inset placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-sky-500"
                                                placeholder="Deskripsikan detail item inventori..."
                                            />
                                            {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-8">
                                    <Link
                                        href={route('inventory.index')}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-sky-500/25 transition-all duration-200 hover:from-sky-600 hover:to-sky-700 hover:shadow-xl hover:shadow-sky-500/30 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing ? 'Menyimpan...' : 'Simpan Item'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Info Card 
                        <div className="rounded-2xl bg-sky-50 p-6 ring-1 ring-sky-200">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                                    <svg className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-semibold text-sky-900">Tips Pengisian Form</h4>
                                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-sky-800 md:grid-cols-2">
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400"></div>
                                            <span>Pastikan SKU unik untuk setiap item</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400"></div>
                                            <span>Atur batas stok rendah untuk notifikasi</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400"></div>
                                            <span>Gunakan lokasi yang spesifik dan mudah ditemukan</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-400"></div>
                                            <span>Deskripsi yang detail membantu identifikasi</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>*/}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
