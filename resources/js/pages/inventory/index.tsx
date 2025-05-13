// resources/js/Pages/Inventory/Index.tsx
import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // <-- Menggunakan AppLayout
import { PaginatedData, PageProps, User } from '@/types'; // <-- Import tipe
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
             search: searchTerm || undefined, // Kirim undefined jika kosong agar bersih
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
        if (confirm('Are you sure you want to delete this inventory item?')) {
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
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Kelola stok dan status filter</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                        <Plus className="w-5 h-5" />
                        <span>Tambah Inventori</span>
                    </button>
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
                        <button className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent ${
                            isDark 
                                ? 'border-border text-accent-foreground' 
                                : 'border-gray-200 text-gray-700'
                        }`}>
                            <Filter className="w-5 h-5" />
                            <span>Filter</span>
                        </button>
                        <select className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                            isDark 
                                ? 'bg-card text-card-foreground border-border' 
                                : 'bg-white text-gray-900 border-gray-200'
                        }`}>
                            <option>Urutkan</option>
                            <option>Nama A-Z</option>
                            <option>Nama Z-A</option>
                            <option>Stok Terbanyak</option>
                            <option>Stok Tersedikit</option>
                        </select>
                    </div>
                </div>

                {/* Daftar Inventori */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inventoryItems.data.map((item) => (
                        <InventoryCard
                            key={item.id}
                            name={item.name}
                            stock={item.quantity}
                            status={item.low_stock_threshold && parseFloat(String(item.quantity)) <= item.low_stock_threshold ? 'critical' : 'good'}
                            lastMaintenance={item.lastUpdater?.name ?? 'N/A'}
                            nextMaintenance={item.lastUpdater?.name ?? 'N/A'}
                            isDark={isDark}
                        />
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                        <button className={`px-4 py-2 border rounded-lg hover:bg-accent ${
                            isDark 
                                ? 'border-border text-accent-foreground' 
                                : 'border-gray-200 text-gray-700'
                        }`}>
                            Previous
                        </button>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                            1
                        </button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-accent ${
                            isDark 
                                ? 'border-border text-accent-foreground' 
                                : 'border-gray-200 text-gray-700'
                        }`}>
                            2
                        </button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-accent ${
                            isDark 
                                ? 'border-border text-accent-foreground' 
                                : 'border-gray-200 text-gray-700'
                        }`}>
                            3
                        </button>
                        <button className={`px-4 py-2 border rounded-lg hover:bg-accent ${
                            isDark 
                                ? 'border-border text-accent-foreground' 
                                : 'border-gray-200 text-gray-700'
                        }`}>
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function InventoryCard({ name, stock, status, lastMaintenance, nextMaintenance, isDark }: {
    name: string;
    stock: number;
    status: string;
    lastMaintenance: string;
    nextMaintenance: string;
    isDark: boolean;
}) {
    const statusColors = {
        good: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800',
        warning: isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
        critical: isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800',
    };

    const stockStatus = stock > 10 ? 'good' : stock > 5 ? 'warning' : 'critical';

    return (
        <div className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
            isDark 
                ? 'bg-card text-card-foreground border-border' 
                : 'bg-white text-gray-900 border-gray-200'
        }`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-primary/20' : 'bg-blue-100'
                }`}>
                    <Package className={`w-6 h-6 ${isDark ? 'text-primary' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[stockStatus]}`}>
                            {stock} unit
                        </span>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                            {stockStatus === 'good' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Status: {status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Terakhir Perawatan: {lastMaintenance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Perawatan Selanjutnya: {nextMaintenance}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button className={`text-sm font-medium ${
                    isDark ? 'text-primary hover:text-primary/90' : 'text-blue-600 hover:text-blue-700'
                }`}>
                    Lihat Detail →
                </button>
            </div>
        </div>
    );
}