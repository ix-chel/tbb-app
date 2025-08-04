// resources/js/pages/dashboard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Calendar as CalendarIcon, ChevronDown, Package as PackageIcon, QrCode, Store, TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ActivityType = 'inventory' | 'schedule' | 'company';
const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    const [chartView, setChartView] = React.useState<'qr' | 'city'>('city');
    const { appearance } = useAppearance();
    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // data dummy
    const activityData = [
        { day: 'Senin', perusahaan: 2, toko: 4, inventori: 100, maintenance: 20 },
        { day: 'Selasa', perusahaan: 3, toko: 6, inventori: 120, maintenance: 22 },
        { day: 'Rabu', perusahaan: 5, toko: 8, inventori: 80, maintenance: 18 },
        { day: 'Kamis', perusahaan: 4, toko: 10, inventori: 150, maintenance: 25 },
        { day: 'Jumat', perusahaan: 6, toko: 12, inventori: 90, maintenance: 30 },
        { day: 'Sabtu', perusahaan: 6, toko: 12, inventori: 90, maintenance: 15 },
        { day: 'Minggu', perusahaan: 6, toko: 12, inventori: 90, maintenance: 10 },
    ];

    const qrData = [
        { day: 'Senin', total: 30 },
        { day: 'Selasa', total: 45 },
        { day: 'Rabu', total: 50 },
        { day: 'Kamis', total: 60 },
        { day: 'Jumat', total: 55 },
        { day: 'Sabtu', total: 25 },
        { day: 'Minggu', total: 20 },
    ];
    // warna per-hari
    const qrColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

    const cityData = [
        { name: 'Jakarta', value: 45 },
        { name: 'Bandung', value: 30 },
        { name: 'Surabaya', value: 20 },
        { name: 'Medan', value: 15 },
        { name: 'Bekasi', value: 10 },
        { name: 'Tangerang', value: 5 },
        { name: 'Depok', value: 3 },
    ];
    // warna per-kota
    const cityColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Full Width Container with 50px margin */}
            <div
                className="-mx-6 -my-6 min-h-screen bg-gradient-to-br from-white via-cyan-50/20 to-cyan-100/10"
                style={{
                    margin: '-1.5rem -1.5rem -1.5rem -1.5rem',
                    marginLeft: '-200px',
                    marginRight: '-50px',
                    padding: '50px 50px 50px 250px',
                }}
            >
                <div className="w-full max-w-none space-y-12">
                    {/* Statistics Overview - Enhanced Cards */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <Link href="/companies">
                            <StatCard title="Total Perusahaan" value="12" icon={<Building2 />} trend="+2" trendType="up" />
                        </Link>
                        <Link href="/stores">
                            <StatCard title="Total Toko" value="45" icon={<Store />} trend="+5" trendType="up" />
                        </Link>
                        <Link href="/inventory">
                            <InlineInventory total={1234} />
                        </Link>
                        <Link href="/schedules">
                            <InlineSchedule total={20} breakdown={{ active: 8, in_progress: 5, completed: 4, cancelled: 3 }} />
                        </Link>
                    </div>

                    {/* Main Content Row 1 - Enhanced Layout */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Activity Panel */}
                        <div className="rounded-3xl border border-cyan-100/40 bg-white/70 p-10 shadow-xl backdrop-blur-sm">
                            <div className="mb-8 flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">
                                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Aktivitas Terbaru</h3>
                            </div>

                            <div className="space-y-6">
                                <ActivityItem title="Pembaruan Inventori" description="Stok produk A diperbarui" time="2 jam lalu" type="inventory" />
                                <ActivityItem title="Jadwal Baru" description="Jadwal pemeliharaan dibuat" time="4 jam lalu" type="schedule" />
                                <ActivityItem title="Perusahaan Baru" description="Perusahaan C terdaftar" time="1 hari lalu" type="company" />
                                <ActivityItem
                                    title="QR Baru"
                                    description="QR baru untuk toko B telah dibuat"
                                    time="6 jam lalu"
                                    type="schedule"
                                    iconOverride={<QrCode className="h-6 w-6 text-blue-500" />}
                                />
                                <ActivityItem
                                    title="Store Baru"
                                    description="Store X telah terdaftar"
                                    time="1 menit lalu"
                                    type="company"
                                    iconOverride={<Store className="h-6 w-6 text-green-500" />}
                                />
                            </div>
                        </div>

                        {/* Chart Panel */}
                        <div className="rounded-3xl border border-cyan-100/40 bg-white/70 p-10 shadow-xl backdrop-blur-sm">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">
                                        <AreaChart className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">Chart Aktivitas</h3>
                                        <p className="text-lg text-gray-600">Senin–Minggu</p>
                                    </div>
                                </div>
                            </div>

                            <div className="h-[450px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id="gradFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Area dataKey="perusahaan" stroke="#3B82F6" fill="url(#gradFill)" />
                                        <Area dataKey="toko" stroke="#10B981" fill="url(#gradFill)" />
                                        <Area dataKey="inventori" stroke="#F59E0B" fill="url(#gradFill)" />
                                        <Area dataKey="maintenance" stroke="#EF4444" fill="url(#gradFill)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Row 2 - Enhanced Layout */}
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        {/* Status Table Panel */}
                        <div className="rounded-3xl border border-cyan-100/40 bg-white/70 p-10 shadow-xl backdrop-blur-sm">
                            <div className="mb-8 flex items-center space-x-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">
                                    <Store className="h-6 w-6 text-cyan-600" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Status Toko</h3>
                            </div>
                            <StatusTable />
                        </div>

                        {/* Chart Switch Panel */}
                        <div className="rounded-3xl border border-cyan-100/40 bg-white/70 p-10 shadow-xl backdrop-blur-sm">
                            <div className="mb-8 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100">
                                        <BarChart className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">
                                            {chartView === 'qr' ? 'Total QR Terdaftar per Hari' : 'Kota dengan Client Terbanyak'}
                                        </h3>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-2xl border-2 border-cyan-200 bg-white/80 px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50"
                                        >
                                            Pilih
                                            <ChevronDown className="ml-2 h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="rounded-2xl border-2 border-cyan-100 bg-white/90 p-2 shadow-xl backdrop-blur-sm"
                                    >
                                        <DropdownMenuItem
                                            onSelect={() => setChartView('qr')}
                                            className="rounded-xl px-4 py-3 text-lg transition-colors hover:bg-cyan-50"
                                        >
                                            Total QR
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => setChartView('city')}
                                            className="rounded-xl px-4 py-3 text-lg transition-colors hover:bg-cyan-50"
                                        >
                                            Kota Client
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex h-[350px] items-center justify-center">
                                {chartView === 'qr' ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={qrData} margin={{ left: 12, right: 12 }}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="total">
                                                {qrData.map((_, i) => (
                                                    <Cell key={i} fill={qrColors[i % qrColors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={cityData} layout="vertical" margin={{ left: -20, right: 12 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="value">
                                                {cityData.map((_, i) => (
                                                    <Cell key={i} fill={cityColors[i % cityColors.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// ———— Enhanced Components ————

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
        <div className="transform rounded-3xl border border-cyan-100/40 bg-white/70 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-600">{icon}</div>
                <div
                    className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-bold ${
                        trendType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                >
                    <span>{trendType === 'up' ? '↑' : '↓'}</span>
                    <span>{trend}</span>
                </div>
            </div>
            <div>
                <h3 className="mb-2 text-4xl font-bold text-gray-900">{value}</h3>
                <p className="text-lg font-medium text-gray-600">{title}</p>
            </div>
        </div>
    );
}

function InlineInventory({ total = 0 }: { total?: number }) {
    return (
        <div className="transform rounded-3xl border border-cyan-100/40 bg-white/70 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                    <PackageIcon className="h-7 w-7 text-cyan-600" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded-xl border-2 border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50"
                        >
                            Detail
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-2 rounded-2xl border-2 border-cyan-100 bg-white/90 p-3 shadow-xl backdrop-blur-sm">
                        <div className="text-base font-medium text-gray-700">Low Stock Inventory: 10</div>
                        <div className="text-base font-medium text-gray-700">Pipa Sisa: 5</div>
                        <div className="text-base font-medium text-gray-700">Filter Sisa: 8</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h3 className="mb-2 text-4xl font-bold text-gray-900">{total}</h3>
                <p className="text-lg font-medium text-gray-600">Total Inventori</p>
            </div>
        </div>
    );
}

function InlineSchedule({ total = 0, breakdown = { active: 0, in_progress: 0, completed: 0, cancelled: 0 } }: any) {
    return (
        <div className="transform rounded-3xl border border-cyan-100/40 bg-white/70 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                    <CalendarIcon className="h-7 w-7 text-cyan-600" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded-xl border-2 border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold shadow-md transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-50"
                        >
                            Detail
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-2 rounded-2xl border-2 border-cyan-100 bg-white/90 p-3 shadow-xl backdrop-blur-sm">
                        <div className="text-base font-medium text-gray-700">Aktif: {breakdown.active}</div>
                        <div className="text-base font-medium text-gray-700">In Progress: {breakdown.in_progress}</div>
                        <div className="text-base font-medium text-gray-700">Selesai: {breakdown.completed}</div>
                        <div className="text-base font-medium text-gray-700">Dibatalkan: {breakdown.cancelled}</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <h3 className="mb-2 text-4xl font-bold text-gray-900">{total}</h3>
                <p className="text-lg font-medium text-gray-600">Total Maintenance</p>
            </div>
        </div>
    );
}

function ActivityItem({
    title,
    description,
    time,
    type,
    iconOverride,
}: {
    title: string;
    description: string;
    time: string;
    type: ActivityType;
    iconOverride?: React.ReactNode;
}) {
    const icons: Record<ActivityType, React.ReactNode> = {
        inventory: <PackageIcon className="h-6 w-6 text-blue-500" />,
        schedule: <CalendarIcon className="h-6 w-6 text-green-500" />,
        company: <Building2 className="h-6 w-6 text-purple-500" />,
    };

    return (
        <div className="flex items-start space-x-4 rounded-2xl border border-cyan-100/30 bg-white/50 p-4 transition-all duration-300 hover:bg-white/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md">{iconOverride ?? icons[type]}</div>
            <div className="flex-1">
                <h4 className="mb-1 text-lg font-bold text-gray-900">{title}</h4>
                <p className="mb-2 text-base text-gray-600">{description}</p>
                <p className="text-sm font-medium text-gray-500">{time}</p>
            </div>
        </div>
    );
}

function StatusTable() {
    const rows = [
        ['Toko A', 'Aktif', '85%', 'success'],
        ['Toko B', 'Perlu Perhatian', '45%', 'warning'],
        ['Toko C', 'Aktif', '92%', 'success'],
        ['Toko D', 'Aktif', '70%', 'success'],
        ['Toko E', 'Perlu Perhatian', '55%', 'warning'],
    ] as const;

    return (
        <div className="overflow-hidden rounded-2xl border border-cyan-100/30 bg-white/50">
            <table className="w-full text-left">
                <thead className="bg-cyan-50/50">
                    <tr>
                        <th className="px-6 py-4 text-lg font-bold text-gray-900">Nama Toko</th>
                        <th className="px-6 py-4 text-lg font-bold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-lg font-bold text-gray-900">Inventori</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([n, s, i, t], index) => (
                        <tr
                            key={n}
                            className={`border-t border-cyan-100/30 transition-colors hover:bg-white/70 ${
                                index % 2 === 0 ? 'bg-white/20' : 'bg-white/40'
                            }`}
                        >
                            <td className="px-6 py-4 text-lg font-bold text-gray-900">{n}</td>
                            <td className="px-6 py-4">
                                <span
                                    className={`rounded-xl px-4 py-2 text-sm font-bold ${
                                        t === 'success'
                                            ? 'border border-green-200 bg-green-100 text-green-800'
                                            : 'border border-yellow-200 bg-yellow-100 text-yellow-800'
                                    }`}
                                >
                                    {s}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-lg font-semibold text-gray-700">{i}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
