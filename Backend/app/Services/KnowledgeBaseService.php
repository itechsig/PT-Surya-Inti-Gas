<?php

namespace App\Services;

class KnowledgeBaseService
{
    private array $knowledgeBase;

    public function __construct()
    {
        // Simple knowledge base for now
        $this->knowledgeBase = [
            'surya' => 'PT Surya Inti Gas adalah perusahaan gas yang menyediakan layanan gas berkualitas.',
            'produk' => 'Kami menyediakan berbagai produk gas untuk kebutuhan industri dan rumah tangga.',
            'layanan' => 'Layanan kami meliputi penyediaan gas, pengiriman, dan maintenance.',
            'kontak' => 'Silakan hubungi kami melalui halaman kontak untuk informasi lebih lanjut.',
        ];
    }

    public function getKnowledgeBase(): array
    {
        return $this->knowledgeBase;
    }

    public function reloadKnowledgeBase(): array
    {
        return $this->knowledgeBase;
    }

    public function search(string $message): ?string
    {
        $message = strtolower(trim($message));
        
        foreach ($this->knowledgeBase as $keyword => $response) {
            if (strpos($message, $keyword) !== false) {
                return $response;
            }
        }
        
        return null;
    }
}
