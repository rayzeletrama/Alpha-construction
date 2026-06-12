<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // --- AJOUTE CES LIGNES ICI ---
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'tenant' => \App\Http\Middleware\IdentifyTenant::class,
        ]);

        // Désactiver CSRF pour l'API (Sanctum utilise des tokens)
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
         // FORCER LES ERREURS EN JSON (Pour éviter l'erreur "view not found")
        $exceptions->shouldRenderGroupAsJson('api');

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->is('v1/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ], 500);
            }
        });       //
    })->create();
