<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $adminRole = Role::updateOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $managerRole = Role::updateOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $customerRole = Role::updateOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        $tenant = Tenant::updateOrCreate(
            ['slug' => 'alpha'],
            [
                'name' => 'ALPHA CONSTRUCTION',
                'domain' => 'alpha-construction-qpi.onrender.com',
                'plan' => 'enterprise',
                'settings' => [
                    'logo_url' => null,
                    'favicon_url' => null,
                    'browser_title' => 'Alpha - Excellence du Bâtiment',
                    'primary_color' => '#0056D2',
                    'socials' => [
                        'facebook' => 'https://facebook.com/alphaconstruction',
                        'instagram' => 'https://instagram.com/alphaconstruction',
                        'linkedin' => 'https://linkedin.com/company/alphaconstruction'
                    ],
                    'contact' => [
                        'address' => "12 Rue de l'Innovation, 75008 Paris",
                        'phone' => '+261 34 41 959 90',
                        'email' => 'rayzeletrama8@gmail.com'
                    ],
                    // --- 5 PILIERS WHY US ---
                    'why_us' => [
                        ['icon' => 'ShieldCheck', 'title' => 'Qualité', 'desc' => 'Une sélection rigoureuse des matériaux et une exécution sans compromis.'],
                        ['icon' => 'History', 'title' => 'Expérience', 'desc' => 'Plus de 15 ans de savoir-faire technique au service de vos projets.'],
                        ['icon' => 'Clock', 'title' => 'Délais', 'desc' => 'Une gestion de projet optimisée pour respecter vos échéances.'],
                        ['icon' => 'MessageSquare', 'title' => 'Écoute', 'desc' => 'Un interlocuteur unique pour une compréhension totale de vos besoins.'],
                        ['icon' => 'HardHat', 'title' => 'Sécurité', 'desc' => 'Le respect strict des normes de sécurité sur tous nos chantiers.']
                    ],
                    // --- 5 PARTENAIRES ---
                    'partners' => [
                        ['name' => 'Lafarge', 'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/LafargeHolcim_logo.svg/2560px-LafargeHolcim_logo.svg.png', 'url' => '#'],
                        ['name' => 'Point.P', 'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_Point.P.svg/1200px-Logo_Point.P.svg.png', 'url' => '#'],
                        ['name' => 'Hilti', 'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Hilti_logo.svg/1280px-Hilti_logo.svg.png', 'url' => '#'],
                        ['name' => 'Saint-Gobain', 'logo' => 'https://upload.wikimedia.org/wikipedia/fr/thumb/a/a4/Saint-Gobain_logo_2016.svg/1200px-Saint-Gobain_logo_2016.svg.png', 'url' => '#'],
                        ['name' => 'Caterpillar', 'logo' => 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Caterpillar_logo.svg/2560px-Caterpillar_logo.svg.png', 'url' => '#']
                    ]
                ]
            ]
        );

        app()->instance('currentTenant', $tenant);

        $admin = User::updateOrCreate(
            ['email' => 'admin@alpha.com'],
            ['name' => 'Beru Admin', 'password' => Hash::make('password'), 'tenant_id' => $tenant->id]
        );
        $admin->assignRole($adminRole);

        $this->call([
            ArticleSeeder::class,
            HomePageSeeder::class,
            MasonryPageSeeder::class,
            RenovationPageSeeder::class,
            EarthworkPageSeeder::class,
            ContactPageSeeder::class,
            ProjectsPageSeeder::class,
            LegalPagesSeeder::class, // Assure-toi que ce seeder existe
        ]);
    }
}
