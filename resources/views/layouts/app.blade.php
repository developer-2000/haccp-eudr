<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        <!-- Styles -->
        @php
            $isViteDev = file_exists(public_path('hot'));
            $manifestPath = public_path('build/manifest.json');
            $manifest = null;
            if (!$isViteDev && file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
            }
            $useManifest = !$isViteDev && $manifest && isset($manifest['resources/scss/app.scss']) && isset($manifest['resources/js/app.js']);
        @endphp

        @if($useManifest)
            <link rel="stylesheet" href="{{ asset('build/' . $manifest['resources/scss/app.scss']['file']) }}">
            @if(isset($manifest['resources/js/app.js']['css']))
                @foreach($manifest['resources/js/app.js']['css'] as $cssFile)
                    <link rel="stylesheet" href="{{ asset('build/' . $cssFile) }}">
                @endforeach
            @endif
            <script type="module" src="{{ asset('build/' . $manifest['resources/js/app.js']['file']) }}"></script>
        @else
            @vite(['resources/scss/app.scss', 'resources/js/app.js'])
        @endif
    </head>
    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>

