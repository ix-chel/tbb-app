// resources/js/Pages/Companies/Index.tsx
import React from 'react';
import { Link, Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PaginatedData, PageProps } from '@/types';
import { Building2, Search, Filter, Plus } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { useAppearance } from '@/hooks/use-appearance';

interface StoreData {
    id: number;
    name: string;
    address: string;
}

interface CompanyData {
    id: number;
    name: string;
    address: string;
    phone: string;
    email?: string;
    registration_number?: string;
    contact_person_name?: string;
    contact_person_email?: string;
    contact_person_phone?: string;
    stores: StoreData[];
}

interface IndexProps extends PageProps {
    companies: PaginatedData<CompanyData>;
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perusahaan', // Saya perbaiki typo di sini
        href: '/companies',
    },
];

export default function Index({ auth, companies, filters, flash }: IndexProps) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const [selectedCompany, setSelectedCompany] = React.useState<CompanyData | null>(null);

    React.useEffect(() => {
        if (companies.data.length > 0 && !selectedCompany) {
            setSelectedCompany(companies.data[0]);
        }
    }, [companies, selectedCompany]);

    // Fungsi untuk menangani klik pada baris perusahaan
    const handleCompanyRowClick = (company: CompanyData) => {
        setSelectedCompany(company);
    };

    // Fungsi untuk menangani klik tombol detail (opsional, jika ingin fungsionalitas berbeda)
    const handleDetailButtonClick = (e: React.MouseEvent, company: CompanyData) => {
        e.stopPropagation(); // Mencegah event klik pada baris ikut terpicu
        setSelectedCompany(company);
        // Anda bisa menambahkan navigasi atau logika lain di sini jika perlu
        console.log('Detail button clicked for:', company.name);
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Companies" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Daftar Perusahaan</h1>
                        <Link
                            href={route('companies.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Perusahaan
                        </Link>
                    </div>

                    {/* Search & Filter */}
                    <div className="mb-6 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Cari perusahaan..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-300"
                                value={filters.search || ''}
                                onChange={(e) => {
                                    router.get(
                                        route('companies.index'),
                                        { search: e.target.value },
                                        { preserveState: true, preserveScroll: true, replace: true }
                                    );
                                }}
                            />
                        </div>
                        {/* Anda bisa menambahkan tombol Filter di sini jika diperlukan */}
                        {/* <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            <Filter className="w-5 h-5 mr-2 text-gray-400" />
                            Filter
                        </button> */}
                    </div>

                    {/* Tabel Daftar Perusahaan */}
                    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Nama
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Alamat
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Contact Person
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Contact Phone
                                        </th>
                                        
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {companies.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                                Tidak ada data perusahaan.
                                            </td>
                                        </tr>
                                    )}
                                    {companies.data.map(company => (
                                        <tr
                                            key={company.id}
                                            className={`${
                                                selectedCompany?.id === company.id ? 'bg-blue-50 dark:bg-blue-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            } transition-colors duration-150 ease-in-out`}
                                            onClick={() => handleCompanyRowClick(company)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{company.name}</td>
                                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 break-words">{company.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{company.contact_person_name || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{company.contact_person_phone || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {/* Anda bisa menambahkan link Edit atau Delete di sini */}
                                                {/* <Link href={route('companies.edit', company.id)} className="ml-4 text-yellow-600 hover:text-yellow-900">Edit</Link> */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Detail Company */}
                    {selectedCompany && (
                        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Detail Perusahaan</h2>
                                {/* Tombol Aksi untuk Detail Perusahaan (Contoh: Edit) */}
                                <Link 
                                    href={route('companies.edit', selectedCompany.id)} 
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-gray-800"
                                >
                                    Edit Perusahaan
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 dark:text-gray-300">
                                <div><strong>Nama:</strong> {selectedCompany.name}</div>
                                <div><strong>Alamat:</strong> {selectedCompany.address}</div>
                                <div><strong>Email:</strong> {selectedCompany.email || '-'}</div>
                                <div><strong>Telepon:</strong> {selectedCompany.phone || '-'}</div>
                                <div><strong>No. Registrasi:</strong> {selectedCompany.registration_number || '-'}</div>
                                <div><strong>Nama Kontak Person:</strong> {selectedCompany.contact_person_name || '-'}</div>
                                <div><strong>Email Kontak Person:</strong> {selectedCompany.contact_person_email || '-'}</div>
                                <div><strong>Telepon Kontak Person:</strong> {selectedCompany.contact_person_phone || '-'}</div>
                            </div>
                        </div>
                    )}

                    {/* Daftar Toko */}
                    {selectedCompany && selectedCompany.stores && selectedCompany.stores.length > 0 && (
                        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Daftar Toko Milik {selectedCompany.name}</h3>
                                {/* Tombol Tambah Toko (jika ada fungsionalitasnya) */}
                                <Link 
                                    href={route('stores.create', { company_id: selectedCompany.id })} // Sesuaikan dengan route Anda
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Tambah Toko
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Nama Toko
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                            >
                                                Alamat
                                            </th>
                                            {/* Anda bisa menambahkan kolom aksi untuk toko jika perlu */}
                                            {/* <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Edit</span>
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {selectedCompany.stores.map(store => (
                                            <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 ease-in-out">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{store.name}</td>
                                                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400 break-words">{store.address}</td>
                                                {/* Contoh Aksi untuk Toko */}
                                                {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link href={`/stores/${store.id}/edit`} className="text-indigo-600 hover:text-indigo-900"> {/* Sesuaikan route */}
                                                        {/* Edit
                                                    </Link>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                     {selectedCompany && selectedCompany.stores && selectedCompany.stores.length === 0 && (
                        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Tidak Ada Toko</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Perusahaan "{selectedCompany.name}" belum memiliki toko terdaftar.
                            </p>
                            {/* <div className="mt-6">
                                <Link
                                    href={route('stores.create', { company_id: selectedCompany.id })} // Sesuaikan dengan route Anda
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                    Tambah Toko Baru
                                </Link>
                            </div> */}
                        </div>
                    )}


                    {/* Pagination */}
                    {companies.links && companies.data.length > 0 && (
                        <div className="mt-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {companies.prev_page_url && (
                                    <Link
                                        href={companies.prev_page_url}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Previous
                                    </Link>
                                )}
                                {companies.next_page_url && (
                                    <Link
                                        href={companies.next_page_url}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Next
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Menampilkan <span className="font-medium">{companies.from}</span> sampai <span className="font-medium">{companies.to}</span> dari <span className="font-medium">{companies.total}</span> hasil
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        {companies.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                aria-current={link.active ? 'page' : undefined}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                    ${ link.active ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-300' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700' }
                                                    ${ index === 0 ? 'rounded-l-md' : '' }
                                                    ${ index === companies.links.length - 1 ? 'rounded-r-md' : '' }
                                                    ${ !link.url ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : '' }
                                                `}
                                                dangerouslySetInnerHTML={{ __html: link.label }} // Hati-hati dengan XSS jika label berasal dari user input tidak aman
                                                preserveScroll
                                            />
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </AppLayout>
    );
}