<?php

namespace App\Listeners\Technical;

use App\Mail\Technical\TestMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class QueueTestMailListener implements ShouldQueue
{
    use Dispatchable;
    use Queueable;
    use InteractsWithQueue;
    use SerializesModels;

    private string $recipient;

    /**
     * Сохраняет email получателя для последующей отправки письма в очереди.
     * Используется при dispatch обработчика из технического контроллера.
     */
    public function __construct(string $recipient)
    {
        $this->recipient = $recipient;
    }

    /**
     * Выполняет отправку тестового письма в очереди.
     * Используется как прямой очередной обработчик без event-класса.
     */
    public function handle(): void
    {
        Mail::send(new TestMail($this->recipient));
    }
}
