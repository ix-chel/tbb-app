// resources/js/Pages/Stores/Show.tsx
import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';

// Tipe data sesuai kebutuhan
interface StoreData { id: number; name: string; address?: string; phone?: string; company: { id: number; name: string; } }
interface ShowProps extends PageProps { store: StoreData; }

export default function Show({ auth, store }: ShowProps) {
    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl ...">Store Details</h2>}>
            <Head title={`Store - ${store.name}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-2">{store.name}</h3>
                            <p><strong>Company:</strong> {store.company.name}</p>
                            <p><strong>Address:</strong> {store.address ?? '-'}</p>
                            <p><strong>Phone:</strong> {store.phone ?? '-'}</p>
                            <div className="mt-4">
                                 <Link href={route('stores.edit', store.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link>
                                 <Link href={route('stores.index')} className="text-gray-600 hover:text-gray-900">Back to List</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}