<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;
use App\Models\Feedback;
use App\Models\Store;
use App\Models\User;
use App\Services\FeedbackService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class FeedbackController extends Controller
{
    use AuthorizesRequests;

    private const FEEDBACK_TYPES = [
        ['value' => 'bug_report', 'label' => 'Bug Report'],
        ['value' => 'suggestion', 'label' => 'Suggestion'],
        ['value' => 'complaint',  'label' => 'Complaint'],
        ['value' => 'compliment', 'label' => 'Compliment'],
    ];

    private const FEEDBACK_STATUSES = [
        ['value' => 'new',         'label' => 'New'],
        ['value' => 'in_progress', 'label' => 'In Progress'],
        ['value' => 'resolved',    'label' => 'Resolved'],
        ['value' => 'closed',      'label' => 'Closed'],
    ];

    public function __construct(private readonly FeedbackService $feedbackService) {}

    public function index(Request $request): InertiaResponse
    {
        $this->authorize('viewAny', Feedback::class);

        $feedbacks = $this->feedbackService->index($request->only(['search', 'type', 'status']));
        $clients   = User::role('client')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('feedback/index', [
            'feedbackItems'    => $feedbacks,
            'filters'          => (object) $request->only(['search', 'type', 'status']),
            'feedbackTypes'    => self::FEEDBACK_TYPES,
            'feedbackStatuses' => self::FEEDBACK_STATUSES,
            'clients'          => $clients,
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorize('create', Feedback::class);

        return Inertia::render('feedback/create', [
            'stores'        => Store::orderBy('name')->get(['id', 'name']),
            'feedbackTypes' => self::FEEDBACK_TYPES,
        ]);
    }

    public function store(StoreFeedbackRequest $request): RedirectResponse
    {
        $this->feedbackService->store($request->validated(), $request->user()->id);

        return Redirect::route('dashboard')
            ->with('success', 'Thank you for your feedback!');
    }

    public function show(Feedback $feedback): InertiaResponse
    {
        $this->authorize('view', $feedback);

        return Inertia::render('feedback/show', [
            'feedback' => $feedback->load(['user:id,name,email', 'store:id,name', 'maintenanceSchedule:id,scheduled_at']),
        ]);
    }

    public function edit(Feedback $feedback): InertiaResponse
    {
        $this->authorize('update', $feedback);

        return Inertia::render('Feedback/Edit', [
            'feedback'         => $feedback->load(['user:id,name', 'store:id,name']),
            'feedbackStatuses' => self::FEEDBACK_STATUSES,
        ]);
    }

    public function update(UpdateFeedbackRequest $request, Feedback $feedback): RedirectResponse
    {
        $this->feedbackService->update($feedback, $request->validated(), $request->user()->id);

        return Redirect::route('feedback.index')
            ->with('success', 'Feedback updated successfully.');
    }

    public function destroy(Feedback $feedback): RedirectResponse
    {
        $this->authorize('delete', $feedback);
        $this->feedbackService->destroy($feedback);

        return Redirect::route('feedback.index')
            ->with('success', 'Feedback deleted successfully.');
    }
}