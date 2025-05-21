<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Store;
use App\Models\User; // Pastikan ini di-import jika belum
use App\Models\MaintenanceSchedule; // Import jika Anda menggunakan relasi schedule
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FeedbackController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', Feedback::class);

        $query = Feedback::with(['user:id,name', 'store:id,name']) // Hanya pilih kolom yang dibutuhkan
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) { // Grup kondisi OR
                    $q->where('comment', 'like', "%{$search}%") // Asumsi title tidak ada, mungkin maksudnya comment?
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('store', function ($storeQuery) use ($search) {
                          $storeQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->input('type'), function ($query, $type) {
                $query->where('type', $type); // Asumsi ada kolom 'type' di tabel feedback
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status); // Asumsi ada kolom 'status' di tabel feedback
            });

        $feedbacks = $query->latest()->paginate(12)->withQueryString();

        // Opsi untuk filter dropdown (contoh, Anda bisa membuatnya lebih dinamis)
        $feedbackTypes = [ // Atau ambil dari database/config
            ['value' => 'bug_report', 'label' => 'Bug Report'],
            ['value' => 'suggestion', 'label' => 'Suggestion'],
            ['value' => 'complaint', 'label' => 'Complaint'],
            ['value' => 'compliment', 'label' => 'Compliment'],
        ];
        $feedbackStatuses = [ // Atau ambil dari database/config
            ['value' => 'new', 'label' => 'New'],
            ['value' => 'in_progress', 'label' => 'In Progress'],
            ['value' => 'resolved', 'label' => 'Resolved'],
            ['value' => 'closed', 'label' => 'Closed'],
        ];

        $clients = User::role('client')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('feedback/index', [ // <-- Perhatikan Casing
            'feedbackItems' => $feedbacks, // Lebih deskriptif: feedbackItems atau feedbacks
            'filters' => (object) $request->only(['search', 'type', 'status']),
            'feedbackTypes' => $feedbackTypes,
            'feedbackStatuses' => $feedbackStatuses,
            'clients' => $clients,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', Feedback::class);
        $stores = Store::orderBy('name')->get(['id', 'name']);
        // Tambahkan data lain yang mungkin diperlukan untuk form, misalnya tipe feedback
        $feedbackTypes = [
            ['value' => 'bug_report', 'label' => 'Bug Report'],
            ['value' => 'suggestion', 'label' => 'Suggestion'],
            // ... tipe lainnya
        ];


        return Inertia::render('feedback/create', [ // <-- Perhatikan Casing
            'stores' => $stores,
            'feedbackTypes' => $feedbackTypes, // Contoh
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Feedback::class);

        $validatedData = $request->validate([
            'maintenance_schedule_id' => 'nullable|exists:maintenance_schedules,id',
            'store_id' => 'nullable|exists:stores,id',
            'type' => 'required|string|max:255', // Contoh jika feedback punya tipe
            'rating' => 'nullable|integer|min:1|max:5',
            'comment' => 'required|string|min:10', // Mungkin tambahkan min length
            // 'title' => 'nullable|string|max:255', // Jika Anda punya field title
        ]);
        $validatedData['user_id'] = Auth::id();
        $validatedData['status'] = 'new'; // Default status untuk feedback baru

        Feedback::create($validatedData);

        // Redirect ke halaman yang sesuai, misalnya halaman riwayat feedback user atau dashboard
        return Redirect::route('dashboard')->with('success', 'Thank you for your feedback!'); // Gunakan 'success'
    }

    public function show(Feedback $feedback): InertiaResponse
    {
        $this->authorize('view', $feedback);

        $feedback->load([
            'user:id,name,email', // Ganti 'client' menjadi 'user' jika itu relasinya
            'store:id,name',
            'maintenanceSchedule:id,scheduled_at' // Ganti 'schedule' menjadi 'maintenanceSchedule'
        ]);

        return Inertia::render('feedback/show', [ // <-- Perhatikan Casing
            'feedback' => $feedback
        ]);
    }

    // App\Http\Controllers\FeedbackController.php

// ... (kode controller lainnya) ...

public function edit(Feedback $feedback): InertiaResponse
{
    $this->authorize('update', $feedback); // Pastikan ada policy untuk update

    // Muat data yang mungkin dibutuhkan, meskipun feedback sudah di-route model binding
    $feedback->load(['user:id,name', 'store:id,name']);

    // Opsi untuk status (jika Anda ingin mengambilnya dari backend)
    $feedbackStatuses = [
        ['value' => 'pending', 'label' => 'Pending'],
        ['value' => 'in_progress', 'label' => 'In Progress'],
        ['value' => 'resolved', 'label' => 'Resolved'],
        ['value' => 'closed', 'label' => 'Closed'],
    ];

    return Inertia::render('Feedback/Edit', [ // Sesuaikan casing 'Feedback/Edit'
        'feedback' => $feedback,
        'feedbackStatuses' => $feedbackStatuses, // Kirim status ke frontend
    ]);
}

public function update(Request $request, Feedback $feedback): RedirectResponse
{
    $this->authorize('update', $feedback);

    $validatedData = $request->validate([
        'admin_response' => 'nullable|string',
        'status' => [
            'required',
            Rule::in(['pending', 'in_progress', 'resolved', 'closed']), // Validasi status
        ],
    ]);

    // Update hanya field yang boleh diubah oleh admin
    $feedback->admin_response = $validatedData['admin_response'];
    $feedback->status = $validatedData['status'];
    // Anda mungkin ingin mencatat siapa yang melakukan update (admin_id)
    // $feedback->admin_id = Auth::id();
    $feedback->save();

    return Redirect::route('feedback.index')->with('success', 'Feedback updated successfully.');
    // atau redirect kembali ke halaman edit/show:
    // return Redirect::route('feedback.edit', $feedback->id)->with('success', 'Feedback updated successfully.');
}

    public function destroy(Feedback $feedback): RedirectResponse
    {
        $this->authorize('delete', $feedback);
        $feedback->delete();
        return Redirect::route('feedback.index')->with('success', 'Feedback deleted successfully.'); // Gunakan 'success'
    }
}