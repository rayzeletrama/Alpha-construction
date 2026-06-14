<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\LeadController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'laravel_version' => app()->version()]);
});

// Route ultra-légère pour garder le serveur éveillé
Route::get('/pulse', function () {
    return response()->json(['status' => 'alive', 'time' => now()]);
});

Route::middleware(['tenant'])->group(function () {

    // --- ROUTES PUBLIQUES (V1) ---
    // On ajoute /v1/ devant login et register pour correspondre au frontend
    Route::post('/v1/login', [AuthController::class, 'login']);
    Route::post('/v1/register', [AuthController::class, 'register']);

    Route::get('/v1/settings', [SettingsController::class, 'index']);
    Route::get('/v1/pages/{slug}', [PageController::class, 'show']);

    Route::post('/v1/leads', [LeadController::class, 'store'])->middleware('tenant');

    Route::get('/v1/projects', function() {
        return \App\Models\Project::all();
    });

    // --- ROUTES PRIVÉES (V1) ---
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/v1/me', function (Request $request) {
            return $request->user();
        });

        Route::post('/v1/logout', [AuthController::class, 'logout']);

        // --- ADMINISTRATION ---
        Route::middleware(['role:admin|manager'])->group(function () {
            Route::get('/v1/dashboard', [DashboardController::class, 'index']);
            Route::put('/v1/pages/{slug}', [PageController::class, 'update']);
            Route::put('/v1/settings', [SettingsController::class, 'update']);
            Route::post('/v1/upload', [MediaController::class,'upload']);

            // CRUD Produits/Services
            Route::get('/v1/products', [ProductController::class, 'index']);
            Route::post('/v1/products', [ProductController::class, 'store']);
            Route::put('/v1/products/{product}', [ProductController::class, 'update']);
            Route::delete('/v1/products/{product}', [ProductController::class, 'destroy']);
        });
    });
});
