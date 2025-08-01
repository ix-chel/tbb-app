import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { QrCode, Download, LoaderCircle, Calendar, MapPin, User, Phone, Mail, FileText } from 'lucide-react';
import LoadingOverlay from '@/components/loading-overlay';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Store {
    id: number;
    name: string;
    address: string;
    contact_person: string;
}

interface Filter {
    id: number;
    name: string;
    type: string;
}

interface FilterQR {
    id: number;
    qr_code: string;
    store_id: number;
    store?: Store;
    filter_id: number;
    filter?: Filter;
    status: string;
    last_scan_at: string | null;
    installation_date: string | null;
    expiry_date: string | null;
    notes: string | null;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    qr_path?: string; // Added qr_path to the interface
}

interface Props {
    qr: FilterQR;
}

export default function Show({ qr }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: qr.status || 'active',
        notes: qr.notes || '',
        contact_person: qr.contact_person || '',
        contact_phone: qr.contact_phone || '',
        contact_email: qr.contact_email || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.status) {
            return;
        }
        put(route('FilterQR.update', qr.id));
    };

    // Tambahkan path gambar QR code
    const qrImagePath = qr.qr_path
        ? `/storage/${qr.qr_path}`
        : `/storage/qrcodes/${qr.id}.png`;

    return (
        <AppLayout>
            <Head title="Detail QR Code" />
            <LoadingOverlay isLoading={processing} message="Memperbarui status..." />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Detail QR Code</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Informasi lengkap tentang QR Code filter
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                        >
                            Kembali
                        </Button>
                        <a href={route('FilterQR.download', { filterQR: qr.id })} target="_blank" rel="noopener noreferrer">
                            <Button variant="default">
                                <Download className="w-4 h-4 mr-2" />
                                Download QR
                            </Button>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="p-4 bg-white rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                        {/* Gambar QR code asli */}
                                        <img
                                            src={qrImagePath}
                                            alt={`QR Code ${qr.id}`}
                                            className="w-32 h-32 object-contain"
                                            onError={(e) => {
                                                // fallback jika gambar tidak ditemukan
                                                (e.target as HTMLImageElement).src = '/storage/qrcodes/placeholder.png';
                                            }}
                                            onLoad={(e) => {
                                                console.log('QR Code loaded successfully:', qrImagePath);
                                            }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">ID: {qr.qr_code}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Toko/Cabang</h3>
                                    <div className="mt-1">
                                        <div className="font-medium text-gray-900 dark:text-white">{qr.store?.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{qr.store?.address}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            PIC: {qr.store?.contact_person}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Filter</h3>
                                    <div className="mt-1">
                                        <div className="font-medium text-gray-900 dark:text-white">{qr.filter?.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{qr.filter?.type}</div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kontak</h3>
                                    <div className="mt-1 space-y-2">
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
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                                        <Badge
                                            variant={
                                                qr.status === 'active'
                                                    ? 'default'
                                                    : qr.status === 'inactive'
                                                    ? 'secondary'
                                                    : 'destructive'
                                            }
                                            className="mt-1"
                                        >
                                            {qr.status === 'active' ? 'Aktif' : 
                                             qr.status === 'inactive' ? 'Nonaktif' : 
                                             'Kadaluarsa'}
                                        </Badge>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Terakhir Diperiksa</h3>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {qr.last_scan_at
                                                ? new Date(qr.last_scan_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                  })
                                                : 'Belum pernah'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Instalasi</h3>
                                        <div className="mt-1 flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {qr.installation_date
                                                ? new Date(qr.installation_date).toLocaleDateString('id-ID')
                                                : '-'}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal Kadaluarsa</h3>
                                        <div className="mt-1 flex items-center text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            {qr.expiry_date
                                                ? new Date(qr.expiry_date).toLocaleDateString('id-ID')
                                                : '-'}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Catatan</h3>
                                    <div className="mt-1 flex items-start text-sm">
                                        <FileText className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                                        <p className="whitespace-pre-wrap">{qr.notes || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Perbarui Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value) => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Nonaktif</SelectItem>
                                            <SelectItem value="expired">Kadaluarsa</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-500">{errors.status}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_person">Nama Kontak</Label>
                                    <Input
                                        type="text"
                                        id="contact_person"
                                        value={data.contact_person}
                                        onChange={(e) => setData('contact_person', e.target.value)}
                                        placeholder="Masukkan nama kontak"
                                    />
                                    {errors.contact_person && (
                                        <p className="text-sm text-red-500">{errors.contact_person}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Nomor Telepon</Label>
                                    <Input
                                        type="tel"
                                        id="contact_phone"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.contact_phone && (
                                        <p className="text-sm text-red-500">{errors.contact_phone}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_email">Email</Label>
                                    <Input
                                        type="email"
                                        id="contact_email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        placeholder="Masukkan email"
                                    />
                                    {errors.contact_email && (
                                        <p className="text-sm text-red-500">{errors.contact_email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Catatan</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Masukkan catatan tambahan"
                                        rows={4}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">{errors.notes}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                                            Memperbarui...
                                        </>
                                    ) : (
                                        'Perbarui Status'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 