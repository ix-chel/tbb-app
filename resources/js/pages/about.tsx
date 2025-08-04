import logo from '@/pages/toya.png';
import { Head, Link } from '@inertiajs/react';

export default function About() {
    return (
        <>
            <Head title="Tentang Kami - Toya Bumi Bersih" />
            <div className="min-h-screen bg-gray-50 px-6 py-24 dark:bg-gray-900">
                <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow-xl dark:bg-gray-800">
                    <div className="mb-6 flex justify-center">
                        <img src={logo} alt="Logo Toya Bumi Bersih" className="h-20 w-auto object-contain" />
                    </div>
                    <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Tentang Toya Bumi Bersih</h1>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Indonesia adalah negara yang kaya akan sumber daya alam, namun ironisnya, air bersih yang merupakan elemen paling mendasar
                        dalam kehidupan manusia justru masih sulit diperoleh secara merata. Berdasarkan laporan UNICEF tahun 2022, hampir 70% sumber
                        air minum rumah tangga di Indonesia telah tercemar oleh limbah kotoran manusia. Kondisi ini diperburuk oleh perubahan iklim,
                        urbanisasi yang tidak terkendali, serta dampak pandemi Covid-19 yang memperlihatkan betapa rentannya sistem penyediaan air di
                        berbagai wilayah. Di sisi lain, kebutuhan terhadap air bersih tidak hanya menjadi isu rumah tangga, tetapi juga merupakan
                        komponen vital dalam keberlangsungan hampir seluruh jenis usaha — mulai dari industri makanan dan minuman, kesehatan,
                        perhotelan, hingga manufaktur.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Dalam konteks inilah <strong>Toya Bumi Bersih</strong> hadir, sebagai perusahaan penyedia solusi water treatment yang memiliki
                        pengalaman lebih dari satu dekade. Kami percaya bahwa setiap titik sumber air memiliki karakteristik yang unik dan membutuhkan
                        penanganan berbeda. Dengan mengusung teknologi canggih buatan Italia yang telah terbukti secara global, Toya Bumi Bersih
                        menawarkan solusi pengolahan air yang tidak hanya efektif, tetapi juga disesuaikan secara spesifik dengan kondisi mata air di
                        lokasi Anda. Tidak seperti pendekatan satu-alat-untuk-semua yang lazim digunakan di pasaran, kami melakukan survei dan
                        analisis mendalam untuk memastikan bahwa sistem yang dipasang benar-benar optimal.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Proses instalasi kami dimulai dengan pengambilan sampel air dan pengukuran kualitas awal. Selanjutnya, tim kami akan mengecek
                        lokasi pemasangan, melakukan konsultasi dengan klien terkait kebutuhan spesifik (seperti kapasitas, pH air, dan tujuan
                        penggunaan), kemudian menyusun rancangan instalasi dan anggaran biaya. Kami hanya akan melanjutkan ke tahap eksekusi setelah
                        klien menyetujui keseluruhan rencana. Setelah instalasi selesai, air hasil treatment akan kembali diuji di laboratorium resmi
                        untuk memastikan bahwa kualitasnya benar-benar sesuai dengan standar air layak minum berdasarkan Permenkes No. 492 Tahun 2010.
                        Proyek rumah tangga biasanya selesai dalam 1–2 hari, skala menengah 3–7 hari, dan skala industri besar 5–10 hari.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Beragam teknologi telah kami terapkan di berbagai lokasi di Indonesia — dari Reverse Osmosis (RO) Sea Water untuk air payau,
                        hingga sistem Ultra Filtration (UF), karbon aktif, dan mangan untuk mengatasi bau dan warna air tanah. Instalasi kami mencakup
                        pabrik karet di Tomata, kompleks perumahan di Tangerang, hingga rumah tangga dan UMKM di berbagai daerah. Keandalan sistem
                        kami tidak hanya terletak pada kemampuan menghasilkan air bersih, tetapi juga dalam efisiensi operasional jangka panjang.
                        Sebagai contoh, sebuah outlet minuman cup dengan konsumsi harian 130 liter air dapat menghemat hingga Rp 25 juta per tahun
                        bila beralih ke sistem water treatment kami, dibandingkan dengan membeli air galon isi ulang yang belum tentu higienis.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Bagi kebutuhan rumah tangga, sistem Toya Bumi Bersih memungkinkan keluarga untuk mendapatkan air minum berkualitas tinggi
                        langsung dari mata air atau PDAM, tanpa ketergantungan pada air kemasan yang mahal dan berisiko tercemar bahan kimia. Dalam
                        jangka panjang, investasi sebesar Rp 15–18 juta yang kami tawarkan dapat digunakan hingga 5–10 tahun, menjadikannya solusi
                        yang sangat ekonomis, higienis, dan ramah lingkungan.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Selain menawarkan produk dan layanan unggulan, kami juga menjunjung tinggi transparansi, edukasi, dan kemitraan jangka
                        panjang. Toya Bumi Bersih tidak sekadar menjual alat, tetapi membangun solusi. Kami mengedepankan komunikasi terbuka dengan
                        klien, melakukan validasi hasil dengan bukti laboratorium, serta memberikan edukasi tentang pentingnya menjaga kualitas air
                        dalam kehidupan sehari-hari. Karena kami percaya bahwa air bukan hanya kebutuhan teknis, melainkan hak dasar setiap manusia.
                    </p>

                    <p className="mb-6 text-justify leading-relaxed text-gray-700 dark:text-gray-300">
                        Kami mengundang Anda — baik sebagai pemilik rumah, pelaku usaha, developer, maupun pengelola industri — untuk bermitra dengan
                        Toya Bumi Bersih. Mari bersama-sama membangun sistem air yang lebih sehat, hemat biaya, dan berkelanjutan untuk masa depan
                        yang lebih baik. Konsultasikan kebutuhan Anda sekarang juga kepada tim ahli kami.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="welcome"
                            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                        >
                            ← Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
