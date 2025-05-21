import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Props {
    stores: Store[];
    filters: Filter[];
}

export default function Create({ stores, filters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: '',
        filter_id: '',
        installation_date: '',
        expiry_date: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('filter-qr.store'));
    };

    return (
        <AppLayout>
            <Head title="Generate QR Code" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Generate QR Code</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Generate New QR Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="store_id">Store</Label>
                                    <Select
                                        value={data.store_id}
                                        onValueChange={(value) => setData('store_id', value)}
                                    >
                                        <option value="">Select Store</option>
                                        {stores.map((store) => (
                                            <option key={store.id} value={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="filter_id">Filter</Label>
                                    <Select
                                        value={data.filter_id}
                                        onValueChange={(value) => setData('filter_id', value)}
                                    >
                                        <option value="">Select Filter</option>
                                        {filters.map((filter) => (
                                            <option key={filter.id} value={filter.id}>
                                                {filter.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="installation_date">Installation Date</Label>
                                    <Input
                                        id="installation_date"
                                        type="date"
                                        value={data.installation_date}
                                        onChange={(e) => setData('installation_date', e.target.value)}
                                        className={errors.installation_date ? "border-red-500" : ""}
                                    />
                                    {errors.installation_date && (
                                        <p className="text-sm text-red-500">{errors.installation_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expiry_date">Expiry Date</Label>
                                    <Input
                                        id="expiry_date"
                                        type="date"
                                        value={data.expiry_date}
                                        onChange={(e) => setData('expiry_date', e.target.value)}
                                        className={errors.expiry_date ? "border-red-500" : ""}
                                    />
                                    {errors.expiry_date && (
                                        <p className="text-sm text-red-500">{errors.expiry_date}</p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className={errors.notes ? "border-red-500" : ""}
                                    />
                                    {errors.notes && (
                                        <p className="text-sm text-red-500">{errors.notes}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    Generate QR Code
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 