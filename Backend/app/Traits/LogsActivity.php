<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Http\Request;

trait LogsActivity
{
    /** Records an action to the audit_logs table (Super Admin's "Log Aktivitas"). */
    protected function logActivity(
        Request $request,
        string $actionType,
        string $entityType,
        ?int $entityId,
        string $description,
        array $old = [],
        array $new = []
    ): void {
        AuditLog::create([
            'user_id' => $request->user()?->id,
            'action_type' => $actionType,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'description' => $description,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
        ]);
    }
}
