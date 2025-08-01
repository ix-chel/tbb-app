import gambar from '@/pages/1.jpg';
import gambar2 from '@/pages/2.jpg';
import gambar3 from '@/pages/3.jpg';
import gambar4 from '@/pages/4.jpg';
import logo from '@/pages/toya.png';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle, Clock, FileText, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
//import { LatLngExpression } from 'leaflet';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const MapView = ({ address }: { address: string }) => {
    const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // Check if address is already coordinates (lat,lon format)
        if (address.includes(',') && address.split(',').length === 2) {
            const [latStr, lonStr] = address.split(',');
            const lat = parseFloat(latStr.trim());
            const lon = parseFloat(lonStr.trim());

            if (!isNaN(lat) && !isNaN(lon)) {
                setCoordinates({ lat, lon });
                setLoading(false);
                return;
            }
        }

        // Otherwise, geocode the address using Nominatim API
        axios
            .get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: address,
                    format: 'json',
                    limit: 1,
                },
            })
            .then((response) => {
                if (response.data && response.data[0]) {
                    const lat = parseFloat(response.data[0].lat);
                    const lon = parseFloat(response.data[0].lon);
                    setCoordinates({ lat, lon });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching location from Nominatim:', error);
                setLoading(false);
            });
    }, [address]);

    if (loading) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
                </div>
            </div>
        );
    }

    if (!coordinates) {
        return (
            <div className="flex h-[400px] w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-700">
                <p className="text-gray-600 dark:text-gray-300">Unable to load map for: {address}</p>
            </div>
        );
    }

    // Menggunakan OpenStreetMap embed dengan koordinat yang lebih spesifik
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon - 0.002},${coordinates.lat - 0.002},${coordinates.lon + 0.002},${coordinates.lat + 0.002}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`;
    document.title = `Jl berlian raya no 382b sumur batu kemayoran Jakarta pusat`;
    return (
        <div className="h-[400px] w-full overflow-hidden rounded-lg shadow-lg">
            <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} title="Map of Toya Bumi Bersih Office Location" loading="lazy" />
        </div>
    );
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props || {};

    return (
        <>
            <Head title="Toya Bumi Bersih">
                <meta
                    name="description"
                    content="Layanan perawatan filter air untuk perusahaan & toko. Sistem maintenance otomatis & laporan real-time. Daftar gratis sekarang!"
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header/Navigation */}
                <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
                    <nav className="container mx-auto flex items-center justify-between px-4 py-4">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Toya Bumi Bersih" className="h-20 w-auto object-contain" />
                        </div>
                        <div className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="ext-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-blue-600 px-10 py-5 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="px-4 pt-32 pb-20">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h1 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
                                    Jasa Perawatan & Instalasi Filter Air <span className="text-blue-600">Terpercaya</span> untuk Bisnis Anda
                                </h1>
                                <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
                                    Sistem maintenance modern berbasis QR Code untuk memantau filter air Anda dari mana saja
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Daftar Sekarang
                                    </Link>
                                    <a
                                        href="https://wa.me/6289524874998"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Konsultasi Gratis
                                    </a>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center justify-center">
                                <Carousel className="w-[320px]">
                                    <CarouselContent>
                                        <CarouselItem>
                                            <div className="flex flex-col items-center">
                                                <img src={gambar} alt="Toya Bumi Bersih 1" className="mx-auto h-80 w-600 object-contain" />
                                                <span className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    system ROSW = reverse osmosis sea water
                                                </span>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="flex flex-col items-center">
                                                <img src={gambar2} alt="Toya Bumi Bersih 2" className="mx-auto h-80 w-600 object-contain" />
                                                <span className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    system RTD/ready to drink
                                                </span>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="flex flex-col items-center">
                                                <img src={gambar3} alt="Toya Bumi Bersih 3" className="mx-auto h-80 w-600 object-contain" />
                                                <span className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    tab filter
                                                </span>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <div className="flex flex-col items-center">
                                                <img src={gambar4} alt="Toya Bumi Bersih 4" className="mx-auto h-80 w-600 object-contain" />
                                                <span className="mt-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                    ROBW
                                                </span>
                                            </div>
                                        </CarouselItem>
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Keunggulan Section */}
                <section className="bg-white px-4 py-20 dark:bg-gray-800">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">Keunggulan Kami</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <Clock className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Jadwal Perawatan Otomatis</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Sistem akan mengingatkan jadwal perawatan filter air secara otomatis
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <QrCode className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">QR Code per Cabang</h3>
                                <p className="text-gray-600 dark:text-gray-300">Setiap cabang memiliki QR Code unik untuk memudahkan tracking</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <CheckCircle className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Laporan Teknisi Real-time</h3>
                                <p className="text-gray-600 dark:text-gray-300">Pantau aktivitas teknisi secara real-time melalui sistem</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <FileText className="mb-4 h-12 w-12 text-blue-600 dark:text-blue-400" />
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Invoice & Histori Online</h3>
                                <p className="text-gray-600 dark:text-gray-300">Akses invoice dan histori servis kapan saja dan di mana saja</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cara Kerja Section */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">Cara Kerja Sistem</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="relative">
                                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                        1
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Client Daftar</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Daftar sebagai client dan diverifikasi oleh admin</p>
                                </div>
                                <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-gray-200 lg:block dark:bg-gray-700"></div>
                            </div>
                            <div className="relative">
                                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                        2
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Atur QR Code</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Admin mengatur QR Code untuk setiap cabang</p>
                                </div>
                                <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-gray-200 lg:block dark:bg-gray-700"></div>
                            </div>
                            <div className="relative">
                                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                        3
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Instalasi & Perawatan</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Teknisi melakukan instalasi dan perawatan sesuai jadwal</p>
                                </div>
                                <div className="absolute top-1/2 -right-4 hidden h-0.5 w-8 bg-gray-200 lg:block dark:bg-gray-700"></div>
                            </div>
                            <div>
                                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                        4
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Laporan & Invoice</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Client menerima laporan dan invoice secara otomatis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Target Audience Section */}
                <section className="bg-white px-4 py-20 dark:bg-gray-800">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">Untuk Siapa Layanan Ini?</h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Perusahaan Retail</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Waralaba dan franchise yang membutuhkan manajemen filter air terpusat
                                </p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Toko Air Minum</h3>
                                <p className="text-gray-600 dark:text-gray-300">Bisnis air minum isi ulang yang membutuhkan perawatan rutin</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Pabrik & Industri</h3>
                                <p className="text-gray-600 dark:text-gray-300">Industri yang membutuhkan sistem pengolahan air terintegrasi</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700">
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Developer Properti</h3>
                                <p className="text-gray-600 dark:text-gray-300">Pengembang ruko dan properti yang membutuhkan solusi air bersih</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Location Section - Posisi yang Strategis */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">Lokasi Kantor Kami</h2>
                        <p className="mb-12 text-center text-xl text-gray-600 dark:text-gray-300">
                            Kunjungi kantor kami untuk konsultasi langsung tentang kebutuhan filter air bisnis Anda
                        </p>
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
                            <MapView address="-6.160142,106.867702" />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
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
                <footer className="bg-gray-900 px-4 py-12 text-gray-300">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <img src={logo} alt="Toya Bumi Bersih" className="h-50 w-50 object-contain" />
                                </div>
                                <p className="text-sm">
                                    Sistem manajemen perawatan filter air untuk bisnis Anda. Daftar gratis dan nikmati layanan kami.{' '}
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-white">Layanan</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Instalasi Filter
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Perawatan Rutin
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Konsultasi
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-white">Perusahaan</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Tentang Kami
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="https://wa.me/6289524874998" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                            Kontak WhatsApp
                                        </a>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Karir
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Kebijakan Privasi
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-white">
                                            Syarat & Ketentuan
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
                            <p className="text-gray-400">© {new Date().getFullYear()} Toya Bumi Bersih. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
