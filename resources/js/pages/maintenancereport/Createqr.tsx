import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface Store {
    id: number;
    name: string;
}

interface Technician {
    id: number;
    name: string;
}

interface Props {
    stores?: Store[];
    technicians?: Technician[];
    prefilled_store_id?: string | number;
    qr_code?: string;
}

const checklistItemsDefinition = [
    { id: 'check_leaks', label: 'Check for leaks' },
    { id: 'clean_housing', label: 'Clean filter housing' },
    { id: 'replace_cartridge', label: 'Replace filter cartridge' },
    { id: 'check_pressure', label: 'Check water pressure' },
];

export default function Create({ stores = [], technicians = [], prefilled_store_id, qr_code }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: prefilled_store_id || '',
        technician_id: '',
        equipment_status: 'good',
        filter_changed: false as boolean,
        filter_type: '',
        notes: '',
        photos: [] as File[],
        checklist_items: checklistItemsDefinition.reduce((acc, item) => {
            acc[item.id] = false;
            return acc;
        }, {} as Record<string, boolean>),
    });

    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('photos', files);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPhotoPreviews(newPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('technician.maintenance.store'), {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Maintenance Report" />

            <div className="min-h-screen bg-gradient-to-br from-white to-cyan-50/30">
                <div className="mx-auto px-12 py-8" style={{ maxWidth: 'calc(100vw - 100px)' }}>
                    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-8 py-6">
                                    <CardTitle className="flex items-center text-2xl font-bold text-slate-900">
                                        Create Maintenance Report
                                    </CardTitle>
                                    <p className="mt-2 text-slate-600">Fill in the details to create a new maintenance report.</p>
                                    {qr_code && (
                                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <p className="text-sm text-green-700">
                                                <strong>QR Code Scanned:</strong> {qr_code}
                                            </p>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            {/* Store Selection */}
                                            <div className="space-y-3">
                                                <Label htmlFor="store" className="text-lg font-semibold text-slate-800">Store</Label>
                                                <Select value={String(data.store_id)} onValueChange={(value) => setData('store_id', value)} disabled={!!prefilled_store_id}>
                                                    <SelectTrigger className="h-14">
                                                        {errors.store_id ? <span className="text-red-500">Select a store</span> : <SelectValue placeholder="Select a store" />}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {stores.map((store) => (
                                                            <SelectItem key={store.id} value={store.id.toString()}>{store.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.store_id && <p className="text-sm text-red-500">{errors.store_id}</p>}
                                            </div>

                                            {/* Technician Selection */}
                                            <div className="space-y-3">
                                                <Label htmlFor="technician" className="text-lg font-semibold text-slate-800">Technician</Label>
                                                <Select value={data.technician_id} onValueChange={(value) => setData('technician_id', value)}>
                                                    <SelectTrigger className="h-14">{errors.technician_id ? <span className="text-red-500">Select a technician</span> : <SelectValue placeholder="Select a technician" />}</SelectTrigger>
                                                    <SelectContent>
                                                        {technicians.map((technician) => (
                                                            <SelectItem key={technician.id} value={technician.id.toString()}>{technician.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.technician_id && <p className="text-sm text-red-500">{errors.technician_id}</p>}
                                            </div>
                                        </div>

                                        {/* Equipment Status */}
                                        <div className="space-y-3">
                                            <Label htmlFor="equipment_status" className="text-lg font-semibold text-slate-800">Equipment Status</Label>
                                            <Select value={data.equipment_status} onValueChange={(value) => setData('equipment_status', value)}>
                                                <SelectTrigger className="h-14"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="good">Good</SelectItem>
                                                    <SelectItem value="needs_attention">Needs Attention</SelectItem>
                                                    <SelectItem value="broken">Broken</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.equipment_status && <p className="text-sm text-red-500">{errors.equipment_status}</p>}
                                        </div>

                                        {/* Checklist */}
                                        <div className="space-y-3">
                                            <Label className="text-lg font-semibold text-slate-800">Maintenance Checklist</Label>
                                            <div className="grid grid-cols-1 gap-4 rounded-xl border-2 border-slate-200 bg-white/50 p-6 sm:grid-cols-2">
                                                {checklistItemsDefinition.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-3">
                                                        <Checkbox
                                                            id={item.id}
                                                            checked={data.checklist_items[item.id]}
                                                            onCheckedChange={(checked) => setData('checklist_items', { ...data.checklist_items, [item.id]: !!checked })}
                                                        />
                                                        <Label htmlFor={item.id} className="text-base font-medium text-slate-700">{item.label}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.checklist_items && <p className="text-sm text-red-500">{errors.checklist_items}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                            {/* Filter Changed */}
                                            <div className="space-y-3">
                                                <Label htmlFor="filter_changed" className="text-lg font-semibold text-slate-800">Filter Changed?</Label>
                                                <Select value={data.filter_changed ? 'yes' : 'no'} onValueChange={(value) => setData('filter_changed', Boolean(value === 'yes'))}>
                                                    <SelectTrigger className="h-14"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="no">No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.filter_changed && <p className="text-sm text-red-500">{errors.filter_changed}</p>}
                                            </div>

                                            {/* Filter Type */}
                                            {data.filter_changed && (
                                                <div className="space-y-3">
                                                    <Label htmlFor="filter_type" className="text-lg font-semibold text-slate-800">Filter Type</Label>
                                                    <Input
                                                        id="filter_type"
                                                        value={data.filter_type}
                                                        onChange={(e) => setData('filter_type', e.target.value)}
                                                        className="h-14"
                                                        placeholder="e.g., Carbon Block"
                                                    />
                                                    {errors.filter_type && <p className="text-sm text-red-500">{errors.filter_type}</p>}
                                                </div>
                                            )}
                                        </div>

                                        {/* Notes */}
                                        <div className="space-y-3">
                                            <Label htmlFor="notes" className="text-lg font-semibold text-slate-800">Notes</Label>
                                            <Textarea
                                                id="notes"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Describe the maintenance issue or work performed..."
                                                className="min-h-32"
                                            />
                                            {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="space-y-3">
                                            <Label htmlFor="photos" className="text-lg font-semibold text-slate-800">Upload Photos</Label>
                                            <Input
                                                id="photos"
                                                type="file"
                                                multiple
                                                onChange={handlePhotoChange}
                                                className="h-14"
                                            />
                                            {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
                                            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                {photoPreviews.map((preview, index) => (
                                                    <img key={index} src={preview} alt={`preview ${index}`} className="h-32 w-full rounded-lg object-cover" />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                                            <Button type="button" variant="outline" onClick={() => window.history.back()} className="h-14">Cancel</Button>
                                            <Button type="submit" disabled={processing} className="h-14 flex-1">
                                                {processing ? 'Creating Report...' : 'Create Report'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
