import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Store {
    id: number;
    name: string;
}

interface Props {
    stores?: Store[];
}

export default function Create({ stores = [] }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        store_id: '',
        description: '',
        maintenance_type: '',
        findings: '',
        actions_taken: '',
        recommendations: '',
        images: [] as File[],
    });

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setData('images', [...data.images, ...files]);
            
            // Create preview URLs
            const previews = files.map(file => URL.createObjectURL(file));
            setImagePreview([...imagePreview, ...previews]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('maintenance.reports.store'));
    };

    return (
        <>
            <Head title="Create Maintenance Report" />
            
            <div className="container mx-auto py-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Create Maintenance Report</h1>

                    <Card>
                        <CardHeader>
                            <CardTitle>New Maintenance Report</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="store">Store</Label>
                                    <Select
                                        value={data.store_id}
                                        onValueChange={(value) => setData('store_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a store" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stores.map((store) => (
                                                <SelectItem key={store.id} value={store.id.toString()}>
                                                    {store.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.store_id && (
                                        <p className="text-sm text-red-500">{errors.store_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maintenance_type">Maintenance Type</Label>
                                    <Select
                                        value={data.maintenance_type}
                                        onValueChange={(value) => setData('maintenance_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select maintenance type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="preventive">Preventive</SelectItem>
                                            <SelectItem value="corrective">Corrective</SelectItem>
                                            <SelectItem value="emergency">Emergency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.maintenance_type && (
                                        <p className="text-sm text-red-500">{errors.maintenance_type}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe the maintenance issue..."
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">{errors.description}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="findings">Findings</Label>
                                    <Textarea
                                        id="findings"
                                        value={data.findings}
                                        onChange={(e) => setData('findings', e.target.value)}
                                        placeholder="What did you find during the maintenance?"
                                    />
                                    {errors.findings && (
                                        <p className="text-sm text-red-500">{errors.findings}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="actions_taken">Actions Taken</Label>
                                    <Textarea
                                        id="actions_taken"
                                        value={data.actions_taken}
                                        onChange={(e) => setData('actions_taken', e.target.value)}
                                        placeholder="What actions did you take?"
                                    />
                                    {errors.actions_taken && (
                                        <p className="text-sm text-red-500">{errors.actions_taken}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="recommendations">Recommendations</Label>
                                    <Textarea
                                        id="recommendations"
                                        value={data.recommendations}
                                        onChange={(e) => setData('recommendations', e.target.value)}
                                        placeholder="What are your recommendations?"
                                    />
                                    {errors.recommendations && (
                                        <p className="text-sm text-red-500">{errors.recommendations}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="images">Images</Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {errors.images && (
                                        <p className="text-sm text-red-500">{errors.images}</p>
                                    )}
                                    
                                    {imagePreview.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {imagePreview.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Report'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
} 