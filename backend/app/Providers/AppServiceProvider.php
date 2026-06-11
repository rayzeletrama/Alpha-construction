<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // On force Laravel à utiliser /tmp pour le cache et les vues sur Vercel
        if (config('app.env') === 'production') {
            $this->app->useStoragePath('/tmp');
        }
    }

    public function boot(): void
    {
        //
    }
}
