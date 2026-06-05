<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Create a new notification
     */
    public function createNotification(array $data): Notification
    {
        $notification = Notification::create([
            'user_id' => $data['user_id'] ?? null, // null means send to all admins
            'type' => $data['type'],
            'title' => $data['title'],
            'message' => $data['message'],
            'priority' => $data['priority'] ?? 'medium',
            'status' => 'unread',
            'data' => $data['data'] ?? null,
            'action_url' => $data['action_url'] ?? null,
            'action_text' => $data['action_text'] ?? null,
            'related_id' => $data['related_id'] ?? null,
            'related_type' => $data['related_type'] ?? null,
            'is_sent' => false,
            'sent_at' => null,
            'read_at' => null,
            'created_at' => now(),
        ]);

        // Send email notification for high priority items
        if (in_array($notification->priority, ['high', 'critical'])) {
            $this->sendEmailNotification($notification);
        }

        return $notification;
    }

    /**
     * Send email notification
     */
    private function sendEmailNotification(Notification $notification): void
    {
        try {
            // Get admin users
            $adminUsers = User::where('is_admin', true)->get();

            foreach ($adminUsers as $admin) {
                // Here you would implement actual email sending
                // For now, we'll just log it
                Log::info('Email notification would be sent', [
                    'to' => $admin->email,
                    'subject' => $notification->title,
                    'notification_id' => $notification->id,
                ]);
            }

            // Mark as sent
            $notification->markAsSent();
        } catch (\Exception $e) {
            Log::error('Failed to send email notification', [
                'error' => $e->getMessage(),
                'notification_id' => $notification->id,
            ]);
        }
    }

    /**
     * Get unread notifications for user
     */
    public function getUnreadNotifications(?int $userId = null): array
    {
        $query = Notification::unread();

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            // Get notifications for all admins (user_id is null)
            $query->whereNull('user_id');
        }

        return $query->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->toArray();
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount(?int $userId = null): int
    {
        $query = Notification::unread();

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->whereNull('user_id');
        }

        return $query->count();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): bool
    {
        try {
            $notification = Notification::findOrFail($notificationId);
            $notification->markAsRead();
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to mark notification as read', [
                'error' => $e->getMessage(),
                'notification_id' => $notificationId,
            ]);
            return false;
        }
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead(?int $userId = null): bool
    {
        try {
            $query = Notification::unread();

            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->whereNull('user_id');
            }

            $query->update([
                'status' => 'read',
                'read_at' => now(),
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to mark all notifications as read', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
            ]);
            return false;
        }
    }
}
