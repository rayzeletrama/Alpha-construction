<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        $host = $request->getHost();

        // En dev, on cherche 'localhost', sinon par domaine ou slug
        $tenant = Tenant::where('slug', 'localhost')
            ->orWhere('domain', $host)
            ->orWhere('slug', explode('.', $host)[0])
            ->first();

        if (!$tenant) {
            return response()->json(['error' => 'Boutique non identifiée.'], 404);
        }

        // On enregistre l'instance
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
