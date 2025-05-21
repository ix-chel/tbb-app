import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, QrCode, FileText, ChevronRight } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props || {};

    return (
        <>
            <Head title="Jasa Perawatan Filter Air Profesional Berbasis QR Code">
                <meta name="description" content="Layanan perawatan filter air untuk perusahaan & toko. Sistem maintenance otomatis & laporan real-time. Daftar gratis sekarang!" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header/Navigation */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                    <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <QrCode className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-semibold text-gray-900 dark:text-white">Toya Bumi Bersih</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-lg border border-gray-200 dark:border-gray-700 px-5 py-2 text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                    Jasa Perawatan & Instalasi Filter Air Terpercaya untuk Bisnis Anda
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                    Sistem maintenance modern berbasis QR Code untuk memantau filter air Anda dari mana saja
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                    <Link
                                        href="#contact"
                                        className="inline-block rounded-lg border border-gray-300 dark:border-gray-600 px-8 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        Konsultasi Gratis
                                    </Link>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-8">
                                    <div className="h-full w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
                                        <div className="space-y-4">
                                            <div className="h-8 w-3/4 rounded bg-gray-100 dark:bg-gray-700"></div>
                                            <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-700"></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="h-32 rounded bg-gray-100 dark:bg-gray-700"></div>
                                                <div className="h-32 rounded bg-gray-100 dark:bg-gray-700"></div>
                                            </div>
                                            <div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-700"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Keunggulan Section */}
                <section className="py-20 px-4 bg-white dark:bg-gray-800">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Keunggulan Kami
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <Clock className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Jadwal Perawatan Otomatis
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Sistem akan mengingatkan jadwal perawatan filter air secara otomatis
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <QrCode className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    QR Code per Cabang
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Setiap cabang memiliki QR Code unik untuk memudahkan tracking
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <CheckCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Laporan Teknisi Real-time
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Pantau aktivitas teknisi secara real-time melalui sistem
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <FileText className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Invoice & Histori Online
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Akses invoice dan histori servis kapan saja dan di mana saja
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cara Kerja Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Cara Kerja Sistem
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="relative">
                                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">
                                        1
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Client Daftar
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Daftar sebagai client dan diverifikasi oleh admin
                                    </p>
                                </div>
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="relative">
                                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">
                                        2
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Atur QR Code
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Admin mengatur QR Code untuk setiap cabang
                                    </p>
                                </div>
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div className="relative">
                                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">
                                        3
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Instalasi & Perawatan
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Teknisi melakukan instalasi dan perawatan sesuai jadwal
                                    </p>
                                </div>
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                            </div>
                            <div>
                                <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mb-4">
                                        4
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Laporan & Invoice
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        Client menerima laporan dan invoice secara otomatis
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Target Audience Section */}
                <section className="py-20 px-4 bg-white dark:bg-gray-800">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                            Untuk Siapa Layanan Ini?
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Perusahaan Retail
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Waralaba dan franchise yang membutuhkan manajemen filter air terpusat
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Toko Air Minum
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Bisnis air minum isi ulang yang membutuhkan perawatan rutin
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Pabrik & Industri
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Industri yang membutuhkan sistem pengolahan air terintegrasi
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Developer Properti
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Pengembang ruko dan properti yang membutuhkan solusi air bersih
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Tingkatkan efisiensi perawatan filter air Anda sekarang juga dengan sistem IMMS
                        </h2>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            Daftar Gratis Sekarang
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-300 py-12 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <QrCode className="w-8 h-8 text-blue-400" />
                                    <span className="text-xl font-semibold text-white">Toya Bumi Bersih</span>
                                </div>
                                <p className="text-gray-400">
                                    Sistem manajemen filter air berbasis QR Code untuk bisnis Anda
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Layanan</h3>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-white">Instalasi Filter</Link></li>
                                    <li><Link href="#" className="hover:text-white">Perawatan Rutin</Link></li>
                                    <li><Link href="#" className="hover:text-white">Konsultasi</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Perusahaan</h3>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-white">Tentang Kami</Link></li>
                                    <li><Link href="#" className="hover:text-white">Kontak</Link></li>
                                    <li><Link href="#" className="hover:text-white">Karir</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li><Link href="#" className="hover:text-white">Kebijakan Privasi</Link></li>
                                    <li><Link href="#" className="hover:text-white">Syarat & Ketentuan</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                            <p className="text-gray-400">
                                © 2024 Toya Bumi Bersih. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
