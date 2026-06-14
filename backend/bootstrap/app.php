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
        // Force le JSON pour toutes les erreurs
        $exceptions->shouldRenderGroupAsJson('api');

        // On empêche Laravel de chercher le moteur "view"
        $exceptions->render(function (\Throwable $e, Request $request) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'debug' => [
                    'file' => str_replace(base_path(), '', $e->getFile()),
                    'line' => $e->getLine()
                ]
            ], 500);
        });
    })
    ->create();
