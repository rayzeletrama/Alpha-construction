<?php

namespace App\Providers;

use App\Models\Tenant;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class TenancyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('currentTenant', function () {
            return null; // Sera rempli par le middleware
        });
    }

    public function boot(Request $request): void
    {
        // On ne cherche le tenant que si on est sur une route API ou Web (pas en console)
        if (!app()->runningInConsole()) {
            $host = $request->getHost();

            // Identification par domaine (ex: boutique1.com)
            // ou par header (ex: X-Tenant-Id pour le dev)
            $tenant = Tenant::where('domain', $host)
                            ->orWhere('slug', explode('.', $host)[0])
                            ->first();

            if ($tenant) {
                $this->app->instance('currentTenant', $tenant);

                // Configurer dynamiquement les variables système si besoin
                config(['app.name' => $tenant->name]);
            }
        }
    }
}
