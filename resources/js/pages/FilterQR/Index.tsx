import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';


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
    };
    filter: {
        id: number;
        name: string;
    };
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
    
    return (
        <AppLayout>
            <Head title="Filter QR Codes" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Filter QR Codes</h1>
                    <Link href={route('filter-qr.create')}>
                        <Button>Generate New QR Code</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filter QR Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 mb-4">
                            <Input
                                type="search"
                                placeholder="Search QR code or store..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />
                            <div className="max-w-xs">
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="expired">Expired</option>
                                </Select>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>QR Code</TableHead>
                                    <TableHead>Store</TableHead>
                                    <TableHead>Filter</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Scan</TableHead>
                                    <TableHead>Installation Date</TableHead>
                                    <TableHead>Expiry Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {qrs.data.map((qr) => (
                                    <TableRow key={qr.id}>
                                        <TableCell>{qr.qr_code}</TableCell>
                                        <TableCell>{qr.store.name}</TableCell>
                                        <TableCell>{qr.filter.name}</TableCell>
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
                                                {qr.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {qr.last_scan_at
                                                ? new Date(qr.last_scan_at).toLocaleDateString()
                                                : 'Never'}
                                        </TableCell>
                                        <TableCell>
                                            {qr.installation_date
                                                ? new Date(qr.installation_date).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {qr.expiry_date
                                                ? new Date(qr.expiry_date).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={route('filter-qr.show', qr.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {qrs.links && qrs.data.length > 0 && (
                            <div className="flex justify-center items-center gap-2 mt-6">
                                {qrs.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 border rounded-lg transition duration-150
                                            ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}
                                            ${!link.url ? 'text-gray-400 cursor-not-allowed' : ''}
                                        `}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        preserveScroll
                                        preserveState
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 