// resources/js/Pages/Inventory/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps, User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, ArrowLeft, Building2, Hash, Layers, MapPin, Package, Save } from 'lucide-react';
import React from 'react';

// Definisikan tipe data spesifik
interface InventoryItemData {
    id: number;
    name: string;
    sku?: string;
    description?: string;
    quantity: number | string;
    unit?: string;
    location?: string;
    low_stock_threshold?: number | null;
    last_updated_by?: number;
    lastUpdater?: User | null;
    type?: string;
    store_id?: string;
}

interface EditProps extends PageProps {
    inventoryItem: InventoryItemData;
    stores: { id: string; name: string }[];
}

export default function Edit({ auth, inventoryItem, flash, stores }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: inventoryItem.name || '',
        type: inventoryItem.type || '',
        store_id: inventoryItem.store_id || '',
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
            onSuccess: () => {
                /* Mungkin ada aksi setelah sukses */
            },
            onError: (errs) => {
                /* Mungkin ada aksi jika error */ console.error(errs);
            },
        });
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Edit Item - ${inventoryItem.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Flash Message */}
                    {flash?.message && (
                        <div className="mb-8 transform rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-4 shadow-lg">
                            <div className="flex items-center">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <p className="ml-3 font-medium text-blue-800">{flash.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Edit Form Card */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl">
                        {/* Header Section with Gradient */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white opacity-10"></div>
                            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white opacity-5"></div>

                            <div className="relative z-10">
                                <div className="mb-4">
                                    <div>
                                        <h1 className="mb-2 text-4xl font-bold text-white">{inventoryItem.name}</h1>
                                        <h3 className="truncate text-xl font-bold text-white transition-colors duration-200 group-hover:text-cyan-600">
                                            Edit Inventory Item
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Content Section */}
                        <div className="px-8 py-8">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    {/* Inventory Form Fields */}
                                    <div className="space-y-6 lg:col-span-2">
                                        {/* Basic Information */}
                                        <div>
                                            <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                                <Package className="mr-3 h-6 w-6 text-blue-600" />
                                                Basic Information
                                            </h3>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                {/* Item Name */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Item Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter item name"
                                                        required
                                                    />
                                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                                </div>

                                                {/* Item Type */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <Layers className="mr-2 inline h-4 w-4" />
                                                        Item Type
                                                    </label>
                                                    <select
                                                        value={data.type}
                                                        onChange={(e) => setData('type', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Type</option>
                                                        <option value="filter">Filter</option>
                                                        <option value="mesin">Mesin</option>
                                                        <option value="alat">Alat</option>
                                                        <option value="sparepart">Sparepart</option>
                                                    </select>
                                                    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                                                </div>

                                                {/* Store */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <Building2 className="mr-2 inline h-4 w-4" />
                                                        Store
                                                    </label>
                                                    <select
                                                        value={data.store_id}
                                                        onChange={(e) => setData('store_id', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <option value="">Select Store</option>
                                                        {stores &&
                                                            stores.map((store) => (
                                                                <option key={store.id} value={store.id}>
                                                                    {store.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                    {errors.store_id && <p className="mt-1 text-sm text-red-600">{errors.store_id}</p>}
                                                </div>

                                                {/* SKU */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <Hash className="mr-2 inline h-4 w-4" />
                                                        SKU
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.sku}
                                                        onChange={(e) => setData('sku', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter SKU"
                                                    />
                                                    {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
                                                </div>

                                                {/* Location */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <MapPin className="mr-2 inline h-4 w-4" />
                                                        Location
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.location}
                                                        onChange={(e) => setData('location', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter location"
                                                    />
                                                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity & Stock Information */}
                                        <div>
                                            <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                                <AlertTriangle className="mr-3 h-6 w-6 text-blue-600" />
                                                Quantity & Stock Information
                                            </h3>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                {/* Quantity */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Quantity</label>
                                                    <input
                                                        type="number"
                                                        value={data.quantity}
                                                        onChange={(e) => setData('quantity', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="0"
                                                    />
                                                    {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
                                                </div>

                                                {/* Unit */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Unit</label>
                                                    <input
                                                        type="text"
                                                        value={data.unit}
                                                        onChange={(e) => setData('unit', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="pcs, kg, liter"
                                                    />
                                                    {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                                                </div>

                                                {/* Low Stock Threshold */}
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Low Stock Alert</label>
                                                    <input
                                                        type="number"
                                                        value={data.low_stock_threshold}
                                                        onChange={(e) => setData('low_stock_threshold', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Minimum stock level"
                                                    />
                                                    {errors.low_stock_threshold && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.low_stock_threshold}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={4}
                                                className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter item description"
                                            />
                                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                        </div>
                                    </div>

                                    {/* Action Buttons Sidebar */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                                <Save className="mr-3 h-6 w-6 text-blue-600" />
                                                Actions
                                            </h3>

                                            <div className="space-y-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Save className="mr-3 h-5 w-5" />
                                                    {processing ? 'Saving...' : 'Save Changes'}
                                                </button>

                                                <Link
                                                    href={route('inventory.index')}
                                                    className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 shadow-md transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg"
                                                >
                                                    <ArrowLeft className="mr-3 h-5 w-5" />
                                                    Cancel & Back
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Information Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Current Quantity Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Stock</h3>
                                    <p className="text-sm text-gray-500">Available Quantity</p>
                                </div>
                            </div>
                            <p className="text-white-700 text-2xl font-bold">
                                {inventoryItem.quantity} {inventoryItem.unit}
                            </p>
                        </div>

                        {/* Current Location Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                    <p className="text-sm text-gray-500">Storage Location</p>
                                </div>
                            </div>
                            <p className="leading-relaxed text-gray-700">{inventoryItem.location || 'Location not specified'}</p>
                        </div>

                        {/* Current SKU Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <Hash className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">SKU</h3>
                                    <p className="text-sm text-gray-500">Stock Keeping Unit</p>
                                </div>
                            </div>
                            <p className="font-mono text-lg font-semibold text-gray-700">{inventoryItem.sku || 'No SKU assigned'}</p>
                        </div>

                        {/* Low Stock Alert Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Alert Level</h3>
                                    <p className="text-sm text-gray-500">Low Stock Threshold</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-orange-600">
                                {inventoryItem.low_stock_threshold || 'Not set'} {inventoryItem.unit || 'items'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
