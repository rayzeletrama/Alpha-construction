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
        // Enregistrement des alias de middleware
        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'tenant' => \App\Http\Middleware\IdentifyTenant::class,
        ]);

        // Désactiver CSRF pour l'API
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'v1/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Force le format JSON pour toutes les erreurs API
        $exceptions->shouldRenderGroupAsJson('api');

        // Gestionnaire d'erreurs global pour éviter les pages HTML en production
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->is('v1/*')) {
                return response()->json([
                    'status'  => 'error',
                    'message' => $e->getMessage(),
                    'debug'   => [
                        'exception' => get_class($e),
                        'file'      => str_replace(base_path(), '', $e->getFile()),
                        'line'      => $e->getLine(),
                    ]
                ], 500);
            }
        });
    })
    ->create()
    // Utilise /tmp seulement si on est sur Vercel, sinon utilise le storage normal
    ->useStoragePath(isset($_SERVER['VERCEL']) ? '/tmp' : storage_path());
