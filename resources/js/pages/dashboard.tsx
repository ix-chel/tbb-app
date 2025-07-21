import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Building2, Store, Package, Calendar, BarChart, CheckCircle } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className={`flex h-full flex-1 flex-col gap-6 p-6 ${isDark ? 'bg-primary-dark' : 'bg-primary'}`}>
                {/* Statistik Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Companies"
                        value="15"
                        icon={<Building2 className="w-6 h-6" />}
                        trend="+2 this month"
                        trendType="up"
                    />
                    <StatCard
                        title="Total Stores"
                        value="45"
                        icon={<Store className="w-6 h-6" />}
                        trend="+5 this month"
                        trendType="up"
                    />
                    <StatCard
                        title="Total Inventory"
                        value="1,234"
                        icon={<Package className="w-6 h-6" />}
                        trend="+89 items"
                        trendType="up"
                    />
                    <StatCard
                        title="Active Schedules"
                        value="8"
                        icon={<Calendar className="w-6 h-6" />}
                        trend="3 pending"
                        trendType="up"
                    />
                </div>

                {/* Grafik dan Tabel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Grafik Aktivitas */}
                    <div className={`${isDark ? 'bg-primary-dark' : 'bg-primary'} rounded-xl shadow-sm border border-gray-200 p-6`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                        <div className="space-y-4">
                            <ActivityItem
                                title="New maintenance schedule created"
                                description="by John Smith • 2 hours ago"
                                type="schedule_created"
                            />
                            <ActivityItem
                                title="New company registered"
                                description="by Sarah Johnson • 4 hours ago"
                                type="company"
                            />
                            <ActivityItem
                                title="Technician submitted a report"
                                description="by Mike Wilson • 6 hours ago"
                                type="report"
                            />
                            <ActivityItem
                                title="Inventory updated for Store #12"
                                description="by Lisa Davis • 8 hours ago"
                                type="inventory"
                            />
                            <ActivityItem
                                title="Maintenance completed at Downtown Store"
                                description="by Tom Brown • 1 day ago"
                                type="maintenance_completed"
                            />
                        </div>
                    </div>

                    {/* Tabel Status */}
                    <div className={`${isDark ? 'bg-primary-dark' : 'bg-primary'} rounded-xl shadow-sm border border-gray-200 p-6`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Maintenance Status</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="pb-4">STORE NAME</th>
                                        <th className="pb-4">LAST MAINTENANCE</th>
                                        <th className="pb-4">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <StatusRow
                                        name="Downtown Store"
                                        lastMaintenance="2024-06-10"
                                        status="Completed"
                                        statusType="success"
                                    />
                                    <StatusRow
                                        name="Mall Location"
                                        lastMaintenance="2024-06-08"
                                        status="Pending"
                                        statusType="warning"
                                    />
                                    <StatusRow
                                        name="Airport Branch"
                                        lastMaintenance="2024-05-25"
                                        status="Overdue"
                                        statusType="error"
                                    />
                                    <StatusRow
                                        name="Suburban Outlet"
                                        lastMaintenance="2024-06-12"
                                        status="Completed"
                                        statusType="success"
                                    />
                                    <StatusRow
                                        name="City Center"
                                        lastMaintenance="2024-06-05"
                                        status="Pending"
                                        statusType="warning"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ title, value, icon, trend, trendType }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendType: 'up' | 'down';
}) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return (
        <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-primary-dark border-typography-light/10 text-typography-light' : 'bg-primary border-typography-gray/20 text-typography-dark'}`}>
            <div className="flex items-center justify-between">
                <div className={isDark ? 'text-typography-light' : 'text-typography-gray'}>{icon}</div>
                <div className={`text-sm font-medium ${trendType === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trend}</div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="text-sm text-typography-gray mt-1">{title}</p>
            </div>
        </div>
    );
}

function ActivityItem({ title, description, type }: {
    title: string;
    description: string;
    type: 'inventory' | 'schedule_created' | 'company' | 'report' | 'maintenance_completed';
}) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const iconMap = {
        inventory: <Package className={`w-5 h-5 ${isDark ? 'text-secondary-blue' : 'text-secondary-blue'}`} />,
        schedule_created: <Calendar className={`w-5 h-5 ${isDark ? 'text-secondary-green' : 'text-secondary-green'}`} />,
        company: <Building2 className={`w-5 h-5 ${isDark ? 'text-secondary-purple' : 'text-secondary-purple'}`} />,
        report: <BarChart className="w-5 h-5 text-red-500" />,
        maintenance_completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    };
    return (
        <div className="flex items-start space-x-4">
            <div className="mt-1">{iconMap[type]}</div>
            <div>
                <h4 className={`font-medium ${isDark ? 'text-typography-light' : 'text-typography-dark'}`}>{title}</h4>
                <p className={`text-sm ${isDark ? 'text-typography-light/70' : 'text-typography-gray'}`}>{description}</p>
            </div>
        </div>
    );
}

function StatusRow({ name, lastMaintenance, status, statusType }: {
    name: string;
    lastMaintenance: string;
    status: string;
    statusType: 'success' | 'warning' | 'error';
}) {
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const statusColors = {
        success: isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800',
        warning: isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
        error: isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800',
    };
    return (
        <tr className={isDark ? 'border-t border-typography-light/10' : 'border-t border-typography-gray/10'}>
            <td className={`py-4 font-medium ${isDark ? 'text-typography-light' : 'text-typography-dark'}`}>{name}</td>
            <td className={`py-4 ${isDark ? 'text-typography-light/70' : 'text-typography-gray'}`}>{lastMaintenance}</td>
            <td className="py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[statusType]}`}>{status}</span>
            </td>
        </tr>
    );
}
