<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $host = $request->getHost();

            // Recherche du tenant
            $tenant = Tenant::where('domain', $host)
                ->orWhere('slug', 'localhost')
                ->orWhere('slug', 'alpha')
                ->first();

            // Fallback si rien n'est trouvé
            if (!$tenant) {
                $tenant = Tenant::first();
            }

            if (!$tenant) {
                Log::error("IdentifyTenant: Aucun tenant trouvé en base de données.");
                return response()->json(['error' => 'Database empty'], 500);
            }

            app()->instance('currentTenant', $tenant);
            return $next($request);

        } catch (\Exception $e) {
            Log::error("IdentifyTenant Crash: " . $e->getMessage());
            return response()->json(['error' => 'Server Error in Tenancy'], 500);
        }
    }
}
