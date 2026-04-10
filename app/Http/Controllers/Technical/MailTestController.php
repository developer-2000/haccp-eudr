<?php

namespace App\Http\Controllers\Technical;

use App\Http\Controllers\Controller;
use App\Listeners\Technical\QueueTestMailListener;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class MailTestController extends Controller
{
    /**
     * Отображает техническую страницу проверки отправки писем.
     * Используется для ручных e2e-тестов цепочки queue -> mail.
     */
    public function index(): View
    {
        return view('technical.index', [
            'targetEmail' => 'thwglobal2000@gmail.com',
            'mailer' => (string)config('mail.default'),
            'queueConnection' => (string)config('queue.default'),
        ]);
    }

    /**
     * Ставит отправку тестового письма в очередь прямым queued-обработчиком.
     * Нужен для проверки корректной фоновой отправки на тестовой странице.
     */
    public function send(): RedirectResponse
    {
        QueueTestMailListener::dispatch('thwglobal2000@gmail.com');

        return redirect()->route('technical.index')->with('status', 'Запрос на отправку поставлен в очередь.');
    }
}
