import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'; // Import tipe Event
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { api } from '@/lib/api';

// 1. Definisikan interface untuk data Store
interface StoreData {
    id: number | string; // Sesuaikan dengan tipe data Anda
    name: string;
    // Tambahkan properti lain dari store jika ada
}

// 2. Definisikan interface untuk FormData
interface ReportFormData {
    equipment_status: 'good' | 'needs_attention' | 'broken' | ''; // Lebih spesifik jika memungkinkan
    filter_changed: boolean;
    filter_type: string;
    notes: string;
    photos: File[]; // 'photos' akan berisi array dari objek File
}

export default function MaintenanceReportForm() {
    const { storeId } = useParams<{ storeId: string }>(); // Beri tipe pada params jika memungkinkan
    const navigate = useNavigate();
    // Gunakan interface StoreData
    const [store, setStore] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    // Gunakan interface ReportFormData
    const [formData, setFormData] = useState<ReportFormData>({
        equipment_status: '',
        filter_changed: false,
        filter_type: '',
        notes: '',
        photos: [] // Sekarang photos adalah File[]
    });

    useEffect(() => {
        loadStoreData();
    }, [storeId]);

    const loadStoreData = async () => {
        try {
            // Beri tipe pada response API
            const response = await api.get<{ data: StoreData }>(`/stores/${storeId}`);
            setStore(response.data.data);
        } catch (error) {
            toast.error('Gagal memuat data store');
            navigate('/technician/maintenance');
        } finally {
            setLoading(false);
        }
    };

    // 3. Beri tipe pada parameter event 'e'
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            // Cara lebih aman dan type-safe untuk append ke FormData
            formDataToSend.append('equipment_status', formData.equipment_status);
            formDataToSend.append('filter_changed', formData.filter_changed.toString()); // Konversi boolean ke string
            formDataToSend.append('filter_type', formData.filter_type);
            formDataToSend.append('notes', formData.notes);

            formData.photos.forEach(photo => {
                formDataToSend.append('photos[]', photo);
            });

            await api.post(`/stores/${storeId}/maintenancereports`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Laporan maintenance berhasil disimpan');
            navigate('/technician/maintenance');
        } catch (error) {
            toast.error('Gagal menyimpan laporan maintenance');
        } finally {
            setSubmitting(false);
        }
    };

    // 3. Beri tipe pada parameter event 'e'
    const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        // Pastikan e.target.files tidak null
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...files] // Ini sekarang type-safe
            }));
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto py-6">
            <Card>
                <CardHeader>
                    {/* Akses store.name sekarang type-safe */}
                    <CardTitle>Laporan Maintenance - {store?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Status Peralatan</Label>
                            <Select
                                value={formData.equipment_status}
                                // Beri tipe pada 'value' di onValueChange jika perlu,
                                // tapi inferensi dari SelectItem value biasanya cukup
                                onValueChange={value => setFormData(prev => ({ ...prev, equipment_status: value as ReportFormData['equipment_status'] }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih status peralatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="good">Baik</SelectItem>
                                    <SelectItem value="needs_attention">Perlu Perhatian</SelectItem>
                                    <SelectItem value="broken">Rusak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Filter Diganti</Label>
                            <Select
                                value={formData.filter_changed.toString()} // Select value biasanya string
                                onValueChange={value => setFormData(prev => ({ ...prev, filter_changed: value === 'true' }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Apakah filter diganti?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Ya</SelectItem>
                                    <SelectItem value="false">Tidak</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.filter_changed && (
                            <div className="space-y-2">
                                <Label>Tipe Filter</Label>
                                <Input
                                    value={formData.filter_type}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, filter_type: e.target.value }))}
                                    placeholder="Masukkan tipe filter yang diganti"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Catatan</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Masukkan catatan tambahan"
                                rows={4}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Foto</Label>
                            <Input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                            {formData.photos.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {/* 'photo' sekarang bertipe File */}
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/technician/maintenance')}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? 'Menyimpan...' : 'Simpan Laporan'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}