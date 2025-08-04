<?php

namespace App\Http\Controllers;

use App\Models\FilterQR;
use App\Models\Store;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Label\Font\OpenSans;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Color\Color;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Label\LabelAlignment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FilterQRController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', FilterQR::class);

        $qrs = FilterQR::with(['store', 'filter'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('qr_code', 'like', "%{$search}%")
                      ->orWhereHas('store', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($request->input('status'), fn($query, $status) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('FilterQR/Index', [
            'qrs' => $qrs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', FilterQR::class);

        return Inertia::render('FilterQR/Create', [
            'stores' => Store::select(['id', 'name', 'address', 'contact_person', 'contact_phone', 'contact_email'])->get(),
            'filters' => InventoryItem::where('type', 'filter')->select('id', 'name', 'type')->get(),
        ]);
    }

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

        // 1. Generate UUID sebagai qr_code
        $qrCode = Str::uuid()->toString();
        Storage::disk('public')->makeDirectory('qrcodes');

        // 2. Simpan ke database
        $filterQR = FilterQR::create([
            ...$validated,
            'qr_code' => $qrCode,
            'status' => 'active',
        ]);

        // 3. Buat URL redirect ke route QR
       $url = route('filter.qr.scan', ['qrCode' => $filterQR->qr_code]);

        // 4. Generate QR image pakai builder Endroid
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $url,
            encoding: new Encoding('ISO-8859-1'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            foregroundColor: new Color(0, 0, 0),
            backgroundColor: new Color(255, 255, 255),
            labelText: 'Filter QR Code',
            labelFont: new OpenSans(20),
            labelAlignment: LabelAlignment::Center
        );

        $result = $builder->build();
        $qrCodeString = $result->getString();

        $path = "qrcodes/{$filterQR->id}.png";
        if (!Storage::disk('public')->put($path, $qrCodeString)) {
            $filterQR->delete();
            return back()->withErrors(['error' => 'Gagal menyimpan QR code']);
        }

        return redirect()->route('FilterQR.index')->with('message', 'QR code berhasil dibuat.');
    }

    public function show(FilterQR $filterQR): Response
    {
        $this->authorize('view', $filterQR);

        $filterQR->load(['store:id,name,address,contact_person,contact_phone,contact_email', 'filter:id,name,type']);

        return Inertia::render('FilterQR/Show', [
            'qr' => [
                'id' => $filterQR->id,
                'qr_code' => $filterQR->qr_code,
                'status' => $filterQR->status,
                'installation_date' => optional($filterQR->installation_date)->toDateString(),
                'expiry_date' => optional($filterQR->expiry_date)->toDateString(),
                'last_scan_at' => optional($filterQR->last_scan_at)->toDateTimeString(),
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

        return redirect()->route('FilterQR.show', $filterQR)->with('message', 'Status QR code berhasil diperbarui.');
    }

    public function destroy(FilterQR $filterQR)
    {
        $this->authorize('delete', $filterQR);

        Storage::disk('public')->delete("qrcodes/{$filterQR->id}.png");
        $filterQR->delete();

        return redirect()->route('FilterQR.index')->with('message', 'QR code berhasil dihapus.');
    }

    public function scan(Request $request)
    {
        $validated = $request->validate([
            'qr_code' => 'required|string|exists:filter_qrs,qr_code',
        ]);

        $filterQR = FilterQR::where('qr_code', $validated['qr_code'])->first();

        if ($filterQR) {
            $filterQR->update(['last_scan_at' => now()]);

            return response()->json([
                'message' => 'QR code berhasil di-scan',
                'data' => $filterQR->load(['store', 'filter']),
            ]);
        }

        return response()->json(['message' => 'QR code tidak ditemukan'], 404);
    }

    public function download(FilterQR $filterQR)
    {
        $this->authorize('view', $filterQR);

        $path = "qrcodes/{$filterQR->id}.png";
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'File QR code tidak ditemukan'], 404);
        }

        return Storage::disk('public')->download($path, "qr-code-{$filterQR->id}.png", [
            'Content-Type' => 'image/png',
        ]);
    }

    public function scanAndRedirect($qrCode)
    {
        // Temukan Filter QR Code aktif
        $filterQR = FilterQR::where('qr_code', $qrCode)
            ->where('status', 'active')
            ->first();

        if (!$filterQR) {
            return redirect()->route('dashboard')->with('error', 'QR Code tidak ditemukan atau tidak aktif.');
        }

        // Update last_scan_at
        $filterQR->update(['last_scan_at' => now()]);

        // Cek role user yang sedang login
        $user = auth()->user();
        
        if ($user->hasRole('technician')) {
            // Untuk teknisi, arahkan ke halaman maintenance report dengan foto
            return redirect()->route('technician.maintenance.create', [
                'store_id' => $filterQR->store_id,
                'qr_code' => $qrCode
            ]);
        } else {
            // Untuk role lain, arahkan ke halaman maintenance report biasa
            return redirect()->route('maintenance.reports.create', [
                'store_id' => $filterQR->store_id
            ]);
        }
    }
}
