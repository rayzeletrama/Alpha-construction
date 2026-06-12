<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;

class IdentifyTenant
{
public function handle(Request $request, Closure $next)
{
    if ($request->isMethod('OPTIONS') || $request->is('debug*') || $request->is('health')) {
        return $next($request);
    }

    // On essaie de récupérer le premier tenant sans faire de requêtes compliquées
    // pour stabiliser le démarrage
    try {
        $tenant = \App\Models\Tenant::first();
        if ($tenant) {
            app()->instance('currentTenant', $tenant);
        }
    } catch (\Exception $e) {
        // Ne rien faire, laisser l'app démarrer même sans DB pour voir l'erreur après
    }

    return $next($request);
}
}
