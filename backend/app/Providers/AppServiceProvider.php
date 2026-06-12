<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // FORCE Laravel à utiliser /tmp sur Vercel
        if (env('APP_ENV') === 'production') {
            $this->app->useStoragePath('/tmp');
        }
    }

    public function boot(): void
    {
        // On s'assure que les dossiers nécessaires existent dans /tmp
        if (env('APP_ENV') === 'production') {
            $storagePaths = [
                '/tmp/framework/views',
                '/tmp/framework/cache',
                '/tmp/framework/sessions',
                '/tmp/app/public',
            ];
            foreach ($storagePaths as $path) {
                if (!file_exists($path)) {
                    mkdir($path, 0777, true);
                }
            }
        }
    }
}
