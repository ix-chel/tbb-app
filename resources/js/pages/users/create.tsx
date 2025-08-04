import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building, Eye, EyeOff, Lock, Mail, Shield, User, UserPlus } from 'lucide-react';
import React, { useState } from 'react';

interface CreateProps extends PageProps {
    roles: { value: string; label: string }[];
    companies: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: route('users.index'),
    },
    {
        title: 'Tambah User',
        href: route('users.create'),
    },
];

export default function Create({ auth, roles, companies }: CreateProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        company_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => (window.location.href = route('users.index')),
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="Tambah User" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 px-6 py-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-10">
                        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3"></div>
                            </div>
                            <Link
                                href={route('users.index')}
                                className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/70 px-8 py-4 text-lg font-semibold text-slate-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl"
                            >
                                <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                                <span>Kembali</span>
                            </Link>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="rounded-3xl border border-white/20 bg-white/70 shadow-2xl backdrop-blur-sm">
                        <div className="p-8 lg:p-12">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg">
                                            <UserPlus className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-slate-800 lg:text-4xl">Tambah User Baru</h1>
                                            <p className="text-lg text-slate-600">Buat akun pengguna baru untuk sistem</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Nama */}
                                        <div className="space-y-3">
                                            <label htmlFor="name" className="block text-lg font-semibold text-slate-700">
                                                Nama Lengkap
                                            </label>
                                            <div className="relative">
                                                <User className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    placeholder="Masukkan nama lengkap"
                                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-6 pl-16 text-lg transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                />
                                            </div>
                                            {errors.name && <p className="text-lg font-medium text-red-500">{errors.name}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-3">
                                            <label htmlFor="email" className="block text-lg font-semibold text-slate-700">
                                                Alamat Email
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    placeholder="user@example.com"
                                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-6 pl-16 text-lg transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                />
                                            </div>
                                            {errors.email && <p className="text-lg font-medium text-red-500">{errors.email}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Security Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg">
                                            <Lock className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Keamanan</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Password */}
                                        <div className="space-y-3">
                                            <label htmlFor="password" className="block text-lg font-semibold text-slate-700">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    id="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Masukkan password"
                                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-16 pl-16 text-lg transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute top-1/2 right-6 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
                                                >
                                                    {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-lg font-medium text-red-500">{errors.password}</p>}
                                        </div>

                                        {/* Konfirmasi Password */}
                                        <div className="space-y-3">
                                            <label htmlFor="password_confirmation" className="block text-lg font-semibold text-slate-700">
                                                Konfirmasi Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                <input
                                                    type={showPasswordConfirmation ? 'text' : 'password'}
                                                    id="password_confirmation"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Konfirmasi password"
                                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-16 pl-16 text-lg transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                                    className="absolute top-1/2 right-6 -translate-y-1/2 transform text-slate-400 transition-colors hover:text-slate-600"
                                                >
                                                    {showPasswordConfirmation ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Authorization Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 shadow-lg">
                                            <Shield className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">Otoritas & Akses</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        {/* Role */}
                                        <div className="space-y-3">
                                            <label htmlFor="role" className="block text-lg font-semibold text-slate-700">
                                                Role Pengguna
                                            </label>
                                            <div className="relative">
                                                <Shield className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                <select
                                                    id="role"
                                                    value={data.role}
                                                    onChange={(e) => setData('role', e.target.value)}
                                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-6 pl-16 text-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                >
                                                    <option value="">Pilih Role</option>
                                                    {roles.map((role) => (
                                                        <option key={role.value} value={role.value}>
                                                            {role.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.role && <p className="text-lg font-medium text-red-500">{errors.role}</p>}
                                        </div>

                                        {/* Company (only shown if role is 'client') */}
                                        {data.role === 'client' && (
                                            <div className="space-y-3">
                                                <label htmlFor="company_id" className="block text-lg font-semibold text-slate-700">
                                                    Perusahaan
                                                </label>
                                                <div className="relative">
                                                    <Building className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 transform text-slate-400" />
                                                    <select
                                                        id="company_id"
                                                        value={data.company_id}
                                                        onChange={(e) => setData('company_id', e.target.value)}
                                                        className="w-full rounded-2xl border-2 border-slate-200 bg-white/80 py-4 pr-6 pl-16 text-lg transition-all duration-300 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100 focus:outline-none"
                                                    >
                                                        <option value="">Pilih Perusahaan</option>
                                                        {companies.map((company) => (
                                                            <option key={company.id} value={company.id}>
                                                                {company.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {errors.company_id && <p className="text-lg font-medium text-red-500">{errors.company_id}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Section */}
                                <div className="flex justify-end border-t border-slate-200 pt-8">
                                    <div className="flex gap-6">
                                        <Link
                                            href={route('users.index')}
                                            className="flex items-center gap-3 rounded-2xl bg-slate-100 px-8 py-4 text-lg font-semibold text-slate-700 transition-all duration-300 hover:scale-105 hover:bg-slate-200"
                                        >
                                            Batal
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-cyan-600 hover:to-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            <UserPlus className="h-6 w-6 transition-transform group-hover:scale-110" />
                                            <span>{processing ? 'Menyimpan...' : 'Simpan User'}</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
