<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Throwable;

$app = Application::configure(basePath: dirname(__DIR__))
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
        // Laravel 13 : Forcer le JSON pour éviter l'erreur de "View"
        $exceptions->shouldRenderGroupAsJson('api');

        $exceptions->render(function (Throwable $e, Request $request) {
            return response()->json([
                'error' => 'Laravel 13 Production Error',
                'message' => $e->getMessage(),
                'exception' => get_class($e),
            ], 500);
        });
    })
    ->create();

// LOGIQUE CRITIQUE POUR VERCEL
if (env('APP_ENV') === 'production') {
    $app->useStoragePath('/tmp');
}

return $app;
