<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Project;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ProjectsPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Récupérer le premier tenant (la boutique Alpha)
        $tenant = Tenant::first();

        if (!$tenant) {
            $this->command->error("Aucun Tenant trouvé. Veuillez d'abord lancer le DatabaseSeeder.");
            return;
        }

        // 2. Créer ou mettre à jour la structure de la page Projects
        Page::updateOrCreate(
            ['slug' => 'projects', 'tenant_id' => $tenant->id],
            [
                'title' => 'Réalisations',
                'content' => [
                    'hero' => [
                        'title' => 'NOS RÉALISATIONS.',
                        'subtitle' => 'Portfolio',
                        'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070'
                    ],
                    'intro' => [
                        'title' => "L'excellence en images.",
                        'description' => "Une sélection de nos plus beaux projets à travers la France."
                    ],
                    'articles' => [
                        [
                            'badge' => 'Savoir-faire 01',
                            'title' => 'Résidentiel Haut de Gamme',
                            'text' => "La construction de villas d'exception demande une rigueur absolue. Nous collaborons avec les meilleurs architectes pour donner vie à des demeures qui allient design contemporain et confort thermique. De la structure en béton banché aux finitions les plus délicates, nous assurons une exécution parfaite pour un patrimoine durable.",
                            'image' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Savoir-faire 02',
                            'title' => 'Rénovations Urbaines',
                            'text' => "Transformer l'existant en plein cœur de ville est un défi logistique et technique. Nous maîtrisons les contraintes de mitoyenneté et de conservation du patrimoine. Nos interventions permettent de moderniser des structures anciennes tout en préservant leur âme, créant ainsi des espaces de vie uniques et valorisés.",
                            'image' => 'https://images.unsplash.com/photo-1600607687940-467f5b637a61?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Savoir-faire 03',
                            'title' => 'Projets Industriels',
                            'text' => "La construction de bâtiments tertiaires et industriels exige une rapidité d'exécution et une solidité à toute épreuve. Nous réalisons des dalles à forte portance, des structures en béton précontraint et des aménagements VRD complexes pour répondre aux besoins spécifiques de chaque activité professionnelle.",
                            'image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070'
                        ]
                    ]
                ]
            ]
        );

        // 3. Vider la table des projets existants pour ce tenant avant de re-remplir
        Project::where('tenant_id', $tenant->id)->delete();

        // 4. Liste de tes réalisations (Portfolio)
        $projectsList = [
            [
                'title' => 'Villa Contemporaine',
                'category' => 'Construction',
                'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070'
            ],
            [
                'title' => 'Rénovation Loft',
                'category' => 'Rénovation',
                'image_url' => 'https://images.unsplash.com/photo-1600607687940-467f5b637a61?q=80&w=2070'
            ],
            [
                'title' => 'Extension Maison',
                'category' => 'Maçonnerie',
                'image_url' => 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070'
            ],
            [
                'title' => 'Aménagement Extérieur',
                'category' => 'Terrassement',
                'image_url' => 'https://images.unsplash.com/photo-1558444479-c86e10556382?q=80&w=2070'
            ],
            [
                'title' => 'Bâtiment Industriel',
                'category' => 'Gros Œuvre',
                'image_url' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070'
            ],
            [
                'title' => 'Piscine Design',
                'category' => 'Construction',
                'image_url' => 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2070'
            ],
            [
                'title' => 'Rénovation Façade',
                'category' => 'Rénovation',
                'image_url' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069'
            ],
            [
                'title' => 'Mur de Soutènement',
                'category' => 'Maçonnerie',
                'image_url' => 'https://images.unsplash.com/photo-1590060417666-4209e3883e16?q=80&w=2077'
            ],
            [
                'title' => 'Fondations Spéciales',
                'category' => 'Gros Œuvre',
                'image_url' => 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070'
            ]
        ];

        foreach ($projectsList as $project) {
            Project::create([
                'tenant_id' => $tenant->id,
                'title' => $project['title'],
                'category' => $project['category'],
                'image_url' => $project['image_url'],
            ]);
        }

        $this->command->info("Page Projects et Portfolio initialisés avec succès !");
    }
}
