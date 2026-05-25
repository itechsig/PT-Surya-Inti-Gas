# A/B Testing Implementation

This document describes the implementation of A/B Testing for the PT Surya Inti Gas chatbot application, along with the existing Monitoring & Alerting system.

## Overview

Two major features have been implemented to enhance the chatbot application:

1. **Monitoring & Alerting System** (Already existed - verified and working)
2. **A/B Testing for Responses** (New implementation)

---

## 1. Monitoring & Alerting System ✅

**Status**: Already fully implemented in the codebase with comprehensive features.

### Features
- Real-time system health monitoring (CPU, memory, disk, queue, cache)
- Performance metrics tracking (response times, error rates)
- Configurable alert thresholds
- Multiple notification channels (email, Slack, log)
- Health check endpoints
- Historical metrics storage
- Alert aggregation and deduplication

### Key Components
- `MonitoringService.php` - Core monitoring logic
- `config/monitoring.php` - Configuration file
- API endpoints for health checks and alerts

### Configuration
Environment variables in `.env`:
```env
MONITORING_CPU_WARNING=70
MONITORING_CPU_CRITICAL=90
MONITORING_MEMORY_WARNING=70
MONITORING_MEMORY_CRITICAL=90
MONITORING_ERROR_RATE_WARNING=5
MONITORING_ERROR_RATE_CRITICAL=10
MONITORING_RESPONSE_TIME_WARNING=2000
MONITORING_RESPONSE_TIME_CRITICAL=5000
```

---

## 2. A/B Testing for Responses ✅

**Status**: New implementation with complete campaign management.

### Features
- **Campaign Management**: Create, start, pause, and complete A/B test campaigns
- **Variant Testing**: Test multiple response configurations with different parameters
- **User Assignment**: Consistent user-to-variant assignment using hashing
- **Performance Tracking**: Track impressions, engagements, conversions
- **Statistical Analysis**: Automatic winner determination based on success metrics
- **Real-time Metrics**: Cached metrics for fast performance

### Database Schema
New tables created:
- `ab_test_campaigns` - Campaign definitions
- `ab_test_variants` - Variant configurations  
- `ab_test_assignments` - User assignments and tracking
- `ab_test_results` - Aggregated results by date

### Key Components
- `ABTestingService.php` - Core A/B testing logic
- Database migration: `2026_05_23_040049_create_ab_testing_table.php`

### API Endpoints
All endpoints require authentication (`auth:sanctum` middleware):

```
POST   /api/chatbot/ab-test/campaigns              # Create campaign
GET    /api/chatbot/ab-test/campaigns              # List all campaigns
GET    /api/chatbot/ab-test/campaigns/{id}         # Get campaign details
GET    /api/chatbot/ab-test/campaigns/{id}/stats   # Get campaign statistics
GET    /api/chatbot/ab-test/campaigns/{id}/variants # Get campaign variants
POST   /api/chatbot/ab-test/campaigns/{id}/start  # Start campaign
POST   /api/chatbot/ab-test/campaigns/{id}/pause  # Pause campaign
POST   /api/chatbot/ab-test/campaigns/{id}/complete # Complete & determine winner
DELETE /api/chatbot/ab-test/campaigns/{id}        # Delete campaign
POST   /api/chatbot/ab-test/track-engagement      # Track user engagement
POST   /api/chatbot/ab-test/track-conversion      # Track conversions
```

### Usage Example

#### Create an A/B Test Campaign
```bash
curl -X POST http://localhost:8000/api/chatbot/ab-test/campaigns \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Response Temperature Test",
    "description": "Test different AI temperature settings",
    "success_metric": "engagement",
    "variants": [
      {
        "name": "Control",
        "description": "Current temperature (0.7)",
        "allocation": 0.5,
        "response_config": {
          "temperature": 0.7,
          "top_k": 40,
          "top_p": 0.95
        }
      },
      {
        "name": "Higher Temperature",
        "description": "More creative responses (0.9)",
        "allocation": 0.5,
        "response_config": {
          "temperature": 0.9,
          "top_k": 40,
          "top_p": 0.95
        }
      }
    ]
  }'
```

#### Start Campaign
```bash
curl -X POST http://localhost:8000/api/chatbot/ab-test/campaigns/1/start \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Campaign Statistics
```bash
curl -X GET http://localhost:8000/api/chatbot/ab-test/campaigns/1/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Integration with Chatbot
The A/B testing system is integrated into the chatbot response generation:
- Active campaigns are automatically checked for each request
- Users are consistently assigned to variants
- Variant-specific AI configurations are applied
- A/B test information is included in response metadata

---

## Installation & Setup

### Backend Setup

1. **Run Database Migration**
```bash
cd Backend
php artisan migrate
```

2. **Configure Environment Variables**
Add to `.env`:
```env
# Monitoring Configuration
MONITORING_CPU_WARNING=70
MONITORING_CPU_CRITICAL=90
MONITORING_MEMORY_WARNING=70
MONITORING_MEMORY_CRITICAL=90
MONITORING_ERROR_RATE_WARNING=5
MONITORING_ERROR_RATE_CRITICAL=10
```

3. **Clear Cache**
```bash
php artisan cache:clear
php artisan config:clear
```

---

## Usage Guide

### For Monitoring & Alerting

The monitoring system runs automatically in the background. To check system health:

```bash
curl http://localhost:8000/api/chatbot/health-status
```

To manually trigger monitoring checks:

```bash
curl -X POST http://localhost:8000/api/chatbot/run-monitoring-checks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### For A/B Testing

1. **Create a Campaign** via API
2. **Define Variants** with different response configurations
3. **Start the Campaign** to begin testing
4. **Monitor Results** via API endpoints
5. **Complete Campaign** to determine winner

---

## Technical Details

### A/B Testing Algorithm

Uses consistent hashing for user assignment:
- CRC32 hash of user identifier
- Normalized to [0,1] range
- Compared against variant allocation thresholds
- Ensures consistent assignment across sessions

### Performance Optimization

- **Caching**: Active campaigns and metrics cached for 1 hour
- **Database Indexing**: Proper indexes on all foreign keys and date fields
- **Aggregation**: Pre-aggregated results by date for fast queries

### Security

- All endpoints protected by `auth:sanctum` middleware
- Input validation on all API endpoints
- SQL injection protection via Eloquent ORM
- XSS protection via input sanitization

---

## Future Enhancements

Potential improvements for the future:

1. **Advanced Analytics**
   - User journey mapping
   - Funnel analysis
   - Cohort retention
   - Sentiment trends over time

2. **Enhanced A/B Testing**
   - Multi-armed bandit algorithms
   - Statistical significance calculation
   - Confidence intervals
   - Automated stopping rules

3. **Monitoring Enhancements**
   - Custom metrics tracking
   - Anomaly detection
   - Predictive alerting
   - Integration with external monitoring tools

---

## Troubleshooting

### Common Issues

**A/B test not assigning variants:**
- Verify campaign is in "active" status
- Check current date is within campaign date range
- Ensure variants are active
- Clear cache: `php artisan cache:clear`

**Monitoring alerts not triggering:**
- Check threshold configuration
- Verify notification channel configuration
- Check monitoring service is running
- Review logs: `storage/logs/laravel.log`

---

## Conclusion

The implementation provides a comprehensive A/B testing platform for the PT Surya Inti Gas chatbot, along with the existing monitoring and alerting system. The system is production-ready with proper error handling, security measures, and performance optimizations.

The requested features have been successfully implemented:
- ✅ Monitoring & Alerting (existing system - verified and working)
- ✅ A/B Testing for responses (new implementation)  

The system is ready to use and can help optimize chatbot performance through data-driven decision making.