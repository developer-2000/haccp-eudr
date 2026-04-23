<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script>
            window.locale = "{{ $localeForFrontend ?? app()->getLocale() }}";
            window.appName = "{{ config('app.name') }}";
            window.adminEmail = "{{ config('mail.admin_email') }}";
            window.translations = @json($translationsForFrontend ?? []);
            window.availableLocales = @json(array_keys(config('site.languages.countries', [])));
            window.localeHreflangMap = @json(array_map(fn($m) => $m['hreflang'] ?? null, config('site.languages.countries', [])));
            window.localeCountries = @json(config('site.languages.countries', []));
        </script>

        <title>{{ $seo['title'] ?? config('app.name', 'Laravel') }}</title>
        <meta name="description" content="{{ $seo['description'] ?? '' }}">

        <meta property="og:title" content="{{ $seo['og_title'] ?? $seo['title'] ?? config('app.name') }}">
        <meta property="og:description" content="{{ $seo['og_description'] ?? $seo['description'] ?? '' }}">
        <meta property="og:image" content="{{ asset($seo['og_image'] ?? '/images/haccpilot.jpg') }}">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:type" content="{{ $seo['og_type'] ?? 'website' }}">
        <meta property="og:site_name" content="HACCPilot">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $seo['twitter_title'] ?? $seo['title'] ?? config('app.name') }}">
        <meta name="twitter:description" content="{{ $seo['twitter_description'] ?? $seo['description'] ?? '' }}">
        <meta name="twitter:image" content="{{ asset($seo['og_image'] ?? '/images/haccpilot.jpg') }}">

        <link rel="canonical" href="{{ $seo['canonical'] ?? url()->current() }}">
        @if(!empty($seo['hreflang']))
            @foreach($seo['hreflang'] as $alt)
                <link rel="alternate" hreflang="{{ $alt['lang'] }}" href="{{ $alt['href'] }}">
            @endforeach
        @endif

        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "{{ config('app.name') }}",
            "url": "{{ config('app.url') }}",
            "logo": "{{ asset('/images/haccpilot.jpg') }}",
            "description": "Digital HACCP & EUDR compliance platform for food businesses.",
            "sameAs": []
        }
        </script>

        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

        @vite(['resources/scss/app.scss', 'resources/js/app.js'])
    </head>
    <body class="antialiased">
        <div
            id="app"
            data-locale="{{ $localeForFrontend ?? app()->getLocale() }}"
            data-languages="{{ json_encode($languagesForFrontend ?? []) }}"
        ></div>
    </body>
</html>

