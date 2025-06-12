import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Link } from '@inertiajs/react';

interface MaintenanceReport {
    id: number;
    store_name: string;
    technician_name: string;
    status: 'pending' | 'approved' | 'revision';
    created_at: string;
    description: string;
    maintenance_type: string;
    findings: string;
    actions_taken: string;
    recommendations: string;
    images: string[];
    comments?: {
        id: number;
        user_name: string;
        content: string;
        created_at: string;
    }[];
}

interface Props {
    report: MaintenanceReport;
    canApprove: boolean;
}

export default function Show({ report, canApprove }: Props) {
    return (
        <>
            <Head title={`Maintenance Report #${report.id}`} />
            
            <div className="container mx-auto py-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Maintenance Report #{report.id}</h1>
                        <div className="space-x-2">
                            <Button variant="outline" asChild>
                                <Link href={route('maintenance.reports.index')}>
                                    Back to List
                                </Link>
                            </Button>
                            {canApprove && (
                                <>
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            // Handle approve
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                                        onClick={() => {
                                            // Handle revision request
                                        }}
                                    >
                                        Request Revision
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Report Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Store</dt>
                                        <dd className="mt-1">{report.store_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Technician</dt>
                                        <dd className="mt-1">{report.technician_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <Badge variant={
                                                report.status === 'approved' ? 'default' :
                                                report.status === 'revision' ? 'destructive' : 'secondary'
                                            }
                                            className={
                                                report.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                report.status === 'revision' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }
                                            >
                                                {report.status}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                                        <dd className="mt-1">
                                            {format(new Date(report.created_at), 'dd MMMM yyyy', { locale: id })}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Maintenance Type</dt>
                                        <dd className="mt-1 capitalize">{report.maintenance_type}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{report.description}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Findings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{report.findings}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions Taken</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{report.actions_taken}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap">{report.recommendations}</p>
                            </CardContent>
                        </Card>

                        {report.images.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Images</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        {report.images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`Maintenance image ${index + 1}`}
                                                className="w-full h-48 object-cover rounded"
                                            />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {report.comments && report.comments.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Comments</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {report.comments.map((comment) => (
                                            <div key={comment.id} className="border-b pb-4 last:border-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-medium">{comment.user_name}</span>
                                                        <span className="text-sm text-gray-500 ml-2">
                                                            {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 