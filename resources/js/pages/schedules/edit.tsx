import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // <-- Menggunakan AppLayout
import { PageProps, User } from '@/types'; // <-- Import tipe

// Definisikan tipe data spesifik
interface StoreSimple { id: number; name: string; }
interface ScheduleData {
    id: number;
    scheduled_at: string;
    status: string;
    notes?: string;
    completed_at?: string;
    store_id: number;
    user_id?: number;
    store: StoreSimple;
    technician?: User;
}
interface EditProps extends PageProps { // <-- Extend PageProps
    schedule: ScheduleData;
    stores: StoreSimple[];
    technicians: User[]; // Gunakan tipe User
    statuses: string[];
}

export default function Edit({ auth, schedule, stores, technicians, statuses, flash }: EditProps) { // Ambil auth & flash
    const { data, setData, put, processing, errors } = useForm({
        store_id: String(schedule.store_id) || '',
        user_id: schedule.user_id ? String(schedule.user_id) : '',
        scheduled_at: schedule.scheduled_at?.substring(0, 16) || '',
        notes: schedule.notes || '',
        status: schedule.status || 'scheduled',
        completed_at: schedule.completed_at?.substring(0, 16) || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('schedules.update', schedule.id));
    };

    return (
        <AppLayout // <-- Menggunakan AppLayout
            user={auth.user} // Kirim user ke AppLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Schedule</h2>}
        >
            <Head title="Edit Schedule" />
             <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                             {flash?.message && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{flash.message}</div>}
                             <form onSubmit={handleSubmit}>
                                 {/* Store */}
                                 <div className="mb-4">
                                     <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">Store</label>
                                     <select
                                         id="store_id"
                                         name="store_id"
                                         value={data.store_id}
                                         onChange={e => setData('store_id', e.target.value)}
                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                     >
                                         <option value="">Select Store</option>
                                         {stores.map(store => (
                                             <option key={store.id} value={store.id}>{store.name}</option>
                                         ))}
                                     </select>
                                     {errors.store_id && <div className="text-red-500 text-sm mt-1">{errors.store_id}</div>}
                                 </div>

                                 {/* technician */}
                                 <div className="mb-4">
                                     <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">technician</label>
                                     <select
                                         id="user_id"
                                         name="user_id"
                                         value={data.user_id}
                                         onChange={e => setData('user_id', e.target.value)}
                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                     >
                                         <option value="">Select technician</option>
                                         {technicians.map(tech => (
                                             <option key={tech.id} value={tech.id}>{tech.name}</option>
                                         ))}
                                     </select>
                                     {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                                 </div>

                                 {/* Scheduled At */}
                                 <div className="mb-4">
                                     <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700">Scheduled At</label>
                                     <input
                                         type="datetime-local"
                                         id="scheduled_at"
                                         name="scheduled_at"
                                         value={data.scheduled_at}
                                         onChange={e => setData('scheduled_at', e.target.value)}
                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                     />
                                     {errors.scheduled_at && <div className="text-red-500 text-sm mt-1">{errors.scheduled_at}</div>}
                                 </div>

                                 {/* Status */}
                                 <div className="mb-4">
                                     <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                     <select
                                         id="status"
                                         name="status"
                                         value={data.status}
                                         onChange={e => setData('status', e.target.value)}
                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                     >
                                         {statuses.map(status => (
                                             <option key={status} value={status}>{status}</option>
                                         ))}
                                     </select>
                                     {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                                 </div>

                                 {/* Completed At */}
                                 {data.status === 'completed' && (
                                     <div className="mb-4">
                                         <label htmlFor="completed_at" className="block text-sm font-medium text-gray-700">Completed At</label>
                                         <input
                                             type="datetime-local"
                                             id="completed_at"
                                             name="completed_at"
                                             value={data.completed_at}
                                             onChange={e => setData('completed_at', e.target.value)}
                                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                         />
                                         {errors.completed_at && <div className="text-red-500 text-sm mt-1">{errors.completed_at}</div>}
                                     </div>
                                 )}

                                 {/* Notes */}
                                 <div className="mb-4">
                                     <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                                     <textarea
                                         id="notes"
                                         name="notes"
                                         value={data.notes}
                                         onChange={e => setData('notes', e.target.value)}
                                         rows={4}
                                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                     />
                                     {errors.notes && <div className="text-red-500 text-sm mt-1">{errors.notes}</div>}
                                 </div>

                                 {/* Buttons */}
                                <div className="flex items-center justify-end mt-6">
                                    <Link href={route('schedules.index')} className="mr-4 ...">Cancel</Link>
                                    <button type="submit" className="..." disabled={processing}>{processing ? 'Saving...' : 'Update Schedule'}</button>
                                </div>
                             </form>
                        </div>
                    </div>
                 </div>
             </div>
        </AppLayout>
    );
}