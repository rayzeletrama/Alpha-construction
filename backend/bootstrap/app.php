<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

// On définit le dossier temporaire pour Vercel
$storagePath = '/tmp/storage';

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
        $exceptions->shouldRenderGroupAsJson('api');

        $exceptions->render(function (\Throwable $e, Request $request) {
            return response()->json([
                'error' => 'Production Error',
                'message' => $e->getMessage(),
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        });
    })
    ->create()
    // On force le storage path APRES le create mais Laravel 11/13 le gère mieux ici
    ->useStoragePath(isset($_SERVER['VERCEL']) ? '/tmp' : storage_path());
