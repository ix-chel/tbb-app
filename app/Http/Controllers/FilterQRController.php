<?php

namespace App\Http\Controllers;

use App\Models\FilterQR;
use App\Models\Store;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Label\LabelAlignment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class FilterQRController extends Controller
{
    use AuthorizesRequests;

    /**
     * Menampilkan daftar QR code
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', FilterQR::class);

        $qrs = FilterQR::with(['store', 'filter'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('qr_code', 'like', "%{$search}%")
                    ->orWhereHas('store', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('FilterQR/Index', [
            'qrs' => $qrs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menampilkan form untuk membuat QR code baru
     */
    public function create(): Response
    {
        $this->authorize('create', FilterQR::class);

        $stores = Store::select([
            'id', 
            'name', 
            'address',
            'contact_person',
            'contact_phone',
            'contact_email'
        ])->get();
        
        $filters = InventoryItem::where('type', 'filter')
            ->select('id', 'name', 'type')
            ->get();

        return Inertia::render('FilterQR/Create', [
            'stores' => $stores,
            'filters' => $filters,
        ]);
    }

    /**
     * Menyimpan QR code baru
     */
    use AuthorizesRequests;

    /**
     * Menyimpan QR code baru
     */
    public function store(Request $request)
    {
        $this->authorize('create', FilterQR::class);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'filter_id' => [
                'required',
                'exists:Inventory_items,id',
                function ($attribute, $value, $fail) {
                    $item = InventoryItem::find($value);
                    if (!$item || $item->type !== 'filter') {
                        $fail('Item yang dipilih harus berupa filter.');
                    }
                },
            ],
            'installation_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after:installation_date',
            'notes' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email',
        ]);

        // Generate UUID untuk QR code
        $qrCode = Str::uuid()->toString();

        // Pastikan folder qrcodes ada
        Storage::makeDirectory('/qrcodes');

        // Buat QR code menggunakan Builder (versi 6.0.0)
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $qrCode,
            encoding: new Encoding('ISO-8859-1'), // Gunakan ISO-8859-1 untuk kompatibilitas scanner
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            foregroundColor: new Color(0, 0, 0), // Warna hitam
            backgroundColor: new Color(255, 255, 255), // Latar belakang putih
            labelText: 'Filter QR Code',
            labelFont: new OpenSans(20), // Menggunakan Font class dari Endroid QR Code
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();

        // Simpan QR code ke database
        $filterQR = FilterQR::create([
            ...$validated,
            'qr_code' => $qrCode,
            'status' => 'active',
        ]);

        // Simpan QR code ke storage
        $path = "qrcodes/{$filterQR->id}.png";
        $qrCodeString = $result->getString();
        
        if (!Storage::put("{$path}", $qrCodeString)) {
            // Jika gagal menyimpan, hapus record dari database
            $filterQR->delete();
            return back()->withErrors(['error' => 'Gagal menyimpan QR code']);
        }

        return redirect()->route('FilterQR.index')
            ->with('message', 'QR code berhasil dibuat.');
    }


    /**
     * Menampilkan detail QR code
     */
    public function show(FilterQR $filterQR): Response
    {
        $this->authorize('view', $filterQR);

        $filterQR->load([
            'store' => function ($query) {
                $query->select([
                    'id',
                    'name',
                    'address',
                    'contact_person',
                    'contact_phone',
                    'contact_email'
                ]);
            },
            'filter' => function ($query) {
                $query->select([
                    'id',
                    'name',
                    'type'
                ]);
            },
        ]);

        return Inertia::render('FilterQR/Show', [
            'qr' => [
                'id' => $filterQR->id,
                'qr_code' => $filterQR->qr_code,
                'status' => $filterQR->status,
                'installation_date' => $filterQR->installation_date ? $filterQR->installation_date->toDateString() : null,
                'expiry_date' => $filterQR->expiry_date ? $filterQR->expiry_date->toDateString() : null,
                'last_scan_at' => $filterQR->last_scan_at ? $filterQR->last_scan_at->toDateTimeString() : null,
                'notes' => $filterQR->notes,
                'contact_person' => $filterQR->contact_person,
                'contact_phone' => $filterQR->contact_phone,
                'contact_email' => $filterQR->contact_email,
                'store_id' => $filterQR->store_id,
                'store' => $filterQR->store,
                'filter_id' => $filterQR->filter_id,
                'filter' => $filterQR->filter,
            ],
        ]);
    }

    /**
     * Memperbarui status QR code
     */
    public function update(Request $request, FilterQR $filterQR)
    {
        $this->authorize('update', $filterQR);

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,expired',
            'notes' => 'nullable|string',
            'contact_person' => 'nullable|string',
            'contact_phone' => 'nullable|string',
            'contact_email' => 'nullable|email',
        ]);

        $filterQR->update($validated);

        return redirect()->route('FilterQR.show', $filterQR)
            ->with('message', 'Status QR code berhasil diperbarui.');
    }

    /**
     * Menghapus QR code
     */
    public function destroy(FilterQR $filterQR)
    {
        $this->authorize('delete', $filterQR);

        // Hapus QR image dari storage
        \Storage::delete("public/qrcodes/{$filterQR->id}.png");

        $filterQR->delete();

        return redirect()->route('FilterQR.index')
            ->with('message', 'QR code berhasil dihapus.');
    }

    /**
     * Scan QR code
     */
    public function scan(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|exists:filter_qrs,qr_code',
        ]);

        $filterQR = FilterQR::where('qr_code', $validated['qr_code'])->first();
        
        if ($filterQR) {
            $filterQR->update([
                'last_scan_at' => now(),
            ]);

            return response()->json([
                'message' => 'QR code berhasil di-scan',
                'data' => $filterQR->load(['store', 'filter']),
            ]);
        }

        return response()->json([
            'message' => 'QR code tidak ditemukan',
        ], 404);
    }

    /**
     * Download QR code
     */
    public function download(FilterQR $filterQR)
    {
        $this->authorize('view', $filterQR);

        $path = "public/qrcodes/{$filterQR->id}.png";
        
        if (!Storage::exists($path)) {
            return response()->json([
                'message' => 'File QR code tidak ditemukan'
            ], 404);
        }

        return Storage::download($path, "qr-code-{$filterQR->id}.png");
    }
} 