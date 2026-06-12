<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Throwable;

// 1. FORCER LE STORAGE VERS /TMP POUR VERCEL
// On le fait avant même de créer l'application
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    mkdir($storagePath, 0777, true);
    mkdir($storagePath . '/framework/views', 0777, true);
    mkdir($storagePath . '/framework/cache', 0777, true);
    mkdir($storagePath . '/framework/sessions', 0777, true);
}

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'tenant' => \App\Http\Middleware\IdentifyTenant::class,
        ]);
        $middleware->validateCsrfTokens(except: ['api/*', 'v1/*']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // 2. RÉPONSE JSON FORCÉE POUR ÉVITER L'ERREUR "VIEW"
        $exceptions->render(function (Throwable $e, Request $request) {
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage(),
                'exception' => get_class($e)
            ], 500);
        });
    })
    ->create()
    ->useStoragePath($storagePath); // 3. APPLIQUER LE CHEMIN /TMP
