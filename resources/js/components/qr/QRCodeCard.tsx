import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Power } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export interface QRCodeData {
    id: number;
    status: 'active' | 'inactive';
    created_at: string;
    scan_count: number;
    qr_path: string;
}

interface QRCodeCardProps {
    qr: QRCodeData;
    onToggleStatus: (qr: QRCodeData) => void;
    onDownload: (qr: QRCodeData) => void;
}

export function QRCodeCard({ qr, onToggleStatus, onDownload }: QRCodeCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    QR Code #{qr.id}
                </CardTitle>
                <Badge variant={qr.status === 'active' ? 'default' : 'secondary'}>
                    {qr.status === 'active' ? 'Aktif' : 'Nonaktif'}
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center">
                        <img 
                            src={qr.qr_path ? `/storage/qrcodes/${qr.qr_path}` : `/storage/qrcodes/${qr.id}.png`}
                            alt={`QR Code ${qr.id}`}
                            className="w-48 h-48 object-contain"
                            onError={(e) => {
                                // fallback jika gambar tidak ditemukan
                                (e.target as HTMLImageElement).src = '/storage/qrcodes/placeholder.png';
                            }}
                            onLoad={(e) => {
                                console.log('QR Code loaded successfully:', qr.qr_path ? `/storage/qrcodes/${qr.qr_path}` : `/storage/qrcodes/${qr.id}.png`);
                            }}
                        />
                    </div>
                    <div className="space-y-2 text-sm">
                        <p>Dibuat: {format(new Date(qr.created_at), 'dd MMM yyyy HH:mm', { locale: id })}</p>
                        <p>Total Scan: {qr.scan_count}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onToggleStatus(qr)}
                        >
                            <Power className="w-4 h-4 mr-2" />
                            {qr.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownload(qr)}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}