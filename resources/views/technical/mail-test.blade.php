<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Mail Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #1f2937; }
        .container { max-width: 680px; }
        .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
        .meta { margin: 12px 0 20px; line-height: 1.6; }
        .status { margin-bottom: 16px; padding: 10px 12px; border-radius: 6px; background: #ecfdf5; color: #065f46; }
        button { border: 0; background: #111827; color: #fff; border-radius: 6px; padding: 10px 16px; cursor: pointer; }
        button:hover { background: #0b1220; }
    </style>
</head>
<body>
<div class="container">
    <div class="card">
        <h1>Technical: SMTP queue test</h1>

        @if (session('status'))
            <div class="status">{{ session('status') }}</div>
        @endif

        <div class="meta">
            <div><strong>Target email:</strong> {{ $targetEmail }}</div>
            <div><strong>Mailer:</strong> {{ $mailer }}</div>
            <div><strong>Queue connection:</strong> {{ $queueConnection }}</div>
            <div><strong>Request time:</strong> {{ now()->toDateTimeString() }}</div>
        </div>

        <form method="POST" action="{{ route('technical.mail-test.send') }}">
            @csrf
            <button type="submit">Отправить тестовое письмо</button>
        </form>
    </div>
</div>
</body>
</html>
