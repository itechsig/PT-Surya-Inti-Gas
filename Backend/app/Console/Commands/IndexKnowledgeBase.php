<?php

namespace App\Console\Commands;

use App\Services\VectorSearchService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

#[Signature('app:index-knowledge-base')]
#[Description('Index knowledge base into vector store for semantic search')]
class IndexKnowledgeBase extends Command
{
    public function __construct(
        private VectorSearchService $vectorSearchService
    ) {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Starting knowledge base indexing...');

        // Load knowledge base
        $knowledgeBase = require storage_path('app/chatbot/knowledge.php');

        if (!$this->vectorSearchService->isAvailable()) {
            $this->error('Vector search service is not available. Please check Gemini API configuration.');
            return 1;
        }

        // Index knowledge base
        $success = $this->vectorSearchService->indexKnowledgeBase($knowledgeBase);

        if ($success) {
            $this->info('Knowledge base indexed successfully!');
            return 0;
        } else {
            $this->error('Failed to index knowledge base. Check logs for details.');
            return 1;
        }
    }
}
