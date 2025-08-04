// resources/js/Pages/Stores/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, MapPin, Phone, Save, Store } from 'lucide-react';

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

interface CompanyData {
    id: number;
    name: string;
}

interface EditProps extends PageProps {
    store: StoreData;
    companies: CompanyData[];
}

export default function Edit({ auth, store, companies }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: store.name || '',
        address: store.address || '',
        phone: store.phone || '',
        company_id: store.company.id || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('stores.update', store.id));
    };

    return (
        <AppLayout user={auth.user}>
            <Head title={`Edit Store - ${store.name}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Main Edit Form Card */}
                    <div className="mb-8 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl">
                        {/* Header Section with Gradient */}
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
                            <div className="absolute inset-0 bg-black opacity-10"></div>
                            <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white opacity-10"></div>
                            <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-48 w-48 rounded-full bg-white opacity-5"></div>

                            <div className="relative z-10">
                                <div className="mb-4">
                                    <div>
                                        <h1 className="mb-2 text-4xl font-bold text-white">{store.name}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Content Section */}
                        <div className="px-8 py-8">
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    {/* Store Form Fields */}
                                    <div className="space-y-6 lg:col-span-2">
                                        <div>
                                            <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                                <Store className="mr-3 h-6 w-6 text-blue-600" />
                                                Store Information
                                            </h3>

                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                {/* Store Name */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">Store Name</label>
                                                    <input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter store name"
                                                        required
                                                    />
                                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                                </div>

                                                {/* Company Selection */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <Building2 className="mr-2 inline h-4 w-4" />
                                                        Company
                                                    </label>
                                                    <select
                                                        value={data.company_id}
                                                        onChange={(e) => setData('company_id', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        required
                                                    >
                                                        <option value="">Select a company</option>
                                                        {companies.map((company) => (
                                                            <option key={company.id} value={company.id}>
                                                                {company.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                                                </div>

                                                {/* Address */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <MapPin className="mr-2 inline h-4 w-4" />
                                                        Address
                                                    </label>
                                                    <textarea
                                                        value={data.address}
                                                        onChange={(e) => setData('address', e.target.value)}
                                                        rows={3}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter store address"
                                                    />
                                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                                </div>

                                                {/* Phone */}
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                                        <Phone className="mr-2 inline h-4 w-4" />
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        className="w-full rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-lg font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Enter phone number"
                                                    />
                                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Sidebar */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="mb-6 flex items-center text-xl font-semibold text-gray-900">
                                                <Save className="mr-3 h-6 w-6 text-blue-600" />
                                                Actions
                                            </h3>

                                            <div className="space-y-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="flex w-full transform items-center justify-center rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <Save className="mr-3 h-5 w-5" />
                                                    {processing ? 'Saving...' : 'Save Changes'}
                                                </button>

                                                <Link
                                                    href={route('stores.show', store.id)}
                                                    className="flex w-full items-center justify-center rounded-xl border-2 border-gray-200 bg-white px-6 py-4 font-semibold text-gray-700 shadow-md transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg"
                                                >
                                                    <ArrowLeft className="mr-3 h-5 w-5" />
                                                    Cancel & Back
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Additional Information Cards */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Current Location Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Location</h3>
                                    <p className="text-sm text-gray-500">Store Address</p>
                                </div>
                            </div>
                            <p className="leading-relaxed text-gray-700">{store.address || 'Address not specified for this store location'}</p>
                        </div>

                        {/* Current Contact Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Contact</h3>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                </div>
                            </div>
                            <p className="leading-relaxed text-gray-700">{store.phone || 'Contact number not provided'}</p>
                        </div>

                        {/* Current Company Card */}
                        <div className="transform rounded-xl border border-blue-100 bg-white p-6 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl">
                            <div className="mb-4 flex items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                                    <Store className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Current Company</h3>
                                    <p className="text-sm text-gray-500">Parent Organization</p>
                                </div>
                            </div>
                            <p className="leading-relaxed text-gray-700">{store.company.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
