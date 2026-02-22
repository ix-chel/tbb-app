<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait LogsActivity
{
    /**
     * Log a structured activity entry to the daily channel.
     */
    protected function logActivity(string $action, array $context = []): void
    {
        Log::channel('daily')->info($action, array_merge([
            'user_id'   => auth()->id(),
            'ip'        => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toIso8601String(),
        ], $context));
    }

    /**
     * Log a warning-level activity (e.g., suspicious behaviour, repeated failures).
     */
    protected function logWarning(string $action, array $context = []): void
    {
        Log::channel('daily')->warning($action, array_merge([
            'user_id'   => auth()->id(),
            'ip'        => request()->ip(),
            'timestamp' => now()->toIso8601String(),
        ], $context));
    }

    /**
     * Log a critical error with full context.
     */
    protected function logError(string $action, \Throwable $e, array $context = []): void
    {
        Log::channel('daily')->error($action, array_merge([
            'user_id'   => auth()->id(),
            'ip'        => request()->ip(),
            'timestamp' => now()->toIso8601String(),
            'exception' => $e->getMessage(),
            'trace'     => $e->getTraceAsString(),
        ], $context));
    }
}
