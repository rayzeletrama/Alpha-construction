<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Project;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ProjectsPageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        app()->instance('currentTenant', $tenant);

        // 1. Correction de la structure de la PAGE (Contient maintenant les articles de bas de page)
        Page::updateOrCreate(['slug' => 'projects', 'tenant_id' => $tenant->id], [
            'title' => 'Réalisations',
            'content' => [
                'hero' => [
                    'title' => 'NOS RÉALISATIONS.',
                    'subtitle' => 'Portfolio',
                    'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
                ],
                'intro' => [
                    'title' => "L'excellence en images.",
                    'description' => "Une sélection de nos plus beaux projets à travers la France."
                ],
                // AJOUT DE CETTE SECTION QUI MANQUAIT :
                'articles' => [
                    [
                        'badge' => 'Savoir-faire 01',
                        'title' => 'Résidentiel Haut de Gamme',
                        'slug' => 'projet-residentiel-luxe',
                        'text' => "La construction de villas d'exception demande une rigueur absolue...",
                        'image' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009'
                    ],
                    [
                        'badge' => 'Savoir-faire 02',
                        'title' => 'Rénovations Urbaines',
                        'slug' => 'projet-renovation-urbaine',
                        'text' => "Transformer l'existant en plein cœur de ville est un défi logistique...",
                        'image' => 'https://images.unsplash.com/photo-1600607687940-467f5b637a61'
                    ],
                    [
                        'badge' => 'Savoir-faire 03',
                        'title' => 'Projets Industriels',
                        'slug' => 'projet-industriel',
                        'text' => "La construction de bâtiments tertiaires exige une rapidité d'exécution...",
                        'image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'
                    ]
                ]
            ]
        ]);

        // 2. Liste des projets individuels (La grille de photos)
        Project::where('tenant_id', $tenant->id)->delete();
        $list = [
            ['title' => 'Villa Contemporaine', 'category' => 'Construction', 'slug' => 'projet-residentiel-luxe', 'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009'],
            ['title' => 'Rénovation Loft', 'category' => 'Rénovation', 'slug' => 'projet-renovation-urbaine', 'image_url' => 'https://images.unsplash.com/photo-1600607687940-467f5b637a61'],
            ['title' => 'Extension Maison', 'category' => 'Maçonnerie', 'slug' => 'maconnerie-gros-oeuvre', 'image_url' => 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'],
            ['title' => 'Aménagement Extérieur', 'category' => 'Terrassement', 'slug' => 'terrassement-masse', 'image_url' => 'https://images.unsplash.com/photo-1558444479-c86e10556382'],
        ];

        foreach ($list as $p) {
            Project::create(array_merge($p, ['tenant_id' => $tenant->id]));
        }
    }
}
