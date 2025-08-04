// resources/js/Pages/Inventory/Index.tsx
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { PageProps, PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

import { AlertTriangle, Briefcase, CheckCircle2, Edit, Eye, Filter, Package, Plus, Search, Trash2, User as UserIcon } from 'lucide-react';
import React from 'react';

// Definisikan tipe data spesifik (sesuaikan)
interface InventoryData {
    id: number;
    name: string;
    quantity: number;
    low_stock_threshold: number | null;
    lastUpdater: {
        name: string;
    } | null;
}

// Definisikan Props
interface IndexProps extends PageProps {
    inventoryItems: PaginatedData<InventoryData>;
    filters: { search?: string; show_low_stock?: string }; // show_low_stock bisa jadi 'true'/'1'
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventori',
        href: '/inventory',
    },
];

export default function Index({ auth, inventoryItems, filters, flash }: IndexProps) {
    const { appearance } = useAppearance();

    // State dan Handler Filter
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [showLowStock, setShowLowStock] = React.useState(!!filters.show_low_stock);

    const applyFilters = () => {
        router.get(
            route('inventory.index'),
            {
                search: searchTerm || undefined,
                show_low_stock: showLowStock ? '1' : undefined,
            },
            { preserveState: true, replace: true, preserveScroll: true },
        );
    };

    // Debounce search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                applyFilters();
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Apply filter saat checkbox berubah
    React.useEffect(() => {
        if (showLowStock !== !!filters.show_low_stock) {
            applyFilters();
        }
    }, [showLowStock]);

    const handleDelete = (itemId: number, itemName: string) => {
        console.log(itemId, itemName);
        if (confirm(`Apakah Anda yakin ingin menghapus item "${itemName}"?`)) {
            router.delete(route('inventory.destroy', itemId), {
                preserveScroll: true,
            });
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setShowLowStock(false);
        router.get(route('inventory.index'), {}, { preserveState: true, replace: true, preserveScroll: true });
    };

    // Calculate stats
    const totalItems = inventoryItems.total || 0;
    const lowStockItems = inventoryItems.data.filter((item) => item.low_stock_threshold && item.quantity <= item.low_stock_threshold).length;
    const goodStockItems = inventoryItems.data.length - lowStockItems;

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Inventory Management" />

            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50" style={{ padding: '0 50px' }}>
                <div className="w-full py-8">
                    {/* Hero Header Section */}
                    <div className="w-full px-0 py-8">
                        <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-5">
                                    {' '}
                                    {/* ubah gap-3 jadi gap-5 */}
                                    <div className="ml-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                                        {' '}
                                        {/* tambahkan ml-2 */}
                                        <Briefcase className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                                            Manajemen Inventori
                                        </h1>
                                        <p className="text-lg text-slate-600">Kelola stok dan status inventori dengan mudah</p>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href={route('inventory.create')}
                                className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl"
                            >
                                <Plus className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
                                <span>Tambah Inventori Baru</span>
                            </Link>
                        </div>
                    </div>
                    {/* Search and Filter Section */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-lg">
                        <div className="p-8">
                            <div className="space-y-6">
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Search className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Cari nama inventori..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-cyan-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50 py-5 pr-4 pl-14 text-lg transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500"
                                    />
                                </div>

                                {/* Filter Options */}
                                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => setShowLowStock(!showLowStock)}
                                            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                                                showLowStock
                                                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-md hover:from-red-600 hover:to-pink-700'
                                                    : 'border-2 border-cyan-200 bg-white text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50'
                                            }`}
                                        >
                                            <Filter className="h-5 w-5" />
                                            <span>Stok Rendah</span>
                                            {showLowStock && (
                                                <span className="bg-opacity-20 ml-1 rounded-full bg-white px-2 py-1 text-xs">{lowStockItems}</span>
                                            )}
                                        </button>
                                    </div>

                                    {(searchTerm || showLowStock) && (
                                        <button
                                            onClick={resetFilters}
                                            className="rounded-xl border-2 border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                                        >
                                            Reset Filter
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Grid */}
                    {inventoryItems.data.length > 0 ? (
                        <div className="mb-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                            {inventoryItems.data.map((item) => {
                                const isLowStock = item.low_stock_threshold && item.quantity <= item.low_stock_threshold;
                                return (
                                    <div
                                        key={item.id}
                                        className={`group overflow-hidden rounded-2xl border-2 bg-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                                            isLowStock ? 'border-red-200 hover:border-red-300' : 'border-cyan-200 hover:border-cyan-300'
                                        }`}
                                    >
                                        {/* Card Header */}
                                        <div
                                            className={`p-8 ${
                                                isLowStock
                                                    ? 'border-b border-red-100 bg-gradient-to-br from-red-50 to-pink-50'
                                                    : 'border-b border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex min-w-0 flex-1 items-start gap-4">
                                                    <div
                                                        className={`flex h-16 w-16 items-center justify-center rounded-xl shadow-sm ${
                                                            isLowStock
                                                                ? 'bg-gradient-to-br from-red-400 to-pink-600'
                                                                : 'bg-gradient-to-br from-cyan-400 to-blue-600'
                                                        }`}
                                                    >
                                                        <Package className="h-8 w-8 text-white" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="truncate text-xl font-bold text-gray-800 transition-colors duration-200 group-hover:text-cyan-600">
                                                            {item.name}
                                                        </h3>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {isLowStock ? (
                                                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                                            ) : (
                                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                            )}
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {isLowStock ? 'Stok Rendah' : 'Stok Baik'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    <span
                                                        className={`inline-flex items-center rounded-xl px-4 py-2 text-lg font-bold ${
                                                            isLowStock
                                                                ? 'border border-red-200 bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                                                                : 'border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                                        }`}
                                                    >
                                                        {item.quantity} unit
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="space-y-6 p-8">
                                            {/* Stock Details */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-base font-medium text-gray-600">Current Stock:</span>
                                                    <span className="text-lg font-bold text-gray-800">{item.quantity} unit</span>
                                                </div>
                                                {item.low_stock_threshold && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-base font-medium text-gray-600">Low Stock Alert:</span>
                                                        <span className="text-lg font-bold text-gray-800">{item.low_stock_threshold} unit</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Last Updated */}
                                            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50 p-4">
                                                <UserIcon className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Last Updated By:</p>
                                                    <p className="text-base font-semibold text-gray-800">{item.lastUpdater?.name || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="p-8 pt-0">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={route('inventory.show', item.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-4 py-3 text-base font-semibold text-cyan-700 transition-all duration-200 hover:border-cyan-300 hover:from-cyan-100 hover:to-blue-100"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                    View
                                                </Link>
                                                <Link
                                                    href={route('inventory.edit', item.id)}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:from-cyan-600 hover:to-blue-700 hover:shadow-md"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-red-600 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:bg-red-100"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="mb-8 rounded-2xl border border-cyan-100 bg-white p-16 text-center shadow-lg">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100">
                                <Package className="h-12 w-12 text-cyan-500" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold text-gray-800">Tidak ada inventori ditemukan</h3>
                            <p className="mb-6 text-lg text-gray-600">Belum ada item inventori yang sesuai dengan kriteria pencarian Anda.</p>
                            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                                <button
                                    onClick={resetFilters}
                                    className="rounded-xl bg-gray-100 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200"
                                >
                                    Reset Filter
                                </button>
                                <Link
                                    href={route('inventory.create')}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:from-cyan-600 hover:to-blue-700"
                                >
                                    <Plus className="h-5 w-5" />
                                    Tambah Inventori Baru
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {inventoryItems.links && inventoryItems.data.length > 0 && inventoryItems.links.length > 3 && (
                        <div className="rounded-2xl border border-cyan-100 bg-white p-8 shadow-lg">
                            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                                <div className="text-base text-gray-600">
                                    Menampilkan <span className="font-semibold text-gray-800">{inventoryItems.from}</span> -
                                    <span className="font-semibold text-gray-800"> {inventoryItems.to}</span> dari
                                    <span className="font-semibold text-gray-800"> {inventoryItems.total}</span> item
                                </div>
                                <div className="flex items-center gap-3">
                                    {inventoryItems.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 ${
                                                link.active
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                                                    : link.url
                                                      ? 'bg-gray-100 text-gray-700 hover:scale-105 hover:bg-gray-200'
                                                      : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            preserveScroll
                                            preserveState
                                            // @ts-ignore
                                            disabled={!link.url}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
