// resources/js/Pages/Inventory/Index.tsx
import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // <-- Menggunakan AppLayout
import { PaginatedData, PageProps, User } from '@/types'; // <-- Import tipe
import { useAppearance } from '@/hooks/use-appearance';

// Definisikan tipe data spesifik (sesuaikan)
interface InventoryItemData {
    id: number;
    name: string;
    sku?: string;
    description?: string;
    quantity: number | string; // Bisa string dari DB jika decimal
    unit?: string;
    location?: string;
    low_stock_threshold?: number;
    last_updated_by?: number; // ID user
    lastUpdater?: User | null; // Relasi (bisa null jika user dihapus/tidak diset)
}

// Definisikan Props
interface IndexProps extends PageProps {
    inventoryItems: PaginatedData<InventoryItemData>;
    filters: { search?: string; show_low_stock?: string }; // show_low_stock bisa jadi 'true'/'1'
}

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
        <AppLayout
            user={auth.user}
            header={<h2 className={`font-semibold text-xl ${isDark ? 'text-white' : 'text-gray-800'} leading-tight`}>Inventory Management</h2>}
        >
            <Head title="Inventory" />
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

                            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search name/sku..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={`border rounded px-2 py-1 flex-grow sm:flex-grow-0 ${
                                            isDark 
                                                ? 'bg-card text-card-foreground border-border' 
                                                : 'bg-white text-gray-900 border-gray-200'
                                        }`}
                                    />
                                    <label className={`flex items-center whitespace-nowrap ${
                                        isDark ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        <input
                                            type="checkbox"
                                            checked={showLowStock}
                                            onChange={(e) => setShowLowStock(e.target.checked)}
                                            className={`rounded mr-2 ${
                                                isDark ? 'bg-card border-border' : 'bg-white border-gray-200'
                                            }`}
                                        />
                                        Low Stock Only
                                    </label>
                                </div>

                                <Link
                                    href={route('inventory.create')}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 w-full sm:w-auto text-center"
                                >
                                    Create Item
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className={isDark ? 'bg-card' : 'bg-gray-50'}>
                                        <tr>
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Name</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>SKU</th>
                                            <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Qty</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Unit</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Location</th>
                                            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Last Updated By</th>
                                            <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                                                isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y divide-border ${
                                        isDark ? 'bg-card' : 'bg-white'
                                    }`}>
                                        {inventoryItems.data.map((item) => (
                                            <tr key={item.id} className={
                                                item.low_stock_threshold && parseFloat(String(item.quantity)) <= item.low_stock_threshold 
                                                    ? isDark ? 'bg-red-900/20' : 'bg-red-50' 
                                                    : ''
                                            }>
                                                <td className={`px-6 py-4 whitespace-nowrap ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.name}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.sku ?? '-'}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-right ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.quantity}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.unit ?? '-'}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.location ?? '-'}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${
                                                    isDark ? 'text-gray-300' : 'text-gray-900'
                                                }`}>{item.lastUpdater?.name ?? 'N/A'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link 
                                                        href={route('inventory.edit', item.id)} 
                                                        className={`${
                                                            isDark ? 'text-primary hover:text-primary/90' : 'text-indigo-600 hover:text-indigo-900'
                                                        } mr-3`}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)} 
                                                        className={`${
                                                            isDark ? 'text-destructive hover:text-destructive/90' : 'text-red-600 hover:text-red-900'
                                                        }`}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {inventoryItems.data.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className={`text-center py-4 ${
                                                    isDark ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    No inventory items found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4">
                                {inventoryItems.links.length > 3 && (
                                    <div className="flex flex-wrap -mb-1">
                                        {inventoryItems.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded ${
                                                    link.url === null 
                                                        ? `cursor-default ${isDark ? 'text-gray-600' : 'text-gray-400'}`
                                                        : `${
                                                            isDark 
                                                                ? 'hover:bg-accent focus:border-primary focus:text-primary' 
                                                                : 'hover:bg-white focus:border-indigo-500 focus:text-indigo-500'
                                                        }`
                                                } ${
                                                    link.active 
                                                        ? isDark 
                                                            ? 'bg-primary text-primary-foreground' 
                                                            : 'bg-blue-500 text-white'
                                                        : ''
                                                }`}
                                                href={link.url || '#'}
                                                preserveScroll
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                as={link.url === null ? 'span' : 'a'}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}