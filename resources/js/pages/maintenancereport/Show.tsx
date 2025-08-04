import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, ArrowLeft, Building2, Calendar, CheckCircle, Clock, User, Wrench } from 'lucide-react';

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
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'revision':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'revision':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-sky-50 text-sky-700 border-sky-200';
        }
    };

    return (
        <>
            <Head title={`Maintenance Report #${report.id}`} />

            <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white">
                <div className="px-12 py-8">
                    {/* Header Section */}
                    <div className="mb-8 rounded-2xl border border-sky-100 bg-white p-8 shadow-sm">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="outline" size="sm" asChild className="border-sky-200 text-sky-700 hover:bg-sky-50">
                                    <Link href={route('maintenance.reports.index')}>
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back to Reports
                                    </Link>
                                </Button>
                                <div className="h-8 w-px bg-sky-200"></div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Maintenance Report
                                        <span className="ml-2 text-sky-600">#{report.id}</span>
                                    </h1>
                                    <p className="mt-1 text-gray-600">Detailed maintenance report overview</p>
                                </div>
                            </div>

                            {canApprove && (
                                <div className="flex gap-3">
                                    <Button
                                        size="lg"
                                        className="bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 hover:shadow-xl"
                                        onClick={() => {
                                            // Handle approve
                                        }}
                                    >
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Approve Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-amber-300 text-amber-700 shadow-lg transition-all duration-200 hover:bg-amber-50 hover:shadow-xl"
                                        onClick={() => {
                                            // Handle revision request
                                        }}
                                    >
                                        <AlertCircle className="mr-2 h-5 w-5" />
                                        Request Revision
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid gap-8">
                        {/* Report Overview */}
                        <Card className="border-sky-100 bg-white shadow-sm">
                            <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white pb-6">
                                <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
                                    <Building2 className="h-5 w-5 text-sky-600" />
                                    Report Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Building2 className="h-4 w-4" />
                                            Store Location
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{report.store_name}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <User className="h-4 w-4" />
                                            Technician
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">{report.technician_name}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            Report Date
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {format(new Date(report.created_at), 'dd MMMM yyyy', { locale: id })}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Wrench className="h-4 w-4" />
                                            Maintenance Type
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900 capitalize">{report.maintenance_type}</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            {getStatusIcon(report.status)}
                                            Status
                                        </div>
                                        <Badge
                                            className={`${getStatusColor(report.status)} border px-4 py-2 text-sm font-medium tracking-wide uppercase`}
                                        >
                                            {report.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Sections */}
                        <div className="grid gap-8">
                            {/* Description */}
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Description</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="prose max-w-none">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700">{report.description}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Findings */}
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Findings</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="prose max-w-none">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700">{report.findings}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions Taken */}
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Actions Taken</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="prose max-w-none">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700">{report.actions_taken}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Recommendations</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="prose max-w-none">
                                        <p className="text-base leading-relaxed whitespace-pre-wrap text-gray-700">{report.recommendations}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Images Section */}
                        {report.images.length > 0 && (
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Documentation Images ({report.images.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {report.images.map((image, index) => (
                                            <div key={index} className="group relative overflow-hidden rounded-xl border border-sky-100 bg-gray-50">
                                                <img
                                                    src={image}
                                                    alt={`Maintenance documentation ${index + 1}`}
                                                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                                <div className="absolute bottom-4 left-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white">
                                                        Image {index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Comments Section */}
                        {report.comments && report.comments.length > 0 && (
                            <Card className="border-sky-100 bg-white shadow-sm">
                                <CardHeader className="border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
                                    <CardTitle className="text-lg text-gray-900">Comments & Feedback ({report.comments.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {report.comments.map((comment, index) => (
                                            <div
                                                key={comment.id}
                                                className={`${index !== report.comments!.length - 1 ? 'border-b border-sky-100 pb-6' : ''}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-sky-200">
                                                        <User className="h-5 w-5 text-sky-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="mb-2 flex items-center gap-3">
                                                            <span className="font-semibold text-gray-900">{comment.user_name}</span>
                                                            <span className="text-sm text-gray-500">
                                                                {format(new Date(comment.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                                                            </span>
                                                        </div>
                                                        <p className="leading-relaxed text-gray-700">{comment.content}</p>
                                                    </div>
                                                </div>
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
