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
        $host = $request->getHost();

        // 1. Recherche Prioritaire : Domaine exact ou Slug exact
        // On met en cache pour 1h pour booster la vitesse (surtout sur Vercel/Neon)
        $tenant = Cache::remember("tenant_lookup_{$host}", 3600, function () use ($host) {
            return Tenant::where('domain', $host) // ex: maboutique.com
                ->orWhere('slug', $host)         // ex: localhost
                ->orWhere('slug', explode('.', $host)[0]) // ex: 'alpha' dans alpha.vercel.app
                ->first();
        });

        // 2. Logique de Fallback (Secours) pour le Développement
        if (!$tenant) {
            // SI on est en LOCAL (PC)
            if (app()->environment('local')) {
                $tenant = Tenant::where('slug', 'localhost')->first() ?: Tenant::first();
            }
            // SI on est sur VERCEL (Preview ou Prod)
            elseif (str_contains($host, 'vercel.app')) {
                // Vercel génère des URLs aléatoires, donc on prend la boutique par défaut
                $tenant = Tenant::first();
            }
        }

        // 3. Blocage si vraiment rien n'est trouvé
        if (!$tenant) {
            return response()->json([
                'error' => 'Boutique non configurée.',
                'debug' => [
                    'host' => $host,
                    'env' => app()->environment()
                ]
            ], 404);
        }

        // 4. Injection globale dans l'app
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
