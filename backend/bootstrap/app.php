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
        // Gestion des erreurs API en JSON
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->is('v1/*')) {
                return response()->json([
                    'error' => 'Server Error',
                    'message' => $e->getMessage(),
                ], 500);
            }
        });
    })
    ->create();
