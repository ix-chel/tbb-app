// resources/js/Pages/Stores/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

// Tipe data sesuai kebutuhan
interface StoreData {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    company: { id: number; name: string };
}
interface ShowProps extends PageProps {
    store: StoreData;
}

export default function Show({ auth, store }: ShowProps) {
    return (
        <AppLayout user={auth.user} header={<h2 className="text-xl font-semibold ...">Store Details</h2>}>
            <Head title={`Store - ${store.name}`} />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="mb-2 text-lg font-medium">{store.name}</h3>
                            <p>
                                <strong>PIC name:</strong> {store.name}
                            </p>
                            <p>
                                <strong>Company:</strong> {store.company.name}
                            </p>
                            <p>
                                <strong>Address:</strong> {store.address ?? '-'}
                            </p>
                            <p>
                                <strong>Phone:</strong> {store.phone ?? '-'}
                            </p>
                            <div className="mt-4">
                                <Link href={route('stores.edit', store.id)} className="mr-3 text-indigo-600 hover:text-indigo-900">
                                    Edit
                                </Link>
                                <Link href={route('stores.index')} className="text-gray-600 hover:text-gray-900">
                                    Back to List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
