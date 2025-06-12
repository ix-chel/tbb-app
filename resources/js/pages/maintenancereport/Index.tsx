import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface MaintenanceReport {
    id: number;
    store_name: string;
    technician_name: string;
    status: 'pending' | 'approved' | 'revision';
    created_at: string;
    description: string;
}

interface PaginatedData {
    data: MaintenanceReport[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    reports: PaginatedData;
}

export default function Index({ reports }: Props) {
    return (
        <>
            <Head title="Maintenance Reports" />
            
            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Maintenance Reports</h1>
                    <Button asChild>
                        <Link href={route('maintenance.reports.create')}>
                            Create New Report
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Maintenance Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Store</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.store_name}</TableCell>
                                        <TableCell>{report.technician_name}</TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(report.created_at), 'dd MMMM yyyy', { locale: id })}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {report.description}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={route('maintenance.reports.show', report.id)}>
                                                    View Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
} 