<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Test Hub</title>
    @vite(['resources/scss/app.scss', 'resources/js/technical.js'])
</head>
<body>
<div
    id="technical-app"
    data-target-email="{{ $targetEmail }}"
    data-admin-email="{{ $adminEmail }}"
    data-mailer="{{ $mailer }}"
    data-queue-connection="{{ $queueConnection }}"
    data-request-time="{{ now()->toDateTimeString() }}"
    data-mail-send-url="{{ route('technical.mail-test.send') }}"
    data-mail-send-all-url="{{ route('technical.mail-test.send-all') }}"
    data-mail-test-url="{{ route('technical.mail-test.index') }}"
    data-status-message="{{ session('status', '') }}"
    data-csrf-token="{{ csrf_token() }}"
></div>
</body>
</html>
