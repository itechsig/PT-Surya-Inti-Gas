<?php

namespace App\Services;

use App\Models\AIAgentActivity;
use App\Models\AIRecommendation;
use App\Models\Contact;
use App\Models\CareerApplication;
use App\Models\WebsiteVisitor;
use App\Models\Notification;
use App\Models\AuditLog;
use App\Models\BlockedUser;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AIAgentService
{
    private NotificationService $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Monitor contact messages for spam and important messages
     */
    public function monitorContactMessages(): array
    {
        $results = [
            'spam_detected' => 0,
            'important_messages' => 0,
            'recommendations_created' => 0,
        ];

        try {
            // Get recent pending contacts
            $recentContacts = Contact::pending()
                ->where('created_at', '>=', Carbon::now()->subHours(24))
                ->get();

            foreach ($recentContacts as $contact) {
                // Analyze contact for spam
                $spamScore = $this->calculateSpamScore($contact);
                
                if ($spamScore > 70) {
                    $this->createSpamRecommendation($contact, $spamScore);
                    $results['spam_detected']++;
                    $results['recommendations_created']++;
                }

                // Analyze for importance
                $importanceScore = $this->calculateImportanceScore($contact);
                
                if ($importanceScore > 80) {
                    $this->markAsImportant($contact);
                    $this->notifyImportantMessage($contact);
                    $results['important_messages']++;
                }

                // Log activity
                $this->logActivity('monitoring', 'contact_message', $contact->id, Contact::class, [
                    'spam_score' => $spamScore,
                    'importance_score' => $importanceScore,
                ]);
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('AI Agent contact monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Monitor career applications for quality and relevance
     */
    public function monitorCareerApplications(): array
    {
        $results = [
            'applications_analyzed' => 0,
            'high_quality_candidates' => 0,
            'recommendations_created' => 0,
        ];

        try {
            $recentApplications = CareerApplication::pending()
                ->where('created_at', '>=', Carbon::now()->subHours(24))
                ->get();

            foreach ($recentApplications as $application) {
                // Analyze application quality
                $analysis = $this->analyzeApplication($application);
                
                // Update application with AI insights
                $application->update([
                    'ai_summary' => $analysis['summary'],
                    'ai_score' => $analysis['score'],
                    'ai_insights' => $analysis['insights'],
                ]);

                $results['applications_analyzed']++;

                if ($analysis['score'] > 80) {
                    $this->createHighQualityCandidateRecommendation($application, $analysis);
                    $results['high_quality_candidates']++;
                    $results['recommendations_created']++;
                }

                // Log activity
                $this->logActivity('monitoring', 'career_application', $application->id, CareerApplication::class, [
                    'ai_score' => $analysis['score'],
                ]);

                // Notify about new application
                $this->notifyNewApplication($application);
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('AI Agent career application monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Monitor individual visitor in real-time
     */
    public static function monitorVisitor($visitor): void
    {
        try {
            Log::info('AIAgentService::monitorVisitor called', [
                'visitor_id' => $visitor->id,
                'session_id' => $visitor->session_id,
                'ip_address' => $visitor->ip_address
            ]);
            
            // Create AI Agent Activity for new visitor
            $activity = AIAgentActivity::create([
                'activity_type' => 'visitor_entry',
                'source' => 'visitor_tracking',
                'source_id' => $visitor->id,
                'source_type' => WebsiteVisitor::class,
                'description' => "New visitor detected: {$visitor->ip_address}",
                'metadata' => [
                    'session_id' => $visitor->session_id,
                    'ip_address' => $visitor->ip_address,
                    'browser' => $visitor->browser,
                    'os' => $visitor->os,
                    'device_type' => $visitor->device_type,
                    'landing_page' => $visitor->landing_page,
                    'referrer' => $visitor->referrer,
                    'country' => $visitor->country,
                    'city' => $visitor->city,
                ],
                'status' => 'completed',
                'executed_at' => now(),
            ]);

            Log::info('AI Agent Activity created successfully', [
                'activity_id' => $activity->id,
                'visitor_id' => $visitor->id
            ]);

            // Check for suspicious patterns
            $riskAnalysis = (new self(app(NotificationService::class)))->analyzeVisitorRisk($visitor);
            
            if ($riskAnalysis['risk_level'] === 'high') {
                (new self(app(NotificationService::class)))->createSuspiciousActivityRecommendation($visitor, $riskAnalysis);
            } elseif ($riskAnalysis['risk_level'] === 'medium') {
                (new self(app(NotificationService::class)))->createWarning($visitor, $riskAnalysis);
            }

        } catch (\Exception $e) {
            Log::error('Real-time visitor monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'visitor_id' => $visitor->id
            ]);
        }
    }

    /**
     * Monitor visitor behavior for suspicious activities
     */
    public function monitorVisitorBehavior(): array
    {
        $results = [
            'suspicious_activities' => 0,
            'warnings_created' => 0,
            'recommendations_created' => 0,
        ];

        try {
            $recentVisitors = WebsiteVisitor::where('last_visit', '>=', Carbon::now()->subHours(1))
                ->get();

            foreach ($recentVisitors as $visitor) {
                $riskAnalysis = $this->analyzeVisitorRisk($visitor);

                if ($riskAnalysis['risk_level'] === 'high') {
                    $this->createSuspiciousActivityRecommendation($visitor, $riskAnalysis);
                    $results['suspicious_activities']++;
                    $results['recommendations_created']++;
                } elseif ($riskAnalysis['risk_level'] === 'medium') {
                    $this->createWarning($visitor, $riskAnalysis);
                    $results['warnings_created']++;
                }

                // Log activity
                $this->logActivity('monitoring', 'visitor_activity', $visitor->id, WebsiteVisitor::class, [
                    'risk_level' => $riskAnalysis['risk_level'],
                ]);
            }

            return $results;
        } catch (\Exception $e) {
            Log::error('AI Agent visitor behavior monitoring error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Run comprehensive monitoring
     */
    public function runComprehensiveMonitoring(): array
    {
        $results = [
            'contact_monitoring' => $this->monitorContactMessages(),
            'career_monitoring' => $this->monitorCareerApplications(),
            'visitor_monitoring' => $this->monitorVisitorBehavior(),
            'timestamp' => Carbon::now()->toISOString(),
        ];

        // Log comprehensive monitoring
        $this->logActivity('monitoring', 'system', null, null, [
            'comprehensive_monitoring' => true,
            'results' => $results,
        ]);

        return $results;
    }

    /**
     * Calculate spam score for contact message (Rule-based + Pattern detection)
     */
    private function calculateSpamScore(Contact $contact): int
    {
        $score = 0;

        // Rule-based checks
        $spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'free money', 'click here'];
        $message = strtolower($contact->pesan);
        
        foreach ($spamKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                $score += 30;
            }
        }

        // Check for excessive links
        $linkCount = substr_count($message, 'http');
        if ($linkCount > 3) {
            $score += 20;
        }

        // Check for excessive capitalization
        $capitalRatio = (mb_strlen(preg_replace('/[^A-Z]/', '', $message)) / mb_strlen($message)) * 100;
        if ($capitalRatio > 50) {
            $score += 15;
        }

        // Check for repetitive content
        $words = str_word_count($message, 1);
        $uniqueWords = count(array_unique($words));
        if ($uniqueWords < count($words) * 0.3) {
            $score += 15;
        }

        // Check email domain reputation (simplified)
        $suspiciousDomains = ['tempmail.com', 'throwaway.com', 'fake.com'];
        $emailDomain = explode('@', $contact->email)[1] ?? '';
        if (in_array($emailDomain, $suspiciousDomains)) {
            $score += 25;
        }

        return min($score, 100);
    }

    /**
     * Calculate importance score for contact message
     */
    private function calculateImportanceScore(Contact $contact): int
    {
        $score = 0;

        $message = strtolower($contact->pesan);
        
        // Important keywords
        $importantKeywords = ['urgent', 'emergency', 'asap', 'complaint', 'issue', 'problem', 'help'];
        foreach ($importantKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                $score += 25;
            }
        }

        // Business-related keywords
        $businessKeywords = ['partnership', 'collaboration', 'business', 'proposal', 'contract'];
        foreach ($businessKeywords as $keyword) {
            if (str_contains($message, $keyword)) {
                $score += 20;
            }
        }

        // Long, detailed messages might be more important
        if (mb_strlen($message) > 200) {
            $score += 15;
        }

        return min($score, 100);
    }

    /**
     * Analyze career application
     */
    private function analyzeApplication(CareerApplication $application): array
    {
        $score = 50; // Base score
        $insights = [];

        // Analyze cover letter quality
        if ($application->cover_letter) {
            $letterLength = mb_strlen($application->cover_letter);
            if ($letterLength > 300) {
                $score += 15;
                $insights[] = 'Detailed cover letter provided';
            }
            if ($letterLength > 500) {
                $score += 10;
                $insights[] = 'Comprehensive cover letter';
            }
        }

        // Check if CV is provided
        if ($application->cv_path) {
            $score += 20;
            $insights[] = 'CV/Resume attached';
        }

        // Analyze email domain (professional vs personal)
        $emailDomain = explode('@', $application->email)[1] ?? '';
        $professionalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
        if (in_array($emailDomain, $professionalDomains)) {
            $score += 5;
        }

        // Generate summary (simplified)
        $summary = "Application for {$application->posisi} position. ";
        if ($application->cover_letter) {
            $summary .= "Candidate provided cover letter. ";
        }
        if ($application->cv_path) {
            $summary .= "CV attached for review. ";
        }
        $summary .= "AI relevance score: {$score}%";

        return [
            'score' => min($score, 100),
            'summary' => $summary,
            'insights' => $insights,
        ];
    }

    /**
     * Analyze visitor risk
     */
    private function analyzeVisitorRisk(WebsiteVisitor $visitor): array
    {
        $riskLevel = 'low';
        $reasons = [];

        // Check for excessive page views
        if ($visitor->page_views > 50) {
            $riskLevel = 'high';
            $reasons[] = 'Excessive page views detected';
        }

        // Check for suspicious time on site
        if ($visitor->time_on_site < 10 && $visitor->page_views > 10) {
            $riskLevel = 'high';
            $reasons[] = 'Bot-like behavior: rapid page navigation';
        }

        // Check for returning visitor with suspicious patterns
        if ($visitor->is_returning_visitor && $visitor->page_views > 30) {
            $riskLevel = 'medium';
            $reasons[] = 'High activity from returning visitor';
        }

        // Check user agent for bot signatures
        $userAgent = strtolower($visitor->user_agent ?? '');
        $botSignatures = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
        foreach ($botSignatures as $signature) {
            if (str_contains($userAgent, $signature)) {
                $riskLevel = 'high';
                $reasons[] = 'Bot signature detected in user agent';
                break;
            }
        }

        return [
            'risk_level' => $riskLevel,
            'reasons' => $reasons,
            'score' => $riskLevel === 'high' ? 90 : ($riskLevel === 'medium' ? 60 : 20),
        ];
    }

    /**
     * Create spam recommendation
     */
    private function createSpamRecommendation(Contact $contact, int $spamScore): void
    {
        $recommendation = AIRecommendation::create([
            'recommendation_type' => 'block_user',
            'title' => 'Potential Spam Contact Detected',
            'description' => "Contact from {$contact->email} has been identified as potential spam with a confidence score of {$spamScore}%.",
            'evidence' => [
                'spam_score' => $spamScore,
                'contact_id' => $contact->id,
                'email' => $contact->email,
                'message' => substr($contact->pesan, 0, 200),
            ],
            'priority' => $spamScore > 80 ? 'high' : 'medium',
            'status' => 'pending',
            'target_id' => $contact->id,
            'target_type' => Contact::class,
            'reasoning' => 'The message contains spam indicators such as suspicious keywords, excessive links, or unusual formatting patterns.',
            'suggested_action' => [
                'type' => 'block_email',
                'value' => $contact->email,
                'reason' => 'Spam detection',
            ],
        ]);

        $this->notifyNewRecommendation($recommendation);
    }

    /**
     * Create high-quality candidate recommendation
     */
    private function createHighQualityCandidateRecommendation(CareerApplication $application, array $analysis): void
    {
        $recommendation = AIRecommendation::create([
            'recommendation_type' => 'review_application',
            'title' => 'High-Quality Candidate Detected',
            'description' => "Application for {$application->posisi} position has a high AI score of {$analysis['score']}%.",
            'evidence' => [
                'ai_score' => $analysis['score'],
                'application_id' => $application->id,
                'insights' => $analysis['insights'],
            ],
            'priority' => 'medium',
            'status' => 'pending',
            'target_id' => $application->id,
            'target_type' => CareerApplication::class,
            'reasoning' => 'The candidate has provided comprehensive application materials and meets the initial quality criteria.',
            'suggested_action' => [
                'type' => 'review_priority',
                'value' => 'high',
                'reason' => 'High-quality candidate',
            ],
        ]);

        $this->notifyNewRecommendation($recommendation);
    }

    /**
     * Create suspicious activity recommendation
     */
    private function createSuspiciousActivityRecommendation(WebsiteVisitor $visitor, array $riskAnalysis): void
    {
        $recommendation = AIRecommendation::create([
            'recommendation_type' => 'block_user',
            'title' => 'Suspicious Visitor Activity Detected',
            'description' => "Visitor from IP {$visitor->ip_address} shows suspicious behavior patterns.",
            'evidence' => [
                'risk_level' => $riskAnalysis['risk_level'],
                'reasons' => $riskAnalysis['reasons'],
                'page_views' => $visitor->page_views,
                'time_on_site' => $visitor->time_on_site,
                'visitor_id' => $visitor->id,
            ],
            'priority' => 'high',
            'status' => 'pending',
            'target_id' => $visitor->id,
            'target_type' => WebsiteVisitor::class,
            'reasoning' => 'The visitor exhibits behavior patterns consistent with bots or automated scraping tools.',
            'suggested_action' => [
                'type' => 'block_ip',
                'value' => $visitor->ip_address,
                'reason' => 'Suspicious activity',
            ],
        ]);

        $this->notifyNewRecommendation($recommendation);
    }

    /**
     * Create warning for medium-risk activity
     */
    private function createWarning(WebsiteVisitor $visitor, array $riskAnalysis): void
    {
        $recommendation = AIRecommendation::create([
            'recommendation_type' => 'investigate',
            'title' => 'Medium-Risk Visitor Activity',
            'description' => "Visitor from IP {$visitor->ip_address} shows somewhat unusual behavior.",
            'evidence' => [
                'risk_level' => $riskAnalysis['risk_level'],
                'reasons' => $riskAnalysis['reasons'],
            ],
            'priority' => 'low',
            'status' => 'pending',
            'target_id' => $visitor->id,
            'target_type' => WebsiteVisitor::class,
            'reasoning' => 'The visitor behavior is unusual but not definitively malicious.',
            'suggested_action' => [
                'type' => 'monitor',
                'value' => $visitor->ip_address,
                'reason' => 'Monitor for further activity',
            ],
        ]);
    }

    /**
     * Mark contact as important
     */
    private function markAsImportant(Contact $contact): void
    {
        // This could add a flag or category to the contact
        // For now, we'll just log it
        $this->logActivity('classification', 'contact_message', $contact->id, Contact::class, [
            'marked_important' => true,
        ]);
    }

    /**
     * Notify about important message
     */
    private function notifyImportantMessage(Contact $contact): void
    {
        $this->notificationService->createNotification([
            'type' => 'important_message',
            'title' => 'Important Contact Message',
            'message' => "Important message received from {$contact->email}",
            'priority' => 'high',
            'action_url' => "/admin/contacts/{$contact->id}",
            'related_id' => $contact->id,
            'related_type' => Contact::class,
        ]);
    }

    /**
     * Notify about new application
     */
    private function notifyNewApplication(CareerApplication $application): void
    {
        $this->notificationService->createNotification([
            'type' => 'new_application',
            'title' => 'New Career Application',
            'message' => "New application received for {$application->posisi}",
            'priority' => 'medium',
            'action_url' => "/admin/career/applications/{$application->id}",
            'related_id' => $application->id,
            'related_type' => CareerApplication::class,
        ]);
    }

    /**
     * Notify about new recommendation
     */
    private function notifyNewRecommendation(AIRecommendation $recommendation): void
    {
        $this->notificationService->createNotification([
            'type' => 'approval_request',
            'title' => 'AI Recommendation Pending Approval',
            'message' => $recommendation->title,
            'priority' => $recommendation->priority,
            'action_url' => "/admin/ai-agent/recommendations/{$recommendation->id}",
            'related_id' => $recommendation->id,
            'related_type' => AIRecommendation::class,
        ]);
    }

    /**
     * Log AI agent activity
     */
    private function logActivity(string $activityType, string $source, ?int $sourceId, ?string $sourceType, array $metadata = []): void
    {
        AIAgentActivity::create([
            'activity_type' => $activityType,
            'source' => $source,
            'source_id' => $sourceId,
            'source_type' => $sourceType,
            'description' => "AI Agent performed {$activityType} on {$source}",
            'metadata' => $metadata,
            'status' => 'completed',
            'executed_at' => Carbon::now(),
        ]);
    }

    /**
     * Get AI Agent status
     */
    public function getAgentStatus(): array
    {
        $lastActivity = AIAgentActivity::latest()->first();
        $pendingRecommendations = AIRecommendation::pending()->count();
        $recentActivities = AIAgentActivity::where('executed_at', '>=', Carbon::now()->subHours(24))->count();

        return [
            'status' => 'online',
            'last_activity' => $lastActivity ? $lastActivity->executed_at->toISOString() : null,
            'pending_recommendations' => $pendingRecommendations,
            'recent_activities' => $recentActivities,
            'uptime' => '99.9%',
        ];
    }
}
