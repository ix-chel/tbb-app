import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { QrCode, Camera, AlertCircle, X, Smartphone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Props {
    error?: string;
}

export default function Scan({ error }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        qr_code: '',
    });

    const [scanResult, setScanResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    // Deteksi mobile device
    useEffect(() => {
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            setIsMobile(isMobileDevice);
        };
        
        checkMobile();
    }, []);

    const handleManualInput = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.qr_code.trim()) {
            setIsScanning(true);
            // Redirect ke route scan
            window.location.href = route('filter.qr.scan', { qrCode: data.qr_code.trim() });
        }
    };

    const handleCameraScan = () => {
        setShowCamera(true);
        setIsScanning(true);
    };

    const handleCloseCamera = () => {
        setShowCamera(false);
        setIsScanning(false);
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
    };

    const onScanSuccess = (decodedText: string) => {
        console.log('QR Code detected:', decodedText);
        setScanResult(decodedText);
        setData('qr_code', decodedText);
        
        // Auto redirect setelah scan berhasil
        setTimeout(() => {
            window.location.href = route('filter.qr.scan', { qrCode: decodedText });
        }, 1000);
    };

    const onScanError = (error: any) => {
        // Handle scan error silently
        console.log('Scan error:', error);
    };

    useEffect(() => {
        if (showCamera && !scannerRef.current) {
            const config = {
                fps: 10, 
                qrbox: isMobile ? { width: 200, height: 200 } : { width: 250, height: 250 },
                aspectRatio: 1.0
            };
            
            scannerRef.current = new Html5QrcodeScanner("reader", config, false);
            scannerRef.current.render(onScanSuccess, onScanError);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        };
    }, [showCamera, isMobile]);

    return (
        <AppLayout>
            <Head title="Scan QR Code Filter" />

            <div className="min-h-screen bg-gradient-to-br from-white to-cyan-50/30">
                <div className="mx-auto px-4 py-4 sm:px-12 sm:py-8" style={{ maxWidth: 'calc(100vw - 32px)' }}>
                    <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
                        <div>
                            <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-4 py-4 sm:px-8 sm:py-6">
                                    <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-slate-900">
                                        <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-600" />
                                        Scan QR Code Filter
                                    </CardTitle>
                                    <p className="mt-2 text-sm sm:text-base text-slate-600">
                                        Scan QR code filter untuk membuat maintenance report
                                    </p>
                                    {isMobile && (
                                        <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <Smartphone className="h-4 w-4 text-blue-600" />
                                            <p className="text-sm text-blue-700">
                                                <strong>Mode Mobile:</strong> Gunakan kamera smartphone untuk scan QR code
                                            </p>
                                        </div>
                                    )}
                                </CardHeader>
                                <CardContent className="p-4 sm:p-8">
                                    {error && (
                                        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                            <p className="text-red-700">{error}</p>
                                        </div>
                                    )}

                                    {showCamera ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-slate-800">Scan QR Code dengan Kamera</h3>
                                                <Button
                                                    onClick={handleCloseCamera}
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Tutup Kamera</span>
                                                </Button>
                                            </div>
                                            <div id="reader" className="w-full max-w-md mx-auto" style={{ minHeight: isMobile ? '250px' : '300px' }}></div>
                                            {scanResult && (
                                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                    <p className="text-green-700">
                                                        <strong>QR Code terdeteksi:</strong> {scanResult}
                                                    </p>
                                                    <p className="text-sm text-green-600 mt-1">
                                                        Mengarahkan ke halaman maintenance report...
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Manual Input */}
                                            <div className="space-y-4">
                                                <Label className="text-lg font-semibold text-slate-800">
                                                    Masukkan QR Code Manual
                                                </Label>
                                                <form onSubmit={handleManualInput} className="space-y-4">
                                                    <Input
                                                        value={data.qr_code}
                                                        onChange={(e) => setData('qr_code', e.target.value)}
                                                        placeholder="Masukkan kode QR..."
                                                        className="h-12 sm:h-14 text-base sm:text-lg"
                                                    />
                                                    {errors.qr_code && (
                                                        <p className="text-sm text-red-500">{errors.qr_code}</p>
                                                    )}
                                                    <Button 
                                                        type="submit" 
                                                        disabled={processing || !data.qr_code.trim()}
                                                        className="h-12 sm:h-14 w-full"
                                                    >
                                                        {processing ? 'Memproses...' : 'Scan QR Code'}
                                                    </Button>
                                                </form>
                                            </div>

                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center">
                                                    <span className="w-full border-t border-slate-200" />
                                                </div>
                                                <div className="relative flex justify-center text-xs uppercase">
                                                    <span className="bg-white px-2 text-slate-500">Atau</span>
                                                </div>
                                            </div>

                                            {/* Camera Scan */}
                                            <div className="space-y-4">
                                                <Label className="text-lg font-semibold text-slate-800">
                                                    Scan dengan Kamera
                                                </Label>
                                                <Button 
                                                    onClick={handleCameraScan}
                                                    variant="outline"
                                                    className="h-12 sm:h-14 w-full"
                                                >
                                                    <Camera className="mr-2 h-5 w-5" />
                                                    Buka Kamera
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
                                <CardHeader className="border-b border-cyan-100/50 bg-gradient-to-r from-cyan-50 to-white px-4 py-4 sm:px-8 sm:py-6">
                                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">
                                        Instruksi Scan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                                                1
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">Pilih Metode Scan</h3>
                                                <p className="text-sm text-slate-600">
                                                    Gunakan input manual atau kamera untuk scan QR code
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                                                2
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">Verifikasi QR Code</h3>
                                                <p className="text-sm text-slate-600">
                                                    Sistem akan memverifikasi QR code dan mengambil data store
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                                                3
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">Buat Maintenance Report</h3>
                                                <p className="text-sm text-slate-600">
                                                    Anda akan diarahkan ke form maintenance report dengan data store terisi otomatis
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                        <h4 className="font-semibold text-amber-800">Tips:</h4>
                                        <ul className="mt-2 space-y-1 text-sm text-amber-700">
                                            <li>• Pastikan QR code dalam kondisi baik dan tidak rusak</li>
                                            <li>• Pastikan koneksi internet stabil</li>
                                            <li>• Jika scan gagal, coba input manual</li>
                                            <li>• Untuk smartphone, pastikan browser mengizinkan akses kamera</li>
                                            <li>• Pastikan QR code berada dalam frame kamera</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 