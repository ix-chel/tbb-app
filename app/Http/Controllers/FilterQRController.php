<?php

namespace App\Http\Controllers;

use App\Models\FilterQR;
use App\Models\Store;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Label\Label;
use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
use Endroid\QrCode\Label\Alignment\LabelAlignmentCenter;
use Endroid\QrCode\Label\Font\NotoSans;
use Endroid\QrCode\RoundBlockSizeMode\RoundBlockSizeModeMargin;
//use Endroid\QrCode\ErrorCorrectionLevel\ErrorCorrectionLevelHigh;
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

        $stores = Store::select('id', 'name')->get();
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
    public function store(Request $request)
    {
        $this->authorize('create', FilterQR::class);

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'filter_id' => [
                'required',
                'exists:inventory_items,id',
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

        // Generate QR code
        $qrCode = Str::uuid()->toString();
        
        // Buat QR code dengan Builder pattern sesuai versi 6.x
        $result = Builder::create()
            ->writer(new PngWriter())
            ->writerOptions([])
            ->data($qrCode)
            ->encoding(new Encoding('UTF-8'))
            ->errorCorrectionLevel(new ErrorCorrectionLevelHigh())
            ->size(300)
            ->margin(10)
            ->roundBlockSizeMode(new RoundBlockSizeModeMargin())
            ->foregroundColor(0, 0, 0)
            ->backgroundColor(255, 255, 255)
            ->labelText('Filter QR Code')
            ->labelFont(new NotoSans(20))
            ->labelAlignment(new LabelAlignmentCenter())
            ->build();

        // Generate QR code image
        $qrImage = $result->getString();

        // Simpan QR code
        $filterQR = FilterQR::create([
            ...$validated,
            'qr_code' => $qrCode,
            'status' => 'active',
        ]);

        // Simpan QR image ke storage
        $path = "qrcodes/{$filterQR->id}.png";
        \Storage::put("public/{$path}", $qrImage);

        return redirect()->route('FilterQR.index')
            ->with('message', 'QR code berhasil dibuat.');
    }

    /**
     * Menampilkan detail QR code
     */
    public function show(FilterQR $filterQR): Response
    {
        $this->authorize('view', $filterQR);

        $filterQR->load(['store', 'filter']);

        return Inertia::render('FilterQR/Show', [
            'qr' => $filterQR,
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
} 