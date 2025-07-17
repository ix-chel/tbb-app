import ActivityChart from '@/components/activity-chart';
import { ScheduleDropdownStats } from '@/components/schedule-dropdown-stats';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, Calendar, Package, Store } from 'lucide-react';

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
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Statistik Overview */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/companies">
                        <StatCard title="Total Perusahaan" value="12" icon={<Building2 className="h-6 w-6" />} trend="+2" trendType="up" />
                    </Link>

                    <Link href="/stores">
                        <StatCard title="Total Toko" value="45" icon={<Store className="h-6 w-6" />} trend="+5" trendType="up" />
                    </Link>
                    <Link href="/inventory">
                        <StatCard title="Total Inventori" value="1,234" icon={<Package className="h-6 w-6" />} trend="-12" trendType="down" />
                    </Link>
                    <Link href="/schedules">
                        <ScheduleDropdownStats
                            total={20}
                            breakdown={{
                                active: 8,
                                in_progress: 5,
                                cancelled: 3,
                                completed: 4,
                            }}
                        />
                    </Link>
                </div>

                {/* Grafik dan Tabel */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Grafik Aktivitas */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
                        <div className="space-y-4">
                            <ActivityItem
                                title="Pembaruan Inventori"
                                description="Stok produk A telah diperbarui"
                                time="2 jam yang lalu"
                                type="inventory"
                            />
                            <ActivityItem
                                title="Jadwal Baru"
                                description="Jadwal pemeliharaan toko B telah dibuat"
                                time="4 jam yang lalu"
                                type="schedule"
                            />
                            <ActivityItem title="Perusahaan Baru" description="Perusahaan C telah terdaftar" time="1 hari yang lalu" type="company" />
                        </div>
                    </div>
                    {/* Grafik Aktivitas Mingguan */}
                    <ActivityChart />

                    {/* Tabel Status */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Status Toko</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="pb-4">Nama Toko</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Inventori</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    <StatusRow name="Toko A" status="Aktif" inventory="85%" statusType="success" />
                                    <StatusRow name="Toko B" status="Perlu Perhatian" inventory="45%" statusType="warning" />
                                    <StatusRow name="Toko C" status="Aktif" inventory="92%" statusType="success" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    icon,
    trend,
    trendType,
}: {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    trendType: 'up' | 'down';
}) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="text-gray-500">{icon}</div>
                <div className={`text-sm font-medium ${trendType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trendType === 'up' ? '↑' : '↓'} {trend}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="mt-1 text-sm text-gray-500">{title}</p>
            </div>
        </div>
    );
}

function ActivityItem({
    title,
    description,
    time,
    type,
}: {
    title: string;
    description: string;
    time: string;
    type: 'inventory' | 'schedule' | 'company';
}) {
    const iconMap = {
        inventory: <Package className="h-5 w-5 text-blue-500" />,
        schedule: <Calendar className="h-5 w-5 text-green-500" />,
        company: <Building2 className="h-5 w-5 text-purple-500" />,
    };

    return (
        <div className="flex items-start space-x-4">
            <div className="mt-1">{iconMap[type]}</div>
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
                <p className="mt-1 text-xs text-gray-400">{time}</p>
            </div>
        </div>
    );
}

function StatusRow({
    name,
    status,
    inventory,
    statusType,
}: {
    name: string;
    status: string;
    inventory: string;
    statusType: 'success' | 'warning' | 'error';
}) {
    const statusColors = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
    };

    return (
        <tr className="border-t border-gray-100">
            <td className="py-4 font-medium text-gray-900">{name}</td>
            <td className="py-4">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[statusType]}`}>{status}</span>
            </td>
            <td className="py-4 text-gray-500">{inventory}</td>
        </tr>
    );
}
