// resources/js/Pages/Inventory/Index.tsx
import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, PageProps, User } from '@/types';
import { Package, Search, Filter, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';

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
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // State dan Handler Filter
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');
    const [showLowStock, setShowLowStock] = React.useState(!!filters.show_low_stock);

    const applyFilters = () => {
        router.get(route('inventory.index'), {
            search: searchTerm || undefined,
            show_low_stock: showLowStock ? '1' : undefined,
        }, { preserveState: true, replace: true, preserveScroll: true });
    }

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

    const handleDelete = (itemId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            router.delete(route('inventory.destroy', itemId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventori" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Daftar Inventori</h1>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Kelola stok dan status inventori</p>
                    </div>
                    <Link
                        href={route('inventory.create')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Tambah Inventori</span>
                    </Link>
                </div>

                {/* Filter dan Pencarian */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                            type="text"
                            placeholder="Cari inventori..."
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setShowLowStock(!showLowStock)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent ${
                                isDark 
                                    ? 'border-border text-accent-foreground' 
                                    : 'border-gray-200 text-gray-700'
                            }`}
                        >
                            <Filter className="w-5 h-5" />
                            <span>Stok Rendah</span>
                        </button>
                    </div>
                </div>

                {/* Daftar Inventori */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inventoryItems.data.map((item) => (
                        <div
                            key={item.id}
                            className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
                                isDark 
                                    ? 'bg-card text-card-foreground border-border' 
                                    : 'bg-white text-gray-900 border-gray-200'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                    isDark ? 'bg-primary/20' : 'bg-blue-100'
                                }`}>
                                    <Package className={`w-6 h-6 ${isDark ? 'text-primary' : 'text-blue-600'}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            item.low_stock_threshold && item.quantity <= item.low_stock_threshold
                                                ? isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
                                                : isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {item.quantity} unit
                                        </span>
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex items-center gap-2">
                                            {item.low_stock_threshold && item.quantity <= item.low_stock_threshold ? (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            )}
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Status: {item.low_stock_threshold && item.quantity <= item.low_stock_threshold ? 'Stok Rendah' : 'Stok Baik'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                Terakhir Diperbarui: {item.lastUpdater?.name ?? 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                                <Link
                                    href={route('inventory.edit', item.id)}
                                    className={`text-sm font-medium ${
                                        isDark ? 'text-primary hover:text-primary/90' : 'text-blue-600 hover:text-blue-700'
                                    }`}
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className={`text-sm font-medium ${
                                        isDark ? 'text-destructive hover:text-destructive/90' : 'text-red-600 hover:text-red-700'
                                    }`}
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                    {inventoryItems.data.length === 0 && (
                        <div className={`col-span-full text-center py-8 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Tidak ada item inventori ditemukan.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {inventoryItems.links.length > 3 && (
                    <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2">
                            {inventoryItems.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 border rounded-lg ${
                                        link.active
                                            ? 'bg-primary text-primary-foreground'
                                            : isDark
                                                ? 'border-border text-accent-foreground hover:bg-accent'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                    }`}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    as={link.url === null ? 'span' : 'a'}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}