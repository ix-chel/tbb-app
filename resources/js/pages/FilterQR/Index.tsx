import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Download, Eye, QrCode, User, Phone, Mail } from 'lucide-react';
import LoadingOverlay from '@/components/loading-overlay';

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

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Manajemen QR Code Filter</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Kelola QR Code untuk setiap filter di setiap lokasi
                        </p>
                    </div>
                    <Link href={route('FilterQR.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <QrCode className="w-4 h-4 mr-2" />
                            Buat QR Code Baru
                        </Button>
                    </Link>
                </div>

                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Daftar QR Code Filter</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-6">
                            <Input
                                type="search"
                                placeholder="Cari QR code, toko, atau alamat..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <div className="max-w-xs">
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter berdasarkan status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Nonaktif</SelectItem>
                                        <SelectItem value="expired">Kadaluarsa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>QR Code</TableHead>
                                        <TableHead>Toko</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Filter</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Terakhir Diperiksa</TableHead>
                                        <TableHead>Tanggal Instalasi</TableHead>
                                        <TableHead>Tanggal Kadaluarsa</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {qrs.data.map((qr) => (
                                        <TableRow key={qr.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <QrCode className="w-8 h-8 text-gray-400" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{qr.store.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        PIC: {qr.store.contact_person}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{qr.store.address}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{qr.filter.name}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {qr.filter.type}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <User className="w-4 h-4 mr-2 text-gray-400" />
                                                        {qr.contact_person || '-'}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                        {qr.contact_phone || '-'}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        {qr.contact_email || '-'}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        qr.status === 'active'
                                                            ? 'default'
                                                            : qr.status === 'inactive'
                                                            ? 'secondary'
                                                            : 'destructive'
                                                    }
                                                >
                                                    {qr.status === 'active' ? 'Aktif' : 
                                                     qr.status === 'inactive' ? 'Nonaktif' : 
                                                     'Kadaluarsa'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {qr.last_scan_at
                                                    ? new Date(qr.last_scan_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                      })
                                                    : 'Belum pernah'}
                                            </TableCell>
                                            <TableCell>
                                                {qr.installation_date
                                                    ? new Date(qr.installation_date).toLocaleDateString('id-ID')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {qr.expiry_date
                                                    ? new Date(qr.expiry_date).toLocaleDateString('id-ID')
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('FilterQR.show', qr.id)}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                        onClick={() => {
                                                            setIsLoading(true);
                                                            window.location.href = route('FilterQR.download', qr.id);
                                                            setIsLoading(false);
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {qrs.links && qrs.data.length > 0 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                {qrs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 border rounded-lg transition duration-150
                                            ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300'}
                                            ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                        preserveState
                                    />
                                ))}
                            </div>
                        )}

                        {qrs.data.length === 0 && (
                            <div className="text-center py-12">
                                <QrCode className="w-12 h-12 mx-auto text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Tidak ada QR Code</h3>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    Mulai dengan membuat QR Code baru untuk filter Anda
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 