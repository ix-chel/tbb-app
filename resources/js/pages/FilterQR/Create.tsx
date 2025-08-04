import LoadingOverlay from '@/components/loading-overlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Clock, FileText, Filter, LoaderCircle, Mail, MapPin, Phone, QrCode, Store, User } from 'lucide-react';

interface Store {
    id: number;
    name: string;
    address: string;
    contact_person: string;
    contact_phone: string;
    contact_email: string;
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
        if (data.store_id === '0') {
            return;
        }
        post(route('FilterQR.store'), {
            onSuccess: (page) => {
                // The backend will redirect to the show page.
                // Inertia will automatically follow the redirect.
            },
        });
    };

    const handleStoreChange = (value: string) => {
        setData('store_id', value);

        // Find the selected store
        const selectedStore = stores.find((store) => store.id.toString() === value);
        // If a store is selected, auto-fill the contact information
        if (selectedStore) {
            setData({
                ...data,
                store_id: value,
                contact_person: selectedStore.contact_person || '',
                contact_phone: selectedStore.contact_phone || '',
                contact_email: selectedStore.contact_email || '',
            });
        }
    };

    const selectedStore = stores.find((store) => store.id.toString() === data.store_id);
    const selectedFilter = filters.find((filter) => filter.id.toString() === data.filter_id);

    return (
        <AppLayout>
            <Head title="Buat QR Code Baru" />
            <LoadingOverlay isLoading={processing} message="Membuat QR Code..." />

            {/* Hero Section */}
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    {/* Main Content */}
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                        {/* Form Section - Takes 2 columns on xl screens */}
                        <div className="xl:col-span-2">
                            <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                                <CardHeader className="rounded-t-lg bg-gradient-to-r from-cyan-500 to-blue-600 pt-8 pb-8 text-white">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                                        <QrCode className="h-7 w-7" />
                                        Form Pembuatan QR Code
                                    </CardTitle>
                                    <p>Buat QR Code untuk filter di lokasi tertentu dengan mudah dan cepat</p>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Store and Filter Selection */}
                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label htmlFor="store_id" className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                                    <Store className="h-5 w-5 text-cyan-600" />
                                                    Toko/Cabang
                                                </Label>
                                                <Select value={data.store_id} onValueChange={handleStoreChange}>
                                                    <SelectTrigger
                                                        className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.store_id ? 'border-red-400' : 'border-gray-200'}`}
                                                    >
                                                        <SelectValue placeholder="Pilih Toko" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="0" disabled>
                                                            Pilih Toko
                                                        </SelectItem>
                                                        {stores.map((store) => (
                                                            <SelectItem key={store.id} value={store.id.toString()} className="py-3">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{store.name}</span>
                                                                    <span className="text-sm text-gray-500">{store.address}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.store_id && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.store_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="filter_id" className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                                    <Filter className="h-5 w-5 text-cyan-600" />
                                                    Filter
                                                </Label>
                                                <Select value={data.filter_id} onValueChange={(value) => setData('filter_id', value)}>
                                                    <SelectTrigger
                                                        className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.filter_id ? 'border-red-400' : 'border-gray-200'}`}
                                                    >
                                                        <SelectValue placeholder="Pilih Filter" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="0" disabled>
                                                            Pilih Filter
                                                        </SelectItem>
                                                        {filters.map((filter) => (
                                                            <SelectItem key={filter.id} value={filter.id.toString()} className="py-3">
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{filter.name}</span>
                                                                    <span className="text-sm text-gray-500">{filter.type}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.filter_id && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.filter_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Date Fields */}
                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="installation_date"
                                                    className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                                                >
                                                    <Calendar className="h-5 w-5 text-cyan-600" />
                                                    Tanggal Instalasi
                                                </Label>
                                                <Input
                                                    id="installation_date"
                                                    type="date"
                                                    value={data.installation_date}
                                                    onChange={(e) => setData('installation_date', e.target.value)}
                                                    className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.installation_date ? 'border-red-400' : 'border-gray-200'}`}
                                                />
                                                {errors.installation_date && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.installation_date}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="expiry_date" className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                                    <Clock className="h-5 w-5 text-cyan-600" />
                                                    Tanggal Kadaluarsa
                                                </Label>
                                                <Input
                                                    id="expiry_date"
                                                    type="date"
                                                    value={data.expiry_date}
                                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                                    className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.expiry_date ? 'border-red-400' : 'border-gray-200'}`}
                                                />
                                                {errors.expiry_date && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.expiry_date}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <Label
                                                    htmlFor="contact_person"
                                                    className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                                                >
                                                    <User className="h-5 w-5 text-cyan-600" />
                                                    Nama PIC
                                                </Label>
                                                <Input
                                                    id="contact_person"
                                                    type="text"
                                                    value={data.contact_person}
                                                    onChange={(e) => setData('contact_person', e.target.value)}
                                                    placeholder="Nama penanggung jawab di lokasi"
                                                    className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.contact_person ? 'border-red-400' : 'border-gray-200'}`}
                                                />
                                                {errors.contact_person && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.contact_person}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="contact_phone"
                                                        className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                                                    >
                                                        <Phone className="h-5 w-5 text-cyan-600" />
                                                        Nomor Telepon PIC
                                                    </Label>
                                                    <Input
                                                        id="contact_phone"
                                                        type="tel"
                                                        value={data.contact_phone}
                                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                                        placeholder="08xxxxxxxxxx"
                                                        className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.contact_phone ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    {errors.contact_phone && (
                                                        <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                            <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                            {errors.contact_phone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <Label
                                                        htmlFor="contact_email"
                                                        className="flex items-center gap-2 text-lg font-semibold text-gray-800"
                                                    >
                                                        <Mail className="h-5 w-5 text-cyan-600" />
                                                        Email PIC
                                                    </Label>
                                                    <Input
                                                        id="contact_email"
                                                        type="email"
                                                        value={data.contact_email}
                                                        onChange={(e) => setData('contact_email', e.target.value)}
                                                        placeholder="email@example.com"
                                                        className={`h-14 rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.contact_email ? 'border-red-400' : 'border-gray-200'}`}
                                                    />
                                                    {errors.contact_email && (
                                                        <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                            <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                            {errors.contact_email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label htmlFor="notes" className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                                    <FileText className="h-5 w-5 text-cyan-600" />
                                                    Catatan
                                                </Label>
                                                <Textarea
                                                    id="notes"
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                    placeholder="Tambahkan catatan tambahan jika diperlukan"
                                                    className={`min-h-32 resize-none rounded-xl border-2 text-lg transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 ${errors.notes ? 'border-red-400' : 'border-gray-200'}`}
                                                />
                                                {errors.notes && (
                                                    <p className="mt-2 flex items-center gap-1 text-sm text-red-500">
                                                        <span className="h-1 w-1 rounded-full bg-red-500"></span>
                                                        {errors.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => window.history.back()}
                                                className="h-14 rounded-xl border-2 border-gray-300 text-lg transition-all duration-200 hover:border-gray-400"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-14 flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-lg text-white shadow-lg transition-all duration-200 hover:from-cyan-600 hover:to-blue-700 hover:shadow-xl"
                                            >
                                                {processing ? (
                                                    <>
                                                        <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                                                        Memproses...
                                                    </>
                                                ) : (
                                                    <>
                                                        <QrCode className="mr-3 h-6 w-6" />
                                                        Buat QR Code
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview Section */}
                        <div className="xl:col-span-1">
                            <Card className="sticky top-8 border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
                                <CardHeader className="rounded-t-lg bg-gradient-to-r from-cyan-500 to-blue-600 pt-6 pb-6 text-white">
                                    <CardTitle className="text-xl font-bold">Preview Informasi</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 p-6">
                                    {selectedStore ? (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                                <Store className="h-5 w-5 text-cyan-600" />
                                                Informasi Toko
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <span className="min-w-16 font-medium text-cyan-600">Nama:</span>
                                                    <span className="font-medium text-gray-800">{selectedStore.name}</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
                                                    <span className="text-gray-700">{selectedStore.address}</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-600" />
                                                    <span className="text-gray-700">{selectedStore.contact_person}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                            <Store className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                            <p className="text-gray-500">Pilih toko untuk melihat informasi</p>
                                        </div>
                                    )}

                                    {selectedFilter ? (
                                        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                                <Filter className="h-5 w-5 text-blue-600" />
                                                Informasi Filter
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="min-w-16 font-medium text-blue-600">Nama:</span>
                                                    <span className="font-medium text-gray-800">{selectedFilter.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="min-w-16 font-medium text-blue-600">Tipe:</span>
                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                                        {selectedFilter.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                                            <Filter className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                            <p className="text-gray-500">Pilih filter untuk melihat informasi</p>
                                        </div>
                                    )}

                                    {(data.installation_date || data.expiry_date) && (
                                        <div className="rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
                                            <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                                                <Calendar className="h-5 w-5 text-cyan-600" />
                                                Jadwal
                                            </h3>
                                            <div className="space-y-3">
                                                {data.installation_date && (
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="h-4 w-4 text-cyan-600" />
                                                        <div>
                                                            <span className="block text-sm font-medium text-cyan-600">Instalasi:</span>
                                                            <span className="font-medium text-gray-800">
                                                                {new Date(data.installation_date).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                                {data.expiry_date && (
                                                    <div className="flex items-center gap-3">
                                                        <Clock className="h-4 w-4 text-red-500" />
                                                        <div>
                                                            <span className="block text-sm font-medium text-red-500">Kadaluarsa:</span>
                                                            <span className="font-medium text-gray-800">
                                                                {new Date(data.expiry_date).toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!selectedStore && !selectedFilter && !data.installation_date && !data.expiry_date && (
                                        <div className="py-12 text-center">
                                            <QrCode className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                            <p className="text-lg text-gray-500">Isi form untuk melihat preview</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
