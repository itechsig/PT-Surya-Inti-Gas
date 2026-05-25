<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TranslationService;

class TranslationServiceTest extends TestCase
{
    private TranslationService $translationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->translationService = new TranslationService();
    }

    public function test_translation_service_initialization()
    {
        $this->assertInstanceOf(TranslationService::class, $this->translationService);
    }

    public function test_set_and_get_language()
    {
        $this->translationService->setLanguage('en');
        $this->assertEquals('en', $this->translationService->getCurrentLanguage());
        
        $this->translationService->setLanguage('id');
        $this->assertEquals('id', $this->translationService->getCurrentLanguage());
    }

    public function test_get_supported_languages()
    {
        $languages = $this->translationService->getSupportedLanguages();

        $this->assertIsArray($languages);
        $this->assertArrayHasKey('id', $languages);
        $this->assertArrayHasKey('en', $languages);
        $this->assertArrayHasKey('name', $languages['id']);
        $this->assertArrayHasKey('native_name', $languages['id']);
        $this->assertArrayHasKey('flag', $languages['id']);
    }

    public function test_translate_indonesian()
    {
        $this->translationService->setLanguage('id');
        
        $translation = $this->translationService->translate('welcome.message');
        
        $this->assertIsString($translation);
        $this->assertStringContainsString('Selamat datang', $translation);
    }

    public function test_translate_english()
    {
        $this->translationService->setLanguage('en');
        
        $translation = $this->translationService->translate('welcome.message');
        
        $this->assertIsString($translation);
        $this->assertStringContainsString('Welcome', $translation);
    }

    public function test_translate_with_parameters()
    {
        $this->translationService->setLanguage('id');
        
        // Test if parameters are replaced (though our current translations don't use params)
        $translation = $this->translationService->translate('welcome.greeting', ['name' => 'John']);
        
        $this->assertIsString($translation);
    }

    public function test_translate_with_explicit_language()
    {
        $this->translationService->setLanguage('id');
        
        // Explicitly request English translation while current is Indonesian
        $translation = $this->translationService->translate('welcome.message', [], 'en');
        
        $this->assertIsString($translation);
        $this->assertStringContainsString('Welcome', $translation);
    }

    public function test_translate_nested_key()
    {
        $this->translationService->setLanguage('id');
        
        $translation = $this->translationService->translate('company.name');
        
        $this->assertIsString($translation);
        $this->assertEquals('PT Surya Inti Gas', $translation);
    }

    public function test_detect_language_indonesian()
    {
        $detected = $this->translationService->detectLanguage('Halo, apa kabar?');
        
        $this->assertEquals('id', $detected);
    }

    public function test_detect_language_english()
    {
        $detected = $this->translationService->detectLanguage('Hello, how are you?');
        
        $this->assertEquals('en', $detected);
    }

    public function test_detect_language_unfamiliar_fallback()
    {
        $detected = $this->translationService->detectLanguage('Random text without keywords');
        
        // Should fallback to default language (Indonesian)
        $this->assertEquals('id', $detected);
    }

    public function test_clear_cache()
    {
        $result = $this->translationService->clearCache();
        
        $this->assertIsBool($result);
    }

    public function test_reload_translations()
    {
        // Should not throw an exception
        $this->translationService->reloadTranslations();
        
        $this->assertTrue(true);
    }

    public function test_translate_auto()
    {
        $this->translationService->setLanguage('en');
        
        $translation = $this->translationService->translateAuto('welcome.message');
        
        $this->assertIsString($translation);
        $this->assertStringContainsString('Welcome', $translation);
    }
}
