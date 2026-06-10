<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class EarthworkPageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();

        Page::updateOrCreate(
            ['slug' => 'terrassement', 'tenant_id' => $tenant->id],
            [
                'title' => 'Terrassement',
                'content' => [
                    'hero' => [
                        'title' => 'TERRASSEMENT.',
                        'subtitle' => 'Expertise 03',
                        'image' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070'
                    ],
                    'intro' => [
                        'title' => 'Une préparation de terrain irréprochable.',
                        'text' => "Le terrassement est l'étape fondatrice de tout projet de construction. Nous intervenons avec précision pour préparer vos terrains, gérer les évacuations et mettre en place les réseaux nécessaires.",
                        'services' => [
                            "Terrassement de masse", "Fouilles en rigoles et tranchées", "Réseaux d'assainissement",
                            "Aménagements extérieurs", "Enrochements et soutènements", "Viabilisation de terrains"
                        ],
                        'images' => [
                            'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070',
                            'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=2070'
                        ]
                    ],
                    'articles' => [
                        [
                            'badge' => 'Focus Terrassement 01',
                            'title' => 'Terrassement de Masse',
                            'text' => "Le terrassement de masse consiste à déplacer d'importants volumes de terre pour modifier le relief d'un terrain. Nous utilisons des engins de pointe pour niveler, décaisser et préparer les plateformes de construction.",
                            'image' => 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Focus Terrassement 02',
                            'title' => 'Réseaux & VRD',
                            'text' => "La viabilisation d'un terrain passe par la mise en place des réseaux (eau, électricité, télécoms, assainissement). Nous réalisons les tranchées techniques avec une précision millimétrée.",
                            'image' => 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Focus Terrassement 03',
                            'title' => 'Aménagements Extérieurs',
                            'text' => "Au-delà de la structure, nous préparons vos espaces de vie extérieurs. Création de chemins d'accès, enrochements paysagers pour soutenir des talus ou préparation de sols pour terrasses et piscines.",
                            'image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Focus Terrassement 04',
                            'title' => 'Ouvrages de Soutènement',
                            'text' => "La gestion des dénivelés importants nécessite des ouvrages de soutènement robustes : blocs béton, enrochements cyclopéens ou murs en gabions pour stabiliser les terres.",
                            'image' => 'https://images.unsplash.com/photo-1558444479-c86e10556382?q=80&w=2070'
                        ]
                    ]
                ]
            ]
        );
    }
}
