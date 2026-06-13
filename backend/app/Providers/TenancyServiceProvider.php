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
        if (!app()->runningInConsole()) {
            try {
                $host = $request->getHost();

            // On vérifie si la table existe avant de requêter (évite le crash si migration pas faite)
                if (!\Schema::hasTable('tenants')) {
                    return;
                }

                $tenant = \App\Models\Tenant::where('domain', $host)
                                ->orWhere('slug', explode('.', $host)[0])
                                ->first();

                if ($tenant) {
                    $this->app->instance('currentTenant', $tenant);
                    config(['app.name' => $tenant->name]);
                }
            } catch (\Exception $e) {
            // On log l'erreur mais on ne crash pas l'app
                \Log::error("Tenancy Error: " . $e->getMessage());
            }
        }
    }
}
