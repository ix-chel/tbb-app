<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use App\Models\User;

class MaintenanceRequest extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'client_id',
        'company_id',
        'store_id',
        'description',
        'priority',
        'type',
        'status',
        'requested_by',
        'assigned_to',
        'requested_at',
        'scheduled_at',
        'completed_at',
        'notes',
        'estimated_duration',
        'actual_duration',
        'cost',
        'equipment_involved',
        'urgency_level',
        'category',
        'preferred_date',
        'contact_phone'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'requested_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'cost' => 'float',
        'estimated_duration' => 'integer',
        'actual_duration' => 'integer',
        'equipment_involved' => 'array',
        'preferred_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'status_badge',
        'priority_badge',
        'formatted_cost',
        'duration_text',
        'is_overdue'
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REJECTED = 'rejected';

    /**
     * Priority constants
     */
    const PRIORITY_LOW = 'low';
    const PRIORITY_MEDIUM = 'medium';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_URGENT = 'urgent';

    /**
     * Type constants
     */
    const TYPE_PREVENTIVE = 'preventive';
    const TYPE_CORRECTIVE = 'corrective';
    const TYPE_EMERGENCY = 'emergency';
    const TYPE_UPGRADE = 'upgrade';
    const TYPE_INSPECTION = 'inspection';
    const TYPE_GENERAL = 'general';

    /**
     * Get all available statuses
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_SCHEDULED => 'Scheduled',
            self::STATUS_IN_PROGRESS => 'In Progress',
            self::STATUS_COMPLETED => 'Completed',
            self::STATUS_CANCELLED => 'Cancelled',
            self::STATUS_REJECTED => 'Rejected'
        ];
    }

    /**
     * Get all available priorities
     */
    public static function getPriorities(): array
    {
        return [
            self::PRIORITY_LOW => 'Low',
            self::PRIORITY_MEDIUM => 'Medium',
            self::PRIORITY_HIGH => 'High',
            self::PRIORITY_URGENT => 'Urgent'
        ];
    }

    /**
     * Get all available types
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_PREVENTIVE => 'Preventive',
            self::TYPE_CORRECTIVE => 'Corrective',
            self::TYPE_EMERGENCY => 'Emergency',
            self::TYPE_UPGRADE => 'Upgrade',
            self::TYPE_INSPECTION => 'Inspection',
            self::TYPE_GENERAL => 'General'
        ];
    }

    /**
     * Relationship: Maintenance Request belongs to a Client (User)
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    /**
     * Relationship: Maintenance Request belongs to a Company
     */
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    /**
     * Relationship: Maintenance Request belongs to a Store
     */
    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Relationship: Maintenance Request belongs to User (requested by)
     */
    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Relationship: Maintenance Request belongs to User (assigned to)
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Relationship: Maintenance Request has one Maintenance Schedule
     */
    public function maintenanceSchedule(): HasOne
    {
        return $this->hasOne(MaintenanceSchedule::class);
    }

    /**
     * Accessor: Get status badge
     */
    public function getStatusBadgeAttribute(): array
    {
        $badges = [
            self::STATUS_PENDING => ['class' => 'bg-yellow-100 text-yellow-800', 'text' => 'Pending'],
            self::STATUS_APPROVED => ['class' => 'bg-blue-100 text-blue-800', 'text' => 'Approved'],
            self::STATUS_SCHEDULED => ['class' => 'bg-purple-100 text-purple-800', 'text' => 'Scheduled'],
            self::STATUS_IN_PROGRESS => ['class' => 'bg-orange-100 text-orange-800', 'text' => 'In Progress'],
            self::STATUS_COMPLETED => ['class' => 'bg-green-100 text-green-800', 'text' => 'Completed'],
            self::STATUS_CANCELLED => ['class' => 'bg-gray-100 text-gray-800', 'text' => 'Cancelled'],
            self::STATUS_REJECTED => ['class' => 'bg-red-100 text-red-800', 'text' => 'Rejected']
        ];

        return $badges[$this->status] ?? $badges[self::STATUS_PENDING];
    }

    /**
     * Accessor: Get priority badge
     */
    public function getPriorityBadgeAttribute(): array
    {
        $badges = [
            self::PRIORITY_LOW => ['class' => 'bg-green-100 text-green-800', 'text' => 'Low'],
            self::PRIORITY_MEDIUM => ['class' => 'bg-yellow-100 text-yellow-800', 'text' => 'Medium'],
            self::PRIORITY_HIGH => ['class' => 'bg-orange-100 text-orange-800', 'text' => 'High'],
            self::PRIORITY_URGENT => ['class' => 'bg-red-100 text-red-800', 'text' => 'Urgent']
        ];

        return $badges[$this->priority] ?? $badges[self::PRIORITY_MEDIUM];
    }

    /**
     * Accessor: Get formatted cost
     */
    public function getFormattedCostAttribute(): string
    {
        if (!$this->cost) {
            return 'Not set';
        }

        return 'Rp ' . number_format((float) $this->cost, 0, ',', '.');
    }

    /**
     * Accessor: Get duration text
     */
    public function getDurationTextAttribute(): string
    {
        if ($this->actual_duration) {
            return $this->actual_duration . ' minutes (actual)';
        }

        if ($this->estimated_duration) {
            return $this->estimated_duration . ' minutes (estimated)';
        }

        return 'Not set';
    }

    /**
     * Accessor: Check if request is overdue
     */
    public function getIsOverdueAttribute(): bool
    {
        if (!$this->scheduled_at || $this->status === self::STATUS_COMPLETED) {
            return false;
        }

        return Carbon::parse($this->scheduled_at)->isPast();
    }

    /**
     * Scope: Filter by status
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Filter by priority
     */
    public function scopePriority(Builder $query, string $priority): Builder
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope: Filter by type
     */
    public function scopeType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope: Filter pending requests
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope: Filter overdue requests
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->whereNotNull('scheduled_at')
                    ->where('scheduled_at', '<', Carbon::now())
                    ->whereNotIn('status', [self::STATUS_COMPLETED, self::STATUS_CANCELLED]);
    }

    /**
     * Scope: Filter urgent requests
     */
    public function scopeUrgent(Builder $query): Builder
    {
        return $query->where('priority', self::PRIORITY_URGENT);
    }

    /**
     * Scope: Filter by client
     */
    public function scopeByClient(Builder $query, int $clientId): Builder
    {
        return $query->where('client_id', $clientId);
    }

    /**
     * Scope: Filter by company
     */
    public function scopeByCompany(Builder $query, int $companyId): Builder
    {
        return $query->where('company_id', $companyId);
    }

    /**
     * Scope: Filter by store
     */
    public function scopeByStore(Builder $query, int $storeId): Builder
    {
        return $query->where('store_id', $storeId);
    }

    /**
     * Scope: Filter by assigned user
     */
    public function scopeAssignedTo(Builder $query, int $userId): Builder
    {
        return $query->where('assigned_to', $userId);
    }

    /**
     * Check if request can be edited
     */
    public function canBeEdited(): bool
    {
        return in_array($this->status, [
            self::STATUS_PENDING,
            self::STATUS_APPROVED,
            self::STATUS_SCHEDULED
        ]);
    }

    /**
     * Check if request can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return !in_array($this->status, [
            self::STATUS_COMPLETED,
            self::STATUS_CANCELLED,
            self::STATUS_REJECTED
        ]);
    }

    /**
     * Check if request can be approved
     */
    public function canBeApproved(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Mark as completed
     */
    public function markAsCompleted(): bool
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = Carbon::now();
        
        return $this->save();
    }

    /**
     * Assign to user
     */
    public function assignTo(int $userId): bool
    {
        $this->assigned_to = $userId;
        
        if ($this->status === self::STATUS_PENDING) {
            $this->status = self::STATUS_APPROVED;
        }
        
        return $this->save();
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Set default values before creating
        static::creating(function ($request) {
            if (empty($request->status)) {
                $request->status = self::STATUS_PENDING;
            }
            
            if (empty($request->priority)) {
                $request->priority = self::PRIORITY_MEDIUM;
            }
            
            if (empty($request->type)) {
                $request->type = self::TYPE_GENERAL;
            }
            
            if (empty($request->requested_at)) {
                $request->requested_at = Carbon::now();
            }
        });
    }

    /**
     * Convert model to array for API responses
     */
    public function toArray(): array
    {
        $array = parent::toArray();
        
        // Add computed attributes
        $array['status_badge'] = $this->status_badge;
        $array['priority_badge'] = $this->priority_badge;
        $array['formatted_cost'] = $this->formatted_cost;
        $array['duration_text'] = $this->duration_text;
        $array['is_overdue'] = $this->is_overdue;
        $array['can_be_edited'] = $this->canBeEdited();
        $array['can_be_cancelled'] = $this->canBeCancelled();
        $array['can_be_approved'] = $this->canBeApproved();
        
        return $array;
    }
}