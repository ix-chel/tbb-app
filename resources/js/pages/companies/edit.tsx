// resources/js/Pages/Companies/Edit.tsx
import React from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';

interface CompanyData { id: number; name: string; email?: string; phone?: string; address?: string; registration_number?: string; contact_person_name?: string; contact_person_email?: string; contact_person_phone?: string; }
interface EditProps extends PageProps { company: CompanyData; }

export default function Edit({ auth, company, flash }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '', email: company.email || '', phone: company.phone || '', address: company.address || '',
        registration_number: company.registration_number || '', contact_person_name: company.contact_person_name || '',
        contact_person_email: company.contact_person_email || '', contact_person_phone: company.contact_person_phone || '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('companies.update', company.id));
    };

    return (
        <AppLayout user={auth.user} header={<h2 className="font-semibold text-xl ...">Edit Company</h2>}>
            <Head title={`Edit Company - ${company.name}`} />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                             {flash?.message && <div className="mb-4 p-4 bg-green-100 ...">{flash.message}</div>}
                             <form onSubmit={handleSubmit}>
                                 {/* ... Form fields sama seperti Create.tsx ... */}
                                 {/* Pastikan value diambil dari state `data` */}
                                  <div className="mb-4">
                                     <label htmlFor="name">Company Name *</label>
                                     <input type="text" id="name" value={data.name} onChange={e => setData('name', e.target.value)} required className="mt-1 block w-full ..."/>
                                     {errors.name && <p className="mt-1 ...">{errors.name}</p>}
                                  </div>
                                   {/* ... field email, phone, address, reg number, contact person ... */}

                                <div className="flex items-center justify-end mt-6">
                                    <Link href={route('companies.index')} className="mr-4 ...">Cancel</Link>
                                    <button type="submit" className="... disabled:opacity-50" disabled={processing}>
                                        {processing ? 'Saving...' : 'Update Company'}
                                    </button>
                                </div>
                             </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}