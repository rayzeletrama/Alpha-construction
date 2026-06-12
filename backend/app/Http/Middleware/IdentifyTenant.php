<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Toujours laisser passer les requêtes OPTIONS (CORS)
        if ($request->isMethod('OPTIONS')) {
            return $next($request);
        }

        $host = $request->getHost();
        $tenant = null;

        // 2. Tentative d'identification par domaine ou slug
        try {
            $tenant = Tenant::where('domain', $host)
                ->orWhere('slug', 'alpha') // Ton nouveau slug en prod
                ->orWhere('slug', 'localhost')
                ->first();

            // 3. FALLBACK : Si on est sur Vercel et qu'on ne trouve rien,
            // on prend la PREMIÈRE boutique de la base pour éviter l'erreur 500.
            if (!$tenant && str_contains($host, 'vercel.app')) {
                $tenant = Tenant::first();
            }
        } catch (\Exception $e) {
            // Si la base de données n'est pas joignable, on log l'erreur
            // mais on ne bloque pas encore pour voir l'erreur réelle plus tard
            \Log::error("Connexion Neon échouée dans le Middleware");
        }

        if (!$tenant) {
            return response()->json(['error' => 'Boutique introuvable en base de données.'], 404);
        }

        // Enregistrer la boutique pour tout le reste de l'application
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
