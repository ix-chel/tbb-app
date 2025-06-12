<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Maintenance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
        }
        .status-good {
            background-color: #d4edda;
            color: #155724;
        }
        .status-needs-attention {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-broken {
            background-color: #f8d7da;
            color: #721c24;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 11px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Maintenance</h1>
        <p>Tanggal: {{ now()->format('d F Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Store</th>
                <th>Teknisi</th>
                <th>Status</th>
                <th>Filter Diganti</th>
                <th>Catatan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reports as $report)
            <tr>
                <td>{{ $report->created_at->format('d/m/Y H:i') }}</td>
                <td>{{ $report->store->name }}</td>
                <td>{{ $report->technician->name }}</td>
                <td>
                    <span class="status status-{{ $report->equipment_status }}">
                        @if($report->equipment_status === 'good')
                            Baik
                        @elseif($report->equipment_status === 'needs_attention')
                            Perlu Perhatian
                        @else
                            Rusak
                        @endif
                    </span>
                </td>
                <td>{{ $report->filter_changed ? $report->filter_type : '-' }}</td>
                <td>{{ $report->notes }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dokumen ini digenerate secara otomatis oleh sistem</p>
    </div>
</body>
</html> 