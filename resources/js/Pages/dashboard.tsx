// resources/js/pages/dashboard.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Building2, Calendar as CalendarIcon, Package as PackageIcon, QrCode, Store } from 'lucide-react';
import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type ActivityType = 'inventory' | 'schedule' | 'company';
const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard() {
    const [chartView, setChartView] = React.useState<'qr' | 'city'>('city');

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
            <div className="flex flex-col gap-6 p-6">
                {/* Statistik Overview */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

                {/* Row 1 */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Aktivitas Terbaru</h3>
                        <ActivityItem title="Pembaruan Inventori" description="Stok produk A diperbarui" time="2 jam lalu" type="inventory" />
                        <ActivityItem title="Jadwal Baru" description="Jadwal pemeliharaan dibuat" time="4 jam lalu" type="schedule" />
                        <ActivityItem title="Perusahaan Baru" description="Perusahaan C terdaftar" time="1 hari lalu" type="company" />
                        <ActivityItem
                            title="QR Baru"
                            description="QR baru untuk toko B telah dibuat"
                            time="6 jam lalu"
                            type="schedule"
                            iconOverride={<QrCode className="h-5 w-5 text-blue-500" />}
                        />
                        <ActivityItem
                            title="Store Baru"
                            description="Store X telah terdaftar"
                            time="1 menit lalu"
                            type="company"
                            iconOverride={<Store className="h-5 w-5 text-green-500" />}
                        />
                    </div>
                    <Card className="rounded-xl border bg-white p-6 shadow-sm">
                        <CardHeader>
                            <CardTitle>Chart Aktivitas</CardTitle>
                            <CardDescription>Senin–Minggu</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
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
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold">Status Toko</h3>
                        <StatusTable />
                    </div>

                    <Card className="flex flex-col rounded-xl border bg-white p-6 shadow-sm">
                        <CardHeader className="flex items-center justify-between">
                            <CardTitle>{chartView === 'qr' ? 'Total QR Terdaftar per Hari' : 'Kota dengan Client Terbanyak'}</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        Pilih
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => setChartView('qr')}>Total QR</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => setChartView('city')}>Kota Client</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        <CardContent className="flex flex-1 items-center justify-center">
                            {chartView === 'qr' ? (
                                <ResponsiveContainer width="100%" height={260}>
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
                                <ResponsiveContainer width="100%" height={260}>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

// ———— Helpers ————

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
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="text-gray-500">{icon}</div>
                <div className={`text-sm font-medium ${trendType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trendType === 'up' ? '↑' : '↓'} {trend}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{value}</h3>
                <p className="mt-1 text-sm text-gray-500">{title}</p>
            </div>
        </div>
    );
}

function InlineInventory({ total = 0 }: { total?: number }) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <PackageIcon className="h-6 w-6 text-gray-500" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Detail
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-1 p-2">
                        <div className="text-sm">Low Stock Inventory: 10</div>
                        <div className="text-sm">Pipa Sisa: 5</div>
                        <div className="text-sm">Filter Sisa: 8</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{total}</h3>
                <p className="mt-1 text-sm text-gray-500">Total Inventori</p>
            </div>
        </div>
    );
}

function InlineSchedule({ total = 0, breakdown = { active: 0, in_progress: 0, completed: 0, cancelled: 0 } }: any) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <CalendarIcon className="h-6 w-6 text-gray-500" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Detail
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="space-y-1 p-2">
                        <div className="text-sm">Aktif: {breakdown.active}</div>
                        <div className="text-sm">In Progress: {breakdown.in_progress}</div>
                        <div className="text-sm">Selesai: {breakdown.completed}</div>
                        <div className="text-sm">Dibatalkan: {breakdown.cancelled}</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold">{total}</h3>
                <p className="mt-1 text-sm text-gray-500">Total Maintenance</p>
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
        inventory: <PackageIcon className="h-5 w-5 text-blue-500" />,
        schedule: <CalendarIcon className="h-5 w-5 text-green-500" />,
        company: <Building2 className="h-5 w-5 text-purple-500" />,
    };
    return (
        <div className="mb-4 flex items-start space-x-4">
            {iconOverride ?? icons[type]}
            <div>
                <h4 className="font-medium text-gray-900">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
                <p className="mt-1 text-xs text-gray-400">{time}</p>
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
        <table className="w-full text-left text-sm text-gray-500">
            <thead>
                <tr>
                    <th className="pb-4">Nama Toko</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Inventori</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(([n, s, i, t]) => (
                    <tr key={n} className="border-t border-gray-100">
                        <td className="py-4 font-medium text-gray-900">{n}</td>
                        <td className="py-4">
                            <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                    t === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}
                            >
                                {s}
                            </span>
                        </td>
                        <td className="py-4 text-gray-500">{i}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
