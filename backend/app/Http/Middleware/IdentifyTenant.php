<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IdentifyTenant
{
// IdentifyTenant.php
public function handle(Request $request, Closure $next)
{
    // Si c'est une requête OPTIONS (CORS), on laisse passer sans vérifier le tenant
    if ($request->isMethod('OPTIONS')) {
        return $next($request);
    }

    try {
        $host = $request->getHost();
        $tenant = \App\Models\Tenant::where('domain', $host)
            ->orWhere('slug', 'localhost')
            ->orWhere('slug', 'alpha')
            ->first() ?: \App\Models\Tenant::first();

        if (!$tenant) {
            return response()->json(['error' => 'No Tenant'], 404);
        }

        app()->instance('currentTenant', $tenant);
        return $next($request);
    } catch (\Exception $e) {
        // On log l'erreur pour la voir dans Vercel mais on ne crash pas
        error_log("Tenant Error: " . $e->getMessage());
        return $next($request);
    }
}
}
