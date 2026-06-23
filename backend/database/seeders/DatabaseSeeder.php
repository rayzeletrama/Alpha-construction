<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer les rôles de base (Spatie Permission)
        // On utilise 'web' car Sanctum s'appuie sur le guard par défaut
        $adminRole = Role::updateOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $managerRole = Role::updateOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $customerRole = Role::updateOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // 2. Créer le premier Tenant (Boutique Alpha)
        // On utilise 'localhost' pour le développement local
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'localhost'],
            [
                'name' => 'ALPHA CONSTRUCTION',
                'domain' => 'localhost',
                'plan' => 'enterprise',
                'settings' => [
                    'logo_url' => null, // null = affichage du texte "ALPHA"
                    'primary_color' => '#0056D2', // Bleu de ton index.css
                    'socials' => [
                        'facebook' => 'https://facebook.com/alphaconstruction',
                        'instagram' => 'https://instagram.com/alphaconstruction',
                        'linkedin' => 'https://linkedin.com/company/alphaconstruction'
                    ],
                    'contact' => [
                        'address' => "12 Rue de l'Innovation, 75008 Paris",
                        'phone' => '01 02 03 04 05',
                        'email' => 'contact@alpha-business.fr'
                    ]
                ]
            ]
        );

        // --- IMPORTANT ---
        // On injecte le tenant actuel dans l'application.
        // Sans cette ligne, le Trait 'BelongsToTenant' ne saura pas quel
        // ID assigner aux pages et projets créés ci-dessous.
        app()->instance('currentTenant', $tenant);

        // 3. Créer l'utilisateur Administrateur (Toi)
        $admin = User::updateOrCreate(
            ['email' => 'admin@alpha.com'],
            [
                'name' => 'Beru Admin',
                'password' => Hash::make('password'), // À changer après la première connexion
                'tenant_id' => $tenant->id,
            ]
        );

        // Assigner le rôle admin à l'utilisateur
        $admin->assignRole($adminRole);

        // 4. Appel des Seeders de contenu dynamique
        // Chaque seeder va remplir les textes/images de chaque page
        $this->call([
            HomePageSeeder::class,
            ContactPageSeeder::class,
            MasonryPageSeeder::class,
            RenovationPageSeeder::class,
            EarthworkPageSeeder::class,
            ProjectsPageSeeder::class,
            ArticleSeeder::class,
        ]);

        $this->command->info('-----------------------------------------------');
        $this->command->info('  SaaS Alpha initialisé avec succès !');
        $this->command->info('  Email : admin@alpha.com');
        $this->command->info('  Password : password');
        $this->command->info('-----------------------------------------------');
    }
}
