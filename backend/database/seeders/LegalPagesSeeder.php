<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class LegalPagesSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        if (!$tenant) return;

        // On injecte le tenant pour le trait BelongsToTenant
        app()->instance('currentTenant', $tenant);

        // 1. Page Mentions Légales
        Page::updateOrCreate(
            ['slug' => 'mentions-legales', 'tenant_id' => $tenant->id],
            [
                'title' => 'Mentions Légales',
                'content' => [
                    'sections' => [
                        [
                            'title' => 'Édition du site',
                            'text' => 'Le présent site est édité par ' . $tenant->name . ', au capital de XXX euros, dont le siège social est situé à ' . ($tenant->settings['contact']['address'] ?? 'Paris') . '.'
                        ],
                        [
                            'title' => 'Hébergement',
                            'text' => 'Le site est hébergé par Vercel Inc. et les services de base de données par Supabase.'
                        ]
                    ]
                ]
            ]
        );

        // 2. Page Politique de Confidentialité
        Page::updateOrCreate(
            ['slug' => 'confidentialite', 'tenant_id' => $tenant->id],
            [
                'title' => 'Politique de Confidentialité',
                'content' => [
                    'sections' => [
                        [
                            'title' => 'Collecte des données',
                            'text' => 'Les informations recueillies via le formulaire de contact sont destinées uniquement à la gestion de vos demandes de devis.'
                        ],
                        [
                            'title' => 'Utilisation des cookies',
                            'text' => 'Ce site utilise des cookies techniques strictement nécessaires à la navigation et à la sécurité.'
                        ]
                    ]
                ]
            ]
        );
    }
}
