<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

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
        // FORCE LE JSON POUR TOUT LE MONDE SUR VERCEL
        $exceptions->shouldRenderGroupAsJson('api');

        // On intercepte TOUTES les erreurs pour renvoyer du JSON pur
        $exceptions->render(function (\Throwable $e, Request $request) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'file' => str_replace('/var/task/user/', '', $e->getFile()),
                'line' => $e->getLine()
            ], 500);
        });
    })
    ->create()
    // Utilisation du chemin forcé au point 1
    ->useStoragePath(env('APP_STORAGE', storage_path()));
