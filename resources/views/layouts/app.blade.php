<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

        <!-- Styles -->
        @if(app()->environment('local'))
            @vite(['resources/css/app.scss', 'resources/js/app.js'])
        @else
            @php
                $manifestPath = public_path('build/manifest.json');
                if (file_exists($manifestPath)) {
                    $manifest = json_decode(file_get_contents($manifestPath), true);
                } else {
                    $manifest = null;
                }
            @endphp
            @if($manifest && isset($manifest['resources/css/app.scss']))
                <link rel="stylesheet" href="{{ asset('build/' . $manifest['resources/css/app.scss']['file']) }}">
            @endif
            @if($manifest && isset($manifest['resources/js/app.js']))
                <script type="module" src="{{ asset('build/' . $manifest['resources/js/app.js']['file']) }}"></script>
            @endif
        @endif
    </head>
    <body class="antialiased">
        <script>
            // Удаляем старые куки с флагом secure для HTTP
            if (location.protocol === 'http:') {
                ['XSRF-TOKEN', '{{ config('session.cookie') }}'].forEach(function(cookieName) {
                    // Удаляем для текущего домена
                    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    // Удаляем для домена с точкой
                    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.safe-batch.local;';
                    // Удаляем для домена без точки
                    document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=safe-batch.local;';
                });
            }
        </script>
        @yield('content')
    </body>
</html>

