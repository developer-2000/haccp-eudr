<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReferenceDataController;


//Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//    return $request->user();
//});

// Settings
Route::get('/reference-data/company', [ReferenceDataController::class, 'getCompanyReferenceData']);

// Auth
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Guard
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/register/company', [AuthController::class, 'registerCompany']);
    Route::post('/auth/register/phone', [AuthController::class, 'registerPhone']);
});
