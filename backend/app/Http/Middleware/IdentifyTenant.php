<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // 1. FORCER LES HEADERS CORS MANUELLEMENT (Secours si cors.php échoue)
        // On récupère l'origine de la requête (ex: ton site vercel)
        $origin = $request->header('Origin');

        // 2. Gérer les requêtes OPTIONS (Preflight)
        if ($request->isMethod('OPTIONS')) {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        }

        // 3. Logique d'identification du Tenant
        try {
            $host = $request->getHost();

            // On cherche par domaine ou slug
            $tenant = Tenant::where('domain', $host)
                ->orWhere('slug', 'alpha')
                ->first();

            if (!$tenant) {
                $tenant = Tenant::first();
            }

            if ($tenant) {
                app()->instance('currentTenant', $tenant);
            }
        } catch (\Exception $e) {
            \Log::error("Connexion DB échouée: " . $e->getMessage());
        }

        // 4. Exécuter la requête suivante
        $response = $next($request);

        // 5. Injecter les headers CORS dans la réponse finale (même si c'est une erreur)
        if (method_exists($response, 'header')) {
            $response->header('Access-Control-Allow-Origin', $origin)
                     ->header('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }
}
