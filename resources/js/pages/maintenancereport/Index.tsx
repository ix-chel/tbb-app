import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
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
    filteredStore?: {
        id: number;
        name: string;
    };
}

export default function Index({ reports, filteredStore }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-cyan-50 text-cyan-700 border-cyan-200';
            case 'revision':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <AppLayout>
            <Head title="Maintenance Reports" />

            <div className="min-h-screen bg-gradient-to-br from-white to-cyan-50/30">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {filteredStore ? `Maintenance Reports - ${filteredStore.name}` : 'Maintenance Reports'}
                            </h1>
                            <p className="text-sm text-slate-600 sm:text-base">
                                {filteredStore 
                                    ? `Maintenance activities for ${filteredStore.name}` 
                                    : 'Manage and track all maintenance activities across stores'
                                }
                            </p>
                            {filteredStore && (
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">
                                        Filtered by Store
                                    </Badge>
                                    <Link 
                                        href={route('maintenance.reports.index')}
                                        className="text-sm text-cyan-600 hover:text-cyan-700 underline"
                                    >
                                        View All Reports
                                    </Link>
                                </div>
                            )}
                        </div>
                        <Button
                            asChild
                            className="rounded-xl bg-cyan-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all duration-200 hover:bg-cyan-700 hover:shadow-xl"
                        >
                            <Link href={route('maintenance.reports.create')}>
                                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create New Report
                            </Link>
                        </Button>
                    </div>

                    {/* Main Table Card */}
                    <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                        <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-6 py-6">
                            <CardTitle className="flex items-center text-xl font-semibold text-slate-900">
                                <svg className="mr-3 h-6 w-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                All Maintenance Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Desktop Table */}
                            <div className="hidden overflow-x-auto lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 hover:bg-slate-50/80">
                                            <TableHead className="px-6 py-4 font-semibold text-slate-700">Store</TableHead>
                                            <TableHead className="px-6 py-4 font-semibold text-slate-700">Technician</TableHead>
                                            <TableHead className="px-6 py-4 font-semibold text-slate-700">Status</TableHead>
                                            <TableHead className="px-6 py-4 font-semibold text-slate-700">Date</TableHead>
                                            <TableHead className="px-6 py-4 font-semibold text-slate-700">Description</TableHead>
                                            <TableHead className="px-6 py-4 text-center font-semibold text-slate-700">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reports.data.map((report, index) => (
                                            <TableRow
                                                key={report.id}
                                                className="border-b border-slate-100 transition-colors duration-200 hover:bg-cyan-50/30"
                                            >
                                                <TableCell className="px-6 py-4 font-medium text-slate-900">{report.store_name}</TableCell>
                                                <TableCell className="px-6 py-4 text-slate-700">{report.technician_name}</TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <Badge
                                                        className={`${getStatusBadge(report.status)} rounded-full border px-3 py-1 text-xs font-medium capitalize`}
                                                    >
                                                        {report.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-slate-700">
                                                    {format(new Date(report.created_at), 'dd MMMM yyyy', { locale: id })}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-slate-700">
                                                    <div className="max-w-xs truncate" title={report.description}>
                                                        {report.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-center">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 font-medium text-cyan-700 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-100"
                                                    >
                                                        <Link href={route('maintenance.reports.show', report.id)}>
                                                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                                />
                                                            </svg>
                                                            View Details
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="space-y-4 p-4 lg:hidden">
                                {reports.data.map((report) => (
                                    <Card key={report.id} className="border border-slate-200 shadow-md transition-all duration-200 hover:shadow-lg">
                                        <CardContent className="p-4">
                                            <div className="mb-3 flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="mb-1 text-lg font-semibold text-slate-900">{report.store_name}</h3>
                                                    <p className="text-sm text-slate-600">by {report.technician_name}</p>
                                                </div>
                                                <Badge
                                                    className={`${getStatusBadge(report.status)} rounded-full border px-3 py-1 text-xs font-medium capitalize`}
                                                >
                                                    {report.status}
                                                </Badge>
                                            </div>

                                            <div className="mb-3">
                                                <p className="line-clamp-2 text-sm text-slate-700">{report.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-500">
                                                    {format(new Date(report.created_at), 'dd MMM yyyy', { locale: id })}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                    className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700 transition-all duration-200 hover:border-cyan-300 hover:bg-cyan-100"
                                                >
                                                    <Link href={route('maintenance.reports.show', report.id)}>View Details</Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pagination Info */}
                    {reports.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm">
                                <p className="text-sm text-slate-600">
                                    Page {reports.current_page} of {reports.last_page}
                                    <span className="mx-2">•</span>
                                    {reports.total} total reports
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
