<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Laisser passer les requêtes techniques (CORS, Debug, Health)
        if ($request->isMethod('OPTIONS') || $request->is('debug*') || $request->is('health') || $request->is('api/v1/debug-db')) {
            return $next($request);
        }

        $host = $request->getHost();
        $tenant = null;

        try {
            // 2. Recherche dynamique : On cherche par domaine ou par slug (ex: alpha.onrender.com -> slug: alpha)
            // On utilise le cache (10 min) pour ne pas ralentir le site avec des requêtes SQL inutiles
            $tenant = Cache::remember("tenant_lookup_{$host}", 600, function () use ($host) {
                // On extrait le premier segment pour le slug (ex: 'alpha' de 'alpha.onrender.com')
                $slug = explode('.', $host)[0];

                return Tenant::where('domain', $host)
                    ->orWhere('slug', $slug)
                    ->orWhere('slug', 'localhost') // Support local
                    ->first();
            });

            // 3. LOGIQUE DE SECOURS (Fallback)
            // Si on ne trouve rien mais qu'on est sur Render ou en local, on prend le premier
            if (!$tenant && (app()->environment('local') || str_contains($host, 'onrender.com'))) {
                $tenant = Tenant::first();
            }

        } catch (\Exception $e) {
            // Si la base de données ne répond pas, on log l'erreur pour Render Logs
            \Log::error("Identification Tenant impossible : " . $e->getMessage());
        }

        // 4. Blocage si vraiment aucun tenant n'existe (Base de données vide)
        if (!$tenant) {
            return response()->json([
                'error' => 'Boutique non identifiée',
                'details' => 'La base de données est peut-être vide ou le domaine est mal configuré.',
                'host' => $host
            ], 404);
        }

        // 5. Enregistrer le tenant globalement
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
