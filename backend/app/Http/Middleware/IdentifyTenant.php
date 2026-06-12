<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // 1. LAISSER PASSER LES REQUÊTES OPTIONS (Indispensable pour le CORS)
        if ($request->isMethod('OPTIONS')) {
            return $next($request);
        }

        $host = $request->getHost();

        // 2. Recherche ultra-flexible pour éviter les 500 en prod
        try {
            $tenant = Tenant::where('domain', $host)
                ->orWhere('slug', 'alpha')
                ->orWhere('slug', 'localhost')
                ->first() ?: Tenant::first(); // Prend le premier si rien n'est trouvé

            if (!$tenant) {
                return response()->json(['error' => 'No shops configured'], 404);
            }

            app()->instance('currentTenant', $tenant);

        } catch (\Exception $e) {
            // Si la DB Neon n'est pas accessible, on ne crash pas ici
            // pour laisser Laravel afficher l'erreur de connexion réelle
        }

        return $next($request);
    }
}
