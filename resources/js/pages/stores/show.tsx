// resources/js/Pages/Stores/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, Building2, Calendar, Edit3, MapPin, Phone, Store, Users } from 'lucide-react';

// Tipe data sesuai kebutuhan
interface StoreData {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    company: {
        id: number;
        name: string;
    };
    created_at?: string;
    status?: string;
}

interface ShowProps extends PageProps {
    store: StoreData;
}

export default function Show({ auth, store }: ShowProps) {
    return (
        <AppLayout user={auth.user}>
            <Head title={`Store - ${store.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                {/* Main Store Card */}
                <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl">
                    {/* Header Section with Gradient */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                        <div className="relative z-10">
                            <div className="mb-4">
                                <div>
                                    <h1 className="mb-2 text-4xl font-bold text-white">{store.name}</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Store Information */}
                            <div className="space-y-6 lg:col-span-2">
                                <div>
                                    <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                        <Activity className="mr-3 h-6 w-6 text-blue-600" />
                                        Store Information
                                    </h3>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Company Info */}
                                        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                            <div className="mb-3 flex items-center">
                                                <Building2 className="mr-3 h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Company</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{store.company.name}</p>
                                            <p className="mt-1 text-sm text-gray-500">Parent Company</p>
                                        </div>

                                        {/* Address Info */}
                                        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                            <div className="mb-3 flex items-center">
                                                <MapPin className="mr-3 h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Address</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{store.address || 'Not specified'}</p>
                                            <p className="mt-1 text-sm text-gray-500">Store Location</p>
                                        </div>

                                        {/* Phone Info */}
                                        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                            <div className="mb-3 flex items-center">
                                                <Phone className="mr-3 h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Phone</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">{store.phone || 'Not provided'}</p>
                                            <p className="mt-1 text-sm text-gray-500">Contact Number</p>
                                        </div>

                                        {/* Created Date */}
                                        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
                                            <div className="mb-3 flex items-center">
                                                <Calendar className="mr-3 h-5 w-5 text-blue-600" />
                                                <span className="text-sm font-medium tracking-wide text-gray-500 uppercase">Created</span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {store.created_at ? new Date(store.created_at).toLocaleDateString() : 'Unknown'}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">Registration Date</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Sidebar */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                        <Users className="mr-3 h-6 w-6 text-blue-600" />
                                        Quick Actions
                                    </h3>

                                    <div className="space-y-4">
                                        <Link
                                            href={route('stores.edit', store.id)}
                                            className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg"
                                        >
                                            <Edit3 className="mr-3 h-5 w-5" />
                                            Edit Store Details
                                        </Link>

                                        <Link
                                            href={route('stores.index')}
                                            className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 shadow-md transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg"
                                        >
                                            <ArrowLeft className="mr-3 h-5 w-5" />
                                            Back to Stores
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information Cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Location Card */}
                    <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                        <div className="mb-4 flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <MapPin className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                <p className="text-sm text-gray-500">Store Address</p>
                            </div>
                        </div>
                        <p className="leading-relaxed text-gray-700">{store.address || 'Address not specified for this store location'}</p>
                    </div>

                    {/* Contact Card */}
                    <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                        <div className="mb-4 flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <Phone className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                                <p className="text-sm text-gray-500">Phone Number</p>
                            </div>
                        </div>
                        <p className="leading-relaxed text-gray-700">{store.phone || 'Contact number not provided'}</p>
                    </div>

                    {/* Company Card */}
                    <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                        <div className="mb-4 flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                <Store className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Company</h3>
                                <p className="text-sm text-gray-500">Parent Organization</p>
                            </div>
                        </div>
                        <p className="leading-relaxed text-gray-700">{store.company.name}</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
