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
        // 1. Laisser passer le CORS
        if ($request->isMethod('OPTIONS')) {
            return $next($request);
        }

        $host = $request->getHost();

        try {
            // 2. Tenter de trouver la boutique (sans cache pour le moment pour débugger)
            $tenant = Tenant::where('domain', $host)
                ->orWhere('slug', 'alpha')
                ->first();

            // 3. Fallback : si on ne trouve rien, on prend la première
            if (!$tenant) {
                $tenant = DB::table('tenants')->first();
            }

            if (!$tenant) {
                return response()->json(['error' => 'Base de données vide'], 404);
            }

            // Important : convertir en modèle si c'est un objet de table brute
            if (!($tenant instanceof Tenant)) {
                $tenant = Tenant::find($tenant->id);
            }

            app()->instance('currentTenant', $tenant);

        } catch (\Exception $e) {
            // Si la DB est trop lente, on log et on essaie de continuer
            \Log::error("Erreur identification : " . $e->getMessage());
        }

        return $next($request);
    }
}
