'use client';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
    { name: 'Senin', perusahaan: 2, toko: 4, inventori: 100 },
    { name: 'Selasa', perusahaan: 3, toko: 6, inventori: 120 },
    { name: 'Rabu', perusahaan: 5, toko: 8, inventori: 80 },
    { name: 'Kamis', perusahaan: 4, toko: 10, inventori: 150 },
    { name: 'Jumat', perusahaan: 6, toko: 12, inventori: 90 },
    { name: 'Sabtu', perusahaan: 6, toko: 12, inventori: 90 },
    { name: 'Minggu', perusahaan: 6, toko: 12, inventori: 90 },
];

export default function ActivityChart() {
    return (
        <div className="h-[350px] rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Grafik Aktivitas</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="perusahaan" stroke="#6366F1" name="Perusahaan" />
                    <Line type="monotone" dataKey="toko" stroke="#10B981" name="Toko" />
                    <Line type="monotone" dataKey="inventori" stroke="#F59E0B" name="Inventori" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
