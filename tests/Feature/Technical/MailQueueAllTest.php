<?php

namespace Tests\Feature\Technical;

use App\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Интеграционный тест кнопки «Поставить в очередь все 6 писем → EMAIL_ADMIN».
 *
 * Работает на реальной очереди `database`: после POST в таблице `jobs`
 * появляется +6 реальных строк, которые далее обрабатываются `queue:work`.
 * Транзакций/роллбэка нет — строки остаются в БД, чтобы их видно было глазами.
 */
class MailQueueAllTest extends TestCase
{
    /**
     * Перед каждым тестом: снять CSRF, сбросить throttle, переключить очередь на database.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutMiddleware(VerifyCsrfToken::class);
        Cache::flush();

        $this->app['config']->set('queue.default', 'database');
        Config::set('mail.admin_email', 'admin@haccpilot.local');
    }

    /**
     * POST endpoint кладёт в таблицу `jobs` ровно 6 новых задач (по одной на каждое письмо).
     */
    public function test_send_all_queued_inserts_six_real_jobs(): void
    {
        $before = DB::table('jobs')->count();

        $response = $this->post(route('technical.mail-test.send-all'));

        $response->assertRedirect(route('technical.index'));
        $response->assertSessionHas('status');

        $after = DB::table('jobs')->count();
        $this->assertSame(
            $before + 6,
            $after,
            'Ожидалось +6 новых строк в `jobs`, фактически: ' . ($after - $before),
        );
    }

    /**
     * Если EMAIL_ADMIN не задан — ни одной новой задачи в `jobs`, редирект со статусом.
     */
    public function test_send_all_queued_does_nothing_without_admin_email(): void
    {
        Config::set('mail.admin_email', '');

        $before = DB::table('jobs')->count();

        $response = $this->post(route('technical.mail-test.send-all'));

        $response->assertRedirect(route('technical.index'));
        $response->assertSessionHas('status');

        $after = DB::table('jobs')->count();
        $this->assertSame($before, $after, 'При пустом EMAIL_ADMIN очередь не должна пополняться.');
    }
}
