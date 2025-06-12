// resources/js/Pages/Inventory/Edit.tsx
import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, User } from '@/types'; // Import tipe
import { useAppearance } from '@/hooks/use-appearance';

// Definisikan tipe data spesifik
interface InventoryItemData {
    id: number;
    name: string;
    sku?: string;
    description?: string;
    quantity: number | string;
    unit?: string;
    location?: string;
    low_stock_threshold?: number | null; // Bisa null
    last_updated_by?: number;
    lastUpdater?: User | null;
}
interface EditProps extends PageProps {
    inventoryItem: InventoryItemData;
}

export default function Edit({ auth, inventoryItem, flash }: EditProps) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const { data, setData, put, processing, errors } = useForm({
        name: inventoryItem.name || '',
        sku: inventoryItem.sku || '',
        description: inventoryItem.description || '',
        quantity: inventoryItem.quantity ?? 0,
        unit: inventoryItem.unit || '',
        location: inventoryItem.location || '',
        low_stock_threshold: inventoryItem.low_stock_threshold ?? '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const transformedData = {
            ...data,
            quantity: parseFloat(String(data.quantity)),
            low_stock_threshold: data.low_stock_threshold === '' ? null : parseInt(String(data.low_stock_threshold)),
        };
        put(route('inventory.update', inventoryItem.id), {
            ...transformedData,
            preserveScroll: true,
            onSuccess: () => { /* Mungkin ada aksi setelah sukses */ },
            onError: (errs) => { /* Mungkin ada aksi jika error */ console.error(errs); },
        });
    };

    return (
        <AppLayout 
            user={auth.user} 
            header={<h2 className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-800'} leading-tight`}>Edit Item Inventori</h2>}
        >
            <Head title={`Edit Item - ${inventoryItem.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className={`${isDark ? 'bg-card' : 'bg-white'} overflow-hidden shadow-sm sm:rounded-lg`}>
                        <div className={`p-6 ${isDark ? 'text-card-foreground' : 'text-gray-900'}`}>
                            {flash?.message && (
                                <div className={`mb-4 p-4 rounded ${
                                    isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                                }`}>
                                    {flash.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="sku" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        id="sku"
                                        value={data.sku}
                                        onChange={e => setData('sku', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.sku && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.sku}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="quantity" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Jumlah
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={data.quantity}
                                        onChange={e => setData('quantity', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.quantity && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="unit" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Satuan
                                    </label>
                                    <input
                                        type="text"
                                        id="unit"
                                        value={data.unit}
                                        onChange={e => setData('unit', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.unit && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.unit}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="location" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Lokasi
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.location && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.location}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="low_stock_threshold" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Batas Stok Rendah
                                    </label>
                                    <input
                                        type="number"
                                        id="low_stock_threshold"
                                        value={data.low_stock_threshold}
                                        onChange={e => setData('low_stock_threshold', e.target.value)}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.low_stock_threshold && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.low_stock_threshold}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="description" className={`block text-sm font-medium ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Deskripsi
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={3}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border focus:border-primary focus:ring-primary' 
                                                : 'bg-white text-gray-900 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                        }`}
                                    />
                                    {errors.description && (
                                        <p className={`mt-2 text-sm ${
                                            isDark ? 'text-destructive' : 'text-red-600'
                                        }`}>
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                    <Link
                                        href={route('inventory.index')}
                                        className={`px-4 py-2 border rounded-md ${
                                            isDark 
                                                ? 'border-border text-accent-foreground hover:bg-accent' 
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50`}
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
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