import LoadingOverlay from '@/components/loading-overlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Clock, Download, Eye, Filter, Mail, MapPin, Phone, Plus, QrCode, Search, User, Camera } from 'lucide-react';
import { useState } from 'react';

interface FilterQR {
    id: number;
    qr_code: string;
    status: 'active' | 'inactive' | 'expired';
    last_scan_at: string | null;
    installation_date: string | null;
    expiry_date: string | null;
    store: {
        id: number;
        name: string;
        address: string;
        contact_person: string;
    };
    filter: {
        id: number;
        name: string;
        type: string;
    };
    contact_person: string;
    contact_phone: string;
    contact_email: string;
}

interface Props {
    qrs: {
        data: FilterQR[];
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'QR Code',
        href: '/FilterQR',
    },
];

export default function Index({ qrs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AppLayout>
            <Head title="Manajemen QR Code Filter" />
            <LoadingOverlay isLoading={isLoading} message="Memuat data..." />

            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
                {/* Hero Section */}
                <div className="w-full px-0 py-8">
                    <div className="container mx-auto px-6 py-12">
                        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-3">
                                <h1 className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                                    QR Code Manager
                                </h1>
                                <p className="text-lg text-slate-600">
                                    Kelola dan pantau semua QR Code filter Anda dalam satu platform yang powerful dan mudah digunakan
                                </p>
                                <div className="text-black-200 flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <QrCode className="h-5 w-5" />
                                        <span>{qrs.data.length} QR Code Aktif</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>{new Set(qrs.data.map((qr) => qr.store.id)).size} Lokasi</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 lg:flex-row">
                                <Link
                                    href={route('FilterQR.create')}
                                    className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl"
                                >
                                    <Plus className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
                                    Buat QR Code Baru
                                </Link>
                                <Link
                                    href={route('FilterQR.scan')}
                                    className="group flex transform items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl"
                                >
                                    <Camera className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                                    Scan QR Code
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto -mt-8 px-6 pb-12">
                    {/* Search & Filter Section */}
                    <Card className="mb-8 border-0 bg-white/90 shadow-2xl backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 transform text-cyan-400" />
                                    <Input
                                        type="search"
                                        placeholder="Cari QR code, nama toko, alamat, atau kontak person..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="h-14 rounded-xl border-2 border-cyan-200 pl-14 text-lg shadow-sm focus:border-cyan-500"
                                    />
                                </div>
                                <div className="lg:w-80">
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger className="h-14 rounded-xl border-2 border-cyan-200 text-lg focus:border-cyan-500">
                                            <div className="flex items-center gap-3">
                                                <Filter className="h-5 w-5 text-cyan-500" />
                                                <SelectValue placeholder="Filter berdasarkan status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">🔄 Semua Status</SelectItem>
                                            <SelectItem value="active">✅ Aktif</SelectItem>
                                            <SelectItem value="inactive">❌ Nonaktif</SelectItem>
                                            <SelectItem value="expired">⚠️ Kadaluarsa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content */}
                    <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                        <CardHeader className="border-b border-cyan-100 p-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                                <QrCode className="h-8 w-8 text-cyan-600" />
                                Daftar QR Code Filter
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {qrs.data.length > 0 ? (
                                <>
                                    {/* Desktop Table View */}
                                    <div className="hidden xl:block">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:to-cyan-150 bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100">
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">QR Code</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Informasi Toko</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Filter</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Kontak</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Status</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Aktivitas</TableHead>
                                                        <TableHead className="py-6 text-base font-bold text-cyan-800">Aksi</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {qrs.data.map((qr, index) => (
                                                        <TableRow
                                                            key={qr.id}
                                                            className="border-b border-cyan-100 transition-all duration-200 hover:bg-cyan-50/50"
                                                        >
                                                            <TableCell className="py-6">
                                                                <div className="flex items-center justify-center">
                                                                    <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 p-4 shadow-lg">
                                                                        <QrCode className="h-10 w-10 text-white" />
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <div className="space-y-2">
                                                                    <div className="text-lg font-bold text-gray-800">{qr.store.name}</div>
                                                                    <div className="flex items-start gap-2 text-gray-600">
                                                                        <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-cyan-500" />
                                                                        <span className="text-sm leading-relaxed">{qr.store.address}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-gray-600">
                                                                        <User className="h-4 w-4 text-cyan-500" />
                                                                        <span className="text-sm font-medium">PIC: {qr.store.contact_person}</span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <div className="rounded-xl bg-gradient-to-r from-cyan-50 to-cyan-100 p-4">
                                                                    {/* <div className="font-bold text-gray-800">{qr.filter.name}</div> */}
                                                                    {/* <div className="mt-1 text-sm font-medium text-cyan-600">{qr.filter.type}</div> */}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center rounded-lg border border-cyan-100 bg-white p-2 text-sm">
                                                                        <User className="mr-3 h-4 w-4 text-cyan-500" />
                                                                        <span className="font-medium">{qr.contact_person || 'Tidak ada'}</span>
                                                                    </div>
                                                                    <div className="flex items-center rounded-lg border border-cyan-100 bg-white p-2 text-sm">
                                                                        <Phone className="mr-3 h-4 w-4 text-cyan-500" />
                                                                        <span className="font-medium">{qr.contact_phone || 'Tidak ada'}</span>
                                                                    </div>
                                                                    <div className="flex items-center rounded-lg border border-cyan-100 bg-white p-2 text-sm">
                                                                        <Mail className="mr-3 h-4 w-4 text-cyan-500" />
                                                                        <span className="truncate font-medium">
                                                                            {qr.contact_email || 'Tidak ada'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <Badge
                                                                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                                                        qr.status === 'active'
                                                                            ? 'border border-green-200 bg-green-100 text-green-800'
                                                                            : qr.status === 'inactive'
                                                                              ? 'border border-gray-200 bg-gray-100 text-gray-800'
                                                                              : 'border border-red-200 bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {qr.status === 'active'
                                                                        ? '✅ Aktif'
                                                                        : qr.status === 'inactive'
                                                                          ? '⏸️ Nonaktif'
                                                                          : '⚠️ Kadaluarsa'}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <div className="space-y-3">
                                                                    <div className="rounded-lg border border-cyan-100 bg-white p-3">
                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                            <Clock className="h-4 w-4 text-cyan-500" />
                                                                            <span className="font-medium">Terakhir Scan:</span>
                                                                        </div>
                                                                        <div className="mt-1 text-sm font-semibold text-gray-800">
                                                                            {qr.last_scan_at
                                                                                ? new Date(qr.last_scan_at).toLocaleDateString('id-ID', {
                                                                                      day: 'numeric',
                                                                                      month: 'short',
                                                                                      year: 'numeric',
                                                                                      hour: '2-digit',
                                                                                      minute: '2-digit',
                                                                                  })
                                                                                : 'Belum pernah'}
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                                        <div className="rounded-lg bg-cyan-50 p-2 text-center">
                                                                            <div className="font-medium text-cyan-600">Instalasi</div>
                                                                            <div className="font-semibold text-gray-800">
                                                                                {qr.installation_date
                                                                                    ? new Date(qr.installation_date).toLocaleDateString('id-ID', {
                                                                                          day: 'numeric',
                                                                                          month: 'short',
                                                                                      })
                                                                                    : '-'}
                                                                            </div>
                                                                        </div>
                                                                        <div className="rounded-lg bg-orange-50 p-2 text-center">
                                                                            <div className="font-medium text-orange-600">Expired</div>
                                                                            <div className="font-semibold text-gray-800">
                                                                                {qr.expiry_date
                                                                                    ? new Date(qr.expiry_date).toLocaleDateString('id-ID', {
                                                                                          day: 'numeric',
                                                                                          month: 'short',
                                                                                      })
                                                                                    : '-'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="py-6">
                                                                <div className="flex items-center gap-3">
                                                                    <Link
                                                                        href={route('FilterQR.show', qr.id)}
                                                                        className="rounded-xl bg-cyan-100 p-3 text-cyan-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-cyan-200 hover:shadow-lg"
                                                                    >
                                                                        <Eye className="h-5 w-5" />
                                                                    </Link>
                                                                    <Link
                                                                        href={route('FilterQR.download', { filterQR: qr.id })}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="rounded-xl bg-green-100 p-3 text-green-700 shadow-md transition-all duration-200 hover:scale-110 hover:bg-green-200 hover:shadow-lg"
                                                                    >
                                                                        <Download className="h-5 w-5" />
                                                                    </Link>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>

                                    {/* Mobile Card View */}
                                    <div className="space-y-6 p-6 xl:hidden">
                                        {qrs.data.map((qr, index) => (
                                            <Card
                                                key={qr.id}
                                                className="border border-cyan-200 shadow-lg transition-all duration-300 hover:border-cyan-300 hover:shadow-xl"
                                            >
                                                <CardContent className="p-6">
                                                    <div className="mb-4 flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 shadow-lg">
                                                                <QrCode className="h-8 w-8 text-white" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-800">{qr.store.name}</h3>
                                                                <Badge
                                                                    className={`mt-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                                                        qr.status === 'active'
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : qr.status === 'inactive'
                                                                              ? 'bg-gray-100 text-gray-800'
                                                                              : 'bg-red-100 text-red-800'
                                                                    }`}
                                                                >
                                                                    {qr.status === 'active'
                                                                        ? '✅ Aktif'
                                                                        : qr.status === 'inactive'
                                                                          ? '⏸️ Nonaktif'
                                                                          : '⚠️ Kadaluarsa'}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={route('FilterQR.show', qr.id)}
                                                                className="rounded-lg bg-cyan-100 p-2 text-cyan-700 transition-colors hover:bg-cyan-200"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            <Link
                                                                href={route('FilterQR.download', { filterQR: qr.id })}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="rounded-lg bg-green-100 p-2 text-green-700 transition-colors hover:bg-green-200"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="rounded-lg bg-cyan-50 p-3">
                                                            <div className="flex items-start gap-2">
                                                                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-cyan-600" />
                                                                <span className="text-sm text-gray-700">{qr.store.address}</span>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100 p-3">
                                                            {/* <div className="font-semibold text-gray-800">{qr.filter.name}</div> */}
                                                            {/* <div className="text-sm text-cyan-600">{qr.filter.type}</div> */}
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                                                            <div className="flex items-center gap-2 rounded-lg border border-cyan-100 bg-white p-2">
                                                                <User className="h-4 w-4 text-cyan-500" />
                                                                <span className="truncate">{qr.contact_person || '-'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 rounded-lg border border-cyan-100 bg-white p-2">
                                                                <Phone className="h-4 w-4 text-cyan-500" />
                                                                <span className="truncate">{qr.contact_phone || '-'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 rounded-lg border border-cyan-100 bg-white p-2">
                                                                <Mail className="h-4 w-4 text-cyan-500" />
                                                                <span className="truncate">{qr.contact_email || '-'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="rounded-lg bg-gray-50 p-3">
                                                            <div className="mb-2 flex items-center gap-2">
                                                                <Clock className="h-4 w-4 text-cyan-500" />
                                                                <span className="text-sm font-medium text-gray-600">Terakhir Scan:</span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-gray-800">
                                                                {qr.last_scan_at
                                                                    ? new Date(qr.last_scan_at).toLocaleDateString('id-ID', {
                                                                          day: 'numeric',
                                                                          month: 'long',
                                                                          year: 'numeric',
                                                                          hour: '2-digit',
                                                                          minute: '2-digit',
                                                                      })
                                                                    : 'Belum pernah'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {qrs.links && qrs.data.length > 0 && (
                                        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-50 to-cyan-100 p-8">
                                            {qrs.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`rounded-xl border-2 px-4 py-3 font-medium transition-all duration-200 ${
                                                        link.active
                                                            ? 'scale-110 border-cyan-600 bg-cyan-600 text-white shadow-lg'
                                                            : 'border-cyan-200 text-cyan-700 hover:scale-105 hover:border-cyan-300 hover:bg-cyan-100'
                                                    } ${!link.url ? 'cursor-not-allowed border-gray-200 text-gray-400' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    preserveScroll
                                                    preserveState
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 p-8">
                                        <QrCode className="h-16 w-16 text-cyan-600" />
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-gray-800">Belum Ada QR Code</h3>
                                    <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
                                        Mulai perjalanan digital Anda dengan membuat QR Code pertama untuk filter Anda
                                    </p>
                                    <Link href={route('FilterQR.create')}>
                                        <Button
                                            size="lg"
                                            className="transform bg-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-cyan-700 hover:shadow-2xl"
                                        >
                                            <Plus className="h-6 w-6 transition-transform duration-200 group-hover:rotate-90" />
                                            Buat QR Code Sekarang
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
