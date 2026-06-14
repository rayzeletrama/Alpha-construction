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
            'tenant' => \App\Http\Middleware\IdentifyTenant::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
        ]);

        $middleware->validateCsrfTokens(except: ['api/*', 'v1/*']);
    })
    ->withExceptions(function (Exceptions $exceptions) {
            // Au lieu de shouldRenderGroupAsJson, on utilise render
            $exceptions->render(function (\Throwable $e, Request $request) {
                // Si la requête demande du JSON ou vient de l'API
                if ($request->is('api/*') || $request->is('v1/*') || $request->expectsJson()) {
                    return response()->json([
                        'status' => 'error',
                        'message' => $e->getMessage(),
                        // On n'affiche les détails que si on est en débug
                        'debug' => config('app.debug') ? [
                            'exception' => get_class($e),
                            'file' => $e->getFile(),
                            'line' => $e->getLine(),
                        ] : null
                    ], 500);
                }
            });
        })
    ->create();
