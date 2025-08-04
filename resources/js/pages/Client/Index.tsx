import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, Building2, Calendar, CheckCircle, MapPin, MessageSquare, Phone, User, Wrench, X, AlertCircle, Clock, Package, Store } from 'lucide-react';
import { useState } from 'react';

interface Company {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}

interface Store {
    id: number;
    name: string;
    address: string;
    contact_person?: string;
    contact_phone?: string;
    contact_email?: string;
    company_id: number;
}

interface Client {
    id: number;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    created_at?: string;
    status?: string;
    company?: Company | null;
    stores?: Store[];
}

interface Props {
    client?: Client;
    companies?: Company[];
    stores?: Store[];
    recentMaintenance?: any[];
    pendingRequests?: any[];
}

export default function ClientPage({ 
    client, 
    companies = [], 
    stores = [], 
    recentMaintenance = [],
    pendingRequests = []
}: Props) {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        request_type: '',
        description: '',
        priority: 'medium',
        preferred_date: '',
        contact_phone: client?.phone || '',
    });

    const handleRequestMaintenance = () => {
        setShowRequestForm(true);
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('client.maintenance.request'), {
            onSuccess: () => {
                setShowRequestForm(false);
                setShowSuccessPopup(true);
                setData({
                    request_type: '',
                    description: '',
                    priority: 'medium',
                    preferred_date: '',
                    contact_phone: client?.phone || '',
                });
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Client Dashboard" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="mx-auto px-12 py-8" style={{ maxWidth: 'calc(100vw - 100px)' }}>
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
                                    Selamat Datang, {client?.name}!
                                </h1>
                                <p className="mt-2 text-lg text-slate-600">
                                    Kelola dan pantau layanan maintenance filter Anda
                                </p>
                            </div>
                            <Button
                                onClick={handleRequestMaintenance}
                                className="group h-14 transform rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
                            >
                                <Wrench className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-12" />
                                Request Maintenance
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                        {/* Main Content */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <Card className="border-0 bg-gradient-to-br from-blue-50 to-white shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Total Stores</p>
                                                <p className="text-2xl font-bold text-slate-900">{stores.length}</p>
                                            </div>
                                            <Store className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-gradient-to-br from-green-50 to-white shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Active Maintenance</p>
                                                <p className="text-2xl font-bold text-slate-900">{recentMaintenance.length}</p>
                                            </div>
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-gradient-to-br from-amber-50 to-white shadow-xl">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Pending Requests</p>
                                                <p className="text-2xl font-bold text-slate-900">{pendingRequests.length}</p>
                                            </div>
                                            <Clock className="h-8 w-8 text-amber-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Stores Section */}
                            <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                                        <Store className="h-6 w-6 text-blue-600" />
                                        Toko Saya
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    {stores.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {stores.map((store) => (
                                                <div key={store.id} className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <h3 className="text-lg font-semibold text-slate-900">{store.name}</h3>
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                                            Active
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <MapPin className="mt-1 h-4 w-4 text-slate-500" />
                                                            <p className="text-sm text-slate-600">{store.address}</p>
                                                        </div>
                                                        {store.contact_person && (
                                                            <div className="flex items-center gap-3">
                                                                <User className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm text-slate-600">{store.contact_person}</p>
                                                            </div>
                                                        )}
                                                        {store.contact_phone && (
                                                            <div className="flex items-center gap-3">
                                                                <Phone className="h-4 w-4 text-slate-500" />
                                                                <p className="text-sm text-slate-600">{store.contact_phone}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="mx-auto h-12 w-12 text-slate-400" />
                                            <p className="mt-4 text-slate-600">Belum ada toko yang terdaftar</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Recent Maintenance */}
                            {recentMaintenance.length > 0 && (
                                <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
                                        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-900">
                                            <Activity className="h-6 w-6 text-green-600" />
                                            Maintenance Terbaru
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <div className="space-y-4">
                                            {recentMaintenance.map((maintenance, index) => (
                                                <div key={index} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-slate-900">{maintenance.store_name}</p>
                                                            <p className="text-sm text-slate-600">{maintenance.description}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className="bg-green-50 text-green-700">
                                                        Completed
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Client Info */}
                            <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                        <User className="h-5 w-5 text-blue-600" />
                                        Informasi Saya
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Nama</p>
                                            <p className="font-semibold text-slate-900">{client?.name}</p>
                                        </div>
                                        {client?.phone && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Telepon</p>
                                                <p className="font-semibold text-slate-900">{client.phone}</p>
                                            </div>
                                        )}
                                        {client?.email && (
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Email</p>
                                                <p className="font-semibold text-slate-900">{client.email}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-slate-600">Alamat</p>
                                            <p className="font-semibold text-slate-900">{client?.address}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Company Info */}
                            {client?.company && (
                                <Card className="border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                                            <Building2 className="h-5 w-5 text-indigo-600" />
                                            Perusahaan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-medium text-slate-600">Nama Perusahaan</p>
                                                <p className="font-semibold text-slate-900">{client.company.name}</p>
                                            </div>
                                            {client.company.address && (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Alamat</p>
                                                    <p className="font-semibold text-slate-900">{client.company.address}</p>
                                                </div>
                                            )}
                                            {client.company.phone && (
                                                <div>
                                                    <p className="text-sm font-medium text-slate-600">Telepon</p>
                                                    <p className="font-semibold text-slate-900">{client.company.phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>

                {/* Maintenance Request Modal */}
                {showRequestForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="mx-4 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900">Request Maintenance</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowRequestForm(false)}
                                    className="h-8 w-8 p-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmitRequest} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="request_type">Jenis Permintaan</Label>
                                        <Select value={data.request_type} onValueChange={(value) => setData('request_type', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih jenis permintaan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="filter_replacement">Penggantian Filter</SelectItem>
                                                <SelectItem value="maintenance_check">Pemeriksaan Rutin</SelectItem>
                                                <SelectItem value="repair">Perbaikan</SelectItem>
                                                <SelectItem value="emergency">Emergency</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.request_type && <p className="text-sm text-red-500">{errors.request_type}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="priority">Prioritas</Label>
                                        <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Rendah</SelectItem>
                                                <SelectItem value="medium">Sedang</SelectItem>
                                                <SelectItem value="high">Tinggi</SelectItem>
                                                <SelectItem value="urgent">Urgent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preferred_date">Tanggal yang Diinginkan</Label>
                                    <Input
                                        type="date"
                                        value={data.preferred_date}
                                        onChange={(e) => setData('preferred_date', e.target.value)}
                                    />
                                    {errors.preferred_date && <p className="text-sm text-red-500">{errors.preferred_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi Permintaan</Label>
                                    <Textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Jelaskan detail permintaan maintenance Anda..."
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_phone">Telepon Kontak</Label>
                                    <Input
                                        type="tel"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        placeholder="+62 821 1234 5678"
                                    />
                                    {errors.contact_phone && <p className="text-sm text-red-500">{errors.contact_phone}</p>}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowRequestForm(false)}
                                        className="flex-1"
                                    >
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Mengirim...' : 'Kirim Permintaan'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-slate-900">Permintaan Berhasil!</h3>
                            <p className="mb-6 text-slate-600">
                                Permintaan maintenance Anda telah berhasil dikirim. Tim kami akan segera menghubungi Anda.
                            </p>
                            <Button onClick={() => setShowSuccessPopup(false)} className="w-full">
                                Tutup
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
