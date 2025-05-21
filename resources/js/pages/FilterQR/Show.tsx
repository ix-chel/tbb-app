import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface Store {
    id: number;
    name: string;
}

interface Filter {
    id: number;
    name: string;
}

interface FilterQR {
    id: number;
    qr_code: string;
    status: 'active' | 'inactive' | 'expired';
    last_scan_at: string | null;
    installation_date: string | null;
    expiry_date: string | null;
    notes: string | null;
    store: Store;
    filter: Filter;
}

interface Props {
    qr: FilterQR;
}

export default function Show({ qr }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        status: qr.status,
        notes: qr.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('filter-qr.update', qr.id));
    };

    return (
        <AppLayout>
            <Head title="QR Code Details" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">QR Code Details</h1>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Back
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>QR Code Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>QR Code</Label>
                                    <p className="text-lg font-mono">{qr.qr_code}</p>
                                </div>

                                <div>
                                    <Label>Store</Label>
                                    <p className="text-lg">{qr.store.name}</p>
                                </div>

                                <div>
                                    <Label>Filter</Label>
                                    <p className="text-lg">{qr.filter.name}</p>
                                </div>

                                <div>
                                    <Label>Status</Label>
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
                                </div>

                                <div>
                                    <Label>Last Scan</Label>
                                    <p className="text-lg">
                                        {qr.last_scan_at
                                            ? new Date(qr.last_scan_at).toLocaleString()
                                            : 'Never'}
                                    </p>
                                </div>

                                <div>
                                    <Label>Installation Date</Label>
                                    <p className="text-lg">
                                        {qr.installation_date
                                            ? new Date(qr.installation_date).toLocaleDateString()
                                            : '-'}
                                    </p>
                                </div>

                                <div>
                                    <Label>Expiry Date</Label>
                                    <p className="text-lg">
                                        {qr.expiry_date
                                            ? new Date(qr.expiry_date).toLocaleDateString()
                                            : '-'}
                                    </p>
                                </div>

                                <div>
                                    <Label>Notes</Label>
                                    <p className="text-lg">{qr.notes || '-'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Update Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'active' | 'inactive' | 'expired') => setData('status', value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="expired">Expired</option>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className={`w-full min-h-[100px] p-2 border rounded-md ${errors.notes ? 'border-red-500' : ''}`}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">{errors.notes}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        Update Status
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 