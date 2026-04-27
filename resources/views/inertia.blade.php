<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

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

        @inertiaHead
        @vite(['resources/scss/app.scss', 'resources/js/inertia-app.js'])
    </head>
    <body class="antialiased">
        @inertia
    </body>
</html>
