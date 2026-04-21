<?php

namespace Tests\Feature\Contact;

use App\Http\Middleware\VerifyCsrfToken;
use App\Listeners\Contact\SendContactAdminNotifyListener;
use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class ContactSubmitTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Подготавливает окружение перед каждым тестом:
     * отключает CSRF, очищает cache (сброс throttle между тестами),
     * переводит очередь в fake — listener-ы не исполняются, фиксируем только факт dispatch.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(VerifyCsrfToken::class);
        Cache::flush();
        Queue::fake();
    }

    /**
     * Helper: валидный payload формы Contact. Принимает overrides для конкретного сценария.
     */
    private function validPayload(array $overrides = []): array
    {
        return array_merge([
            'name'       => 'John Doe',
            'email'      => 'john@example.com',
            'company'    => 'Acme Inc.',
            'message'    => 'Hello, I have a question about your service.',
            'hp_company' => '',
            'hp_elapsed' => 30,
        ], $overrides);
    }

    public function test_valid_submission_creates_record_and_queues_admin_notification(): void
    {
        $response = $this->postJson('/contact', $this->validPayload());

        $response->assertStatus(200)->assertJson(['status' => 'success']);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'john@example.com',
            'name'  => 'John Doe',
        ]);

        Queue::assertPushed(SendContactAdminNotifyListener::class, 1);
    }

    public function test_response_does_not_leak_internal_result_status(): void
    {
        $response = $this->postJson('/contact', $this->validPayload());

        // Контроллер скрывает от фронта `created | skipped` — фронт не должен различать кейсы.
        $data = $response->json('data');
        $this->assertTrue($data === [] || $data === null);
    }

    public function test_trims_whitespace_and_lowercases_email(): void
    {
        $this->postJson('/contact', $this->validPayload([
            'email' => '  Foo@EXAMPLE.com ',
            'name'  => '  John  ',
        ]));

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'foo@example.com',
            'name'  => 'John',
        ]);
    }

    public function test_type_site_defaults_to_demo(): void
    {
        $this->postJson('/contact', $this->validPayload([
            'email' => 'type@x.com',
        ]));

        $this->assertDatabaseHas('contact_messages', [
            'email'     => 'type@x.com',
            'type_site' => 'demo',
        ]);
    }

    public function test_user_meta_contains_locale_ip_user_agent(): void
    {
        $this->postJson('/contact', $this->validPayload(['email' => 'meta@x.com']), [
            'User-Agent' => 'PHPUnit/Test',
        ]);

        $row = ContactMessage::where('email', 'meta@x.com')->first();
        $this->assertNotNull($row);
        $this->assertIsArray($row->user_meta);
        $this->assertArrayHasKey('locale', $row->user_meta);
        $this->assertArrayHasKey('ip', $row->user_meta);
        $this->assertArrayHasKey('user_agent', $row->user_meta);
    }

    public function test_validation_rejects_missing_name(): void
    {
        $response = $this->postJson('/contact', $this->validPayload([
            'name'  => '',
            'email' => 'noname@x.com',
        ]));
        $response->assertStatus(422)->assertJsonValidationErrors('name');
        $this->assertDatabaseMissing('contact_messages', ['email' => 'noname@x.com']);
    }

    public function test_validation_rejects_missing_email(): void
    {
        $response = $this->postJson('/contact', $this->validPayload(['email' => '']));
        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_validation_rejects_invalid_email(): void
    {
        $response = $this->postJson('/contact', $this->validPayload(['email' => 'not-an-email']));
        $response->assertStatus(422)->assertJsonValidationErrors('email');
    }

    public function test_validation_rejects_short_message(): void
    {
        $response = $this->postJson('/contact', $this->validPayload(['message' => 'hi']));
        $response->assertStatus(422)->assertJsonValidationErrors('message');
    }

    public function test_validation_rejects_long_message(): void
    {
        $response = $this->postJson('/contact', $this->validPayload([
            'message' => str_repeat('x', 2001),
        ]));
        $response->assertStatus(422)->assertJsonValidationErrors('message');
    }

    public function test_validation_rejects_missing_message(): void
    {
        $response = $this->postJson('/contact', $this->validPayload(['message' => '']));
        $response->assertStatus(422)->assertJsonValidationErrors('message');
    }

    public function test_honeypot_filled_hidden_field_silently_accepts_without_saving(): void
    {
        $response = $this->postJson('/contact', $this->validPayload([
            'email'      => 'bot1@x.com',
            'hp_company' => 'I am a bot',
        ]));

        $response->assertStatus(200)->assertJson(['status' => 'success']);
        $this->assertDatabaseMissing('contact_messages', ['email' => 'bot1@x.com']);
        Queue::assertNotPushed(SendContactAdminNotifyListener::class);
    }

    public function test_honeypot_missing_timestamp_silently_rejects(): void
    {
        $response = $this->postJson('/contact', $this->validPayload([
            'email'      => 'bot2@x.com',
            'hp_elapsed' => null,
        ]));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('contact_messages', ['email' => 'bot2@x.com']);
        Queue::assertNotPushed(SendContactAdminNotifyListener::class);
    }

    public function test_honeypot_too_fast_submission_silently_rejects(): void
    {
        $response = $this->postJson('/contact', $this->validPayload([
            'email'      => 'bot3@x.com',
            'hp_elapsed' => 2,
        ]));

        $response->assertStatus(200);
        $this->assertDatabaseMissing('contact_messages', ['email' => 'bot3@x.com']);
        Queue::assertNotPushed(SendContactAdminNotifyListener::class);
    }

    public function test_rate_limit_per_email_blocks_second_submission_within_minute(): void
    {
        $this->postJson('/contact', $this->validPayload(['email' => 'same@x.com']));
        $this->postJson('/contact', $this->validPayload([
            'email'   => 'same@x.com',
            'message' => 'A different message this time, long enough.',
        ]));

        $this->assertEquals(1, ContactMessage::where('email', 'same@x.com')->count());
    }

    public function test_rate_limit_allows_submission_after_one_minute(): void
    {
        $this->postJson('/contact', $this->validPayload(['email' => 'later@x.com']));

        // Сдвигаем первую запись на 2 минуты назад — rate-limit окно истекло.
        ContactMessage::where('email', 'later@x.com')->update([
            'created_at' => now()->subMinutes(2),
        ]);

        $this->postJson('/contact', $this->validPayload([
            'email'   => 'later@x.com',
            'message' => 'Second message after one minute of waiting.',
        ]));

        $this->assertEquals(2, ContactMessage::where('email', 'later@x.com')->count());
    }

    public function test_duplicate_email_and_message_is_silently_rejected(): void
    {
        $payload = $this->validPayload(['email' => 'dup@x.com']);

        $this->postJson('/contact', $payload);

        // Сдвигаем первую запись, чтобы обойти rate-limit и проверить именно dup-защиту.
        ContactMessage::where('email', 'dup@x.com')->update([
            'created_at' => now()->subMinutes(2),
        ]);

        $response = $this->postJson('/contact', $payload);

        $response->assertStatus(200);
        $this->assertEquals(1, ContactMessage::where('email', 'dup@x.com')->count());
    }

    public function test_throttle_blocks_after_five_requests_per_minute(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/contact', $this->validPayload([
                'email'   => "user{$i}@x.com",
                'message' => "Message number {$i} with sufficient length here.",
            ]));
        }

        $response = $this->postJson('/contact', $this->validPayload([
            'email'   => 'user6@x.com',
            'message' => 'Sixth attempt should hit the IP throttle.',
        ]));

        $response->assertStatus(429);
    }
}
