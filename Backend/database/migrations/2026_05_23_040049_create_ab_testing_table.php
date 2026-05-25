<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // A/B Test Campaigns table
        Schema::create('ab_test_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->enum('status', ['draft', 'active', 'paused', 'completed'])->default('draft');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->json('target_conditions')->nullable(); // Conditions for targeting specific users
            $table->float('traffic_split')->default(0.5); // Percentage of traffic for variant A
            $table->integer('sample_size')->nullable(); // Target sample size
            $table->string('success_metric')->default('engagement'); // Metric to determine winner
            $table->string('winner_variant')->nullable(); // Winning variant ID
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('start_date');
            $table->index('end_date');
        });

        // A/B Test Variants table
        Schema::create('ab_test_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('ab_test_campaigns')->onDelete('cascade');
            $table->string('name'); // e.g., "Control", "Variant A", "Variant B"
            $table->string('description')->nullable();
            $table->text('response_template')->nullable(); // Response template or configuration
            $table->json('response_config')->nullable(); // AI model configuration for this variant
            $table->float('allocation')->default(0.5); // Percentage of traffic for this variant
            $table->boolean('is_control')->default(false); // Whether this is the control variant
            $table->integer('impressions')->default(0); // Number of times shown
            $table->integer('engagements')->default(0); // Number of positive engagements
            $table->integer('conversions')->default(0); // Number of conversions
            $table->float('conversion_rate')->default(0); // Calculated conversion rate
            $table->float('engagement_rate')->default(0); // Calculated engagement rate
            $table->json('metrics')->nullable(); // Additional metrics
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('campaign_id');
            $table->index('is_active');
        });

        // A/B Test Assignments table (tracks which users were assigned to which variants)
        Schema::create('ab_test_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('ab_test_campaigns')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('ab_test_variants')->onDelete('cascade');
            $table->string('user_identifier')->nullable(); // User ID or session ID
            $table->string('session_id')->nullable();
            $table->string('question')->nullable();
            $table->text('response')->nullable();
            $table->boolean('engaged')->default(false); // Whether user engaged positively
            $table->boolean('converted')->default(false); // Whether user converted
            $table->integer('rating')->nullable(); // User rating (1-5)
            $table->string('feedback')->nullable(); // User feedback
            $table->float('response_time')->default(0); // Response time in ms
            $table->json('metadata')->nullable();
            $table->timestamp('assigned_at');
            $table->timestamp('engaged_at')->nullable();
            $table->timestamps();
            
            $table->index('campaign_id');
            $table->index('variant_id');
            $table->index('user_identifier');
            $table->index('session_id');
            $table->index('assigned_at');
        });

        // A/B Test Results table (aggregated results)
        Schema::create('ab_test_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('ab_test_campaigns')->onDelete('cascade');
            $table->foreignId('variant_id')->constrained('ab_test_variants')->onDelete('cascade');
            $table->date('date');
            $table->integer('impressions')->default(0);
            $table->integer('engagements')->default(0);
            $table->integer('conversions')->default(0);
            $table->float('conversion_rate')->default(0);
            $table->float('engagement_rate')->default(0);
            $table->float('avg_response_time')->default(0);
            $table->float('avg_rating')->default(0);
            $table->json('metrics')->nullable();
            $table->timestamps();
            
            $table->index('campaign_id');
            $table->index('variant_id');
            $table->index('date');
            $table->unique(['campaign_id', 'variant_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ab_test_results');
        Schema::dropIfExists('ab_test_assignments');
        Schema::dropIfExists('ab_test_variants');
        Schema::dropIfExists('ab_test_campaigns');
    }
};