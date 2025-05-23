import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { QrCode, LoaderCircle } from 'lucide-react';
import LoadingOverlay from '@/components/loading-overlay';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

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

interface Props {
    stores: Store[];
    filters: Filter[];
}

export default function Create({ stores, filters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: '0',
        filter_id: '0',
        installation_date: '',
        expiry_date: '',
        notes: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.store_id === '0' || data.filter_id === '0') {
            return;
        }
        post(route('FilterQR.store'));
    };

    const selectedStore = stores.find(store => store.id.toString() === data.store_id);
    const selectedFilter = filters.find(filter => filter.id.toString() === data.filter_id);

    return (
        <AppLayout>
            <Head title="Buat QR Code Baru" />
            <LoadingOverlay isLoading={processing} message="Membuat QR Code..." />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Buat QR Code Baru</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Buat QR Code baru untuk filter di lokasi tertentu
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle>Form Pembuatan QR Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="store_id" className="text-sm font-medium">Toko/Cabang</Label>
                                        <Select
                                            value={data.store_id}
                                            onValueChange={(value) => setData('store_id', value)}
                                        >
                                            <SelectTrigger className={errors.store_id ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Pilih Toko" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0" disabled>Pilih Toko</SelectItem>
                                                {stores.map((store) => (
                                                    <SelectItem key={store.id} value={store.id.toString()}>
                                                        {store.name} - {store.address}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.store_id && (
                                            <p className="text-sm text-red-500 mt-1">{errors.store_id}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="filter_id" className="text-sm font-medium">Filter</Label>
                                        <Select
                                            value={data.filter_id}
                                            onValueChange={(value) => setData('filter_id', value)}
                                        >
                                            <SelectTrigger className={errors.filter_id ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Pilih Filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0" disabled>Pilih Filter</SelectItem>
                                                {filters.map((filter) => (
                                                    <SelectItem key={filter.id} value={filter.id.toString()}>
                                                        {filter.name} - {filter.type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.filter_id && (
                                            <p className="text-sm text-red-500 mt-1">{errors.filter_id}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="installation_date" className="text-sm font-medium">Tanggal Instalasi</Label>
                                            <Input
                                                id="installation_date"
                                                type="date"
                                                value={data.installation_date}
                                                onChange={(e) => setData('installation_date', e.target.value)}
                                                className={errors.installation_date ? "border-red-500" : ""}
                                            />
                                            {errors.installation_date && (
                                                <p className="text-sm text-red-500 mt-1">{errors.installation_date}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="expiry_date" className="text-sm font-medium">Tanggal Kadaluarsa</Label>
                                            <Input
                                                id="expiry_date"
                                                type="date"
                                                value={data.expiry_date}
                                                onChange={(e) => setData('expiry_date', e.target.value)}
                                                className={errors.expiry_date ? "border-red-500" : ""}
                                            />
                                            {errors.expiry_date && (
                                                <p className="text-sm text-red-500 mt-1">{errors.expiry_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="contact_person" className="text-sm font-medium">Nama PIC</Label>
                                        <Input
                                            id="contact_person"
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            placeholder="Nama penanggung jawab di lokasi"
                                            className={errors.contact_person ? "border-red-500" : ""}
                                        />
                                        {errors.contact_person && (
                                            <p className="text-sm text-red-500 mt-1">{errors.contact_person}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="contact_phone" className="text-sm font-medium">Nomor Telepon PIC</Label>
                                            <Input
                                                id="contact_phone"
                                                type="tel"
                                                value={data.contact_phone}
                                                onChange={(e) => setData('contact_phone', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                className={errors.contact_phone ? "border-red-500" : ""}
                                            />
                                            {errors.contact_phone && (
                                                <p className="text-sm text-red-500 mt-1">{errors.contact_phone}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="contact_email" className="text-sm font-medium">Email PIC</Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                value={data.contact_email}
                                                onChange={(e) => setData('contact_email', e.target.value)}
                                                placeholder="email@example.com"
                                                className={errors.contact_email ? "border-red-500" : ""}
                                            />
                                            {errors.contact_email && (
                                                <p className="text-sm text-red-500 mt-1">{errors.contact_email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="notes" className="text-sm font-medium">Catatan</Label>
                                        <Textarea
                                            id="notes"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="Tambahkan catatan tambahan jika diperlukan"
                                            className={errors.notes ? "border-red-500" : ""}
                                        />
                                        {errors.notes && (
                                            <p className="text-sm text-red-500 mt-1">{errors.notes}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Batal
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="w-4 h-4 animate-spin mr-2" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <QrCode className="w-4 h-4 mr-2" />
                                                Buat QR Code
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle>Preview Informasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedStore && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Informasi Toko</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-500 dark:text-gray-400">Nama:</span> {selectedStore.name}</p>
                                            <p><span className="text-gray-500 dark:text-gray-400">Alamat:</span> {selectedStore.address}</p>
                                            <p><span className="text-gray-500 dark:text-gray-400">PIC:</span> {selectedStore.contact_person}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedFilter && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Informasi Filter</h3>
                                        <div className="space-y-2 text-sm">
                                            <p><span className="text-gray-500 dark:text-gray-400">Nama:</span> {selectedFilter.name}</p>
                                            <p><span className="text-gray-500 dark:text-gray-400">Tipe:</span> {selectedFilter.type}</p>
                                        </div>
                                    </div>
                                )}

                                {data.installation_date && (
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Jadwal</h3>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <span className="text-gray-500 dark:text-gray-400">Instalasi:</span>{' '}
                                                {new Date(data.installation_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            {data.expiry_date && (
                                                <p>
                                                    <span className="text-gray-500 dark:text-gray-400">Kadaluarsa:</span>{' '}
                                                    {new Date(data.expiry_date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 