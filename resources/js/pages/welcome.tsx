import gambar from '@/pages/1.jpg';
import gambar2 from '@/pages/2.jpg';
import gambar3 from '@/pages/3.jpg';
import gambar4 from '@/pages/4.jpg';
import bgAbout from '@/pages/bgabout.jpeg';
import logo from '@/pages/toya.png';
import { type SharedData } from '@/types';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle, Clock, FileText, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../css/welcome.css';

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

    // Create particles dynamically
    const createParticles = () => {
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        animationDuration: `${8 + Math.random() * 4}s`,
                    }}
                />,
            );
        }
        return particles;
    };

    return (
        <>
            <Head title="Toya Bumi Bersih">
                <meta
                    name="description"
                    content="Layanan perawatan filter air untuk perusahaan & toko. Sistem maintenance otomatis & laporan real-time!"
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
                                        className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Masuk
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section with 3D Carousel */}
                <section className="hero-section flex min-h-screen items-center justify-center">
                    {/* Background Effects */}
                    <div className="wave-bg"></div>

                    {/* Floating Bubbles */}
                    <div className="floating-bubbles">
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                    </div>

                    {/* Particles */}
                    <div className="particles">{createParticles()}</div>

                    <div className="hero-content">
                        <div className="container mx-auto max-w-7xl px-4">
                            <div className="grid items-center gap-8 lg:grid-cols-2">
                                {/* Text Section */}
                                <div className="z-10 lg:pr-8">
                                    <h1 className="hero-title text-glow">
                                        Jasa Perawatan & Instalasi Filter Air <span className="highlight-text">Terpercaya</span> untuk Bisnis Anda
                                    </h1>
                                    <p className="hero-subtitle">
                                        Sistem maintenance modern berbasis QR Code untuk memantau filter air Anda dari mana saja. Solusi terdepan
                                        untuk perusahaan, toko air minum, dan industri yang membutuhkan pengelolaan filter air yang efisien dan
                                        profesional.
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-4">
                                        <a
                                            href="https://wa.me/6289524874998"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-primary-custom"
                                        >
                                            <i className="fab fa-whatsapp mr-2"></i>
                                            Hubungi Kami
                                        </a>
                                        <a href="#tentang-kami" className="btn-outline-custom">
                                            Pelajari Lebih Lanjut
                                        </a>
                                    </div>
                                </div>

                                {/* 3D Carousel Section */}
                                <div className="z-10">
                                    <div className="carousel-3d-container">
                                        <div className="carousel-3d">
                                            <div className="carousel-item-3d">
                                                <img src={gambar} alt="ROSW System" className="filter-image-3d" />
                                                <span className="filter-title-3d">
                                                    System ROSW
                                                    <br />
                                                    Reverse Osmosis Sea Water
                                                </span>
                                            </div>
                                            <div className="carousel-item-3d">
                                                <img src={gambar2} alt="RTD System" className="filter-image-3d" />
                                                <span className="filter-title-3d">
                                                    System RTD
                                                    <br />
                                                    Ready to Drink
                                                </span>
                                            </div>
                                            <div className="carousel-item-3d">
                                                <img src={gambar3} alt="Tab Filter" className="filter-image-3d" />
                                                <span className="filter-title-3d">
                                                    Tab Filter
                                                    <br />
                                                    Advanced Filtration
                                                </span>
                                            </div>
                                            <div className="carousel-item-3d">
                                                <img src={gambar4} alt="ROBW System" className="filter-image-3d" />
                                                <span className="filter-title-3d">
                                                    System ROBW
                                                    <br />
                                                    Reverse Osmosis Brackish Water
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Highlights */}
                                    <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                                <Clock className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-white/90">Perawatan Terjadwal</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                                <QrCode className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-white/90">QR Code Tracking</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                                <CheckCircle className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-white/90">Laporan Real-time</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <p className="text-sm font-medium text-white/90">Invoice Online</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Tentang Kami */}
                <section id="tentang-kami" className="bg-cover bg-center bg-no-repeat px-4 py-24" style={{ backgroundImage: `url(${bgAbout})` }}>
                    <div className="mx-auto max-w-5xl rounded-xl bg-white/80 p-10 backdrop-blur-sm dark:bg-gray-900/80">
                        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">Tentang Kami</h2>
                        <div className="space-y-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                            <p>
                                Toya Bumi Bersih adalah perusahaan penyedia solusi pengolahan air bersih yang telah berpengalaman lebih dari satu
                                dekade. Dengan teknologi canggih seperti Reverse Osmosis, Ultra Filtration, dan UV Sterilizer, kami menghadirkan
                                sistem water treatment yang disesuaikan dengan karakteristik sumber air di setiap lokasi.
                            </p>
                            <p>
                                Kami memahami bahwa hampir 70% sumber air minum rumah tangga di Indonesia terkontaminasi, sehingga penting
                                menghadirkan sistem yang tidak hanya jernih secara visual, tetapi juga aman secara klinis. Seluruh hasil treatment
                                diuji di laboratorium resmi untuk memastikan air benar-benar layak konsumsi.
                            </p>
                            <p>
                                Toya Bumi Bersih telah dipercaya oleh berbagai sektor, dari rumah tangga hingga industri, untuk menurunkan biaya
                                operasional dan meningkatkan kualitas hidup melalui air bersih. Kami tidak sekadar menjual alat, namun memberikan
                                solusi jangka panjang yang hemat, efektif, dan bertanggung jawab.
                            </p>
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

                {/* Location Section */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">Lokasi Kantor Kami</h2>
                        <p className="mb-6 text-center text-xl text-gray-600 dark:text-gray-300">
                            Kunjungi kantor kami untuk konsultasi langsung tentang kebutuhan filter air bisnis Anda
                        </p>
                        <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
                            <MapView address="-6.160142,106.867702" />
                        </div>
                        <p className="mt-4 text-center text-base text-gray-700 dark:text-gray-300">
                            Alamat:{' '}
                            <a
                                href="https://www.google.com/maps?q=Jl+berlian+raya+no+382b+sumur+batu+kemayoran+Jakarta+pusat"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Jl. Berlian Raya No. 382B, Sumur Batu, Kemayoran, Jakarta Pusat
                            </a>
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-4 py-20">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                            Tingkatkan efisiensi perawatan filter air Anda sekarang juga dengan sistem IMMS
                        </h2>
                        <a
                            href="https://wa.me/6289524874998"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 px-8 py-3 text-base font-medium text-white hover:from-blue-700 hover:to-green-700 dark:hover:from-blue-800 dark:hover:to-green-800"
                        >
                            <i className="fab fa-whatsapp"></i>
                            Konsultasi Gratis Sekarang
                        </a>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 px-4 py-12 text-gray-300">
                    <div className="container mx-auto max-w-6xl">
                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Kolom 1 - Logo & Deskripsi */}
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <img src={logo} alt="Toya Bumi Bersih" className="h-16 w-auto object-contain" />
                                </div>
                                <p className="pr-4 text-sm leading-relaxed">
                                    Toya Bumi Bersih adalah penyedia sistem pengolahan air modern untuk rumah tangga, UMKM, dan industri. Kami
                                    menyediakan instalasi, perawatan, dan monitoring filter air yang efisien dan profesional untuk membantu Anda
                                    mendapatkan kualitas air terbaik.
                                </p>
                            </div>

                            {/* Kolom 2 - Layanan */}
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

                            {/* Kolom 3 - Perusahaan */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold text-white">Perusahaan</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <a href="#tentang-kami" className="hover:text-white">
                                            Tentang Kami
                                        </a>
                                    </li>
                                    <li>
                                        <a href="https://wa.me/6289524874998" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                                            Kontak WhatsApp
                                        </a>
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
