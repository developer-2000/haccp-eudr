<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class LocaleController extends Controller
{
    private array $available;

    public function __construct()
    {
        // ['en', 'at', 'be', ...]
        $this->available = available_locales();
    }

    /**
     * Редирект с корня на /{locale}. Локаль из session → cookie → config; при недопустимой подставляется app.locale.
     */
    public function redirectToLocale(): RedirectResponse
    {
        $main = config('app.locale');
        $locale = request()->session()->get('locale')
            ?? request()->cookie('locale')
            ?? $main;
        if (!in_array($locale, $this->available)) {
            $locale = $main;
        }

        return redirect('/' . $locale, 302);
    }

    /**
     * Принимает locale из body (JSON/form), валидирует по списку допустимых, пишет в session и cookie на год, возвращает JSON с установленной локалью.
     */
    public function set(Request $request): JsonResponse
    {
        $locale = $request->input('locale') ?? $request->json('locale');

        if (!$locale || !in_array($locale, $this->available)) {
            return response()->json(['message' => 'Invalid locale'], 422);
        }

        $request->session()->put('locale', $locale);

        App::setLocale($locale);

        return response()
            ->json(['locale' => $locale])
            ->cookie('locale', $locale, 60 * 24 * 365);
    }
}
