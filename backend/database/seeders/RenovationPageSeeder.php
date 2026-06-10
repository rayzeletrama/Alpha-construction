<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class RenovationPageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();

        Page::updateOrCreate(
            ['slug' => 'renovation', 'tenant_id' => $tenant->id],
            [
                'title' => 'Rénovation',
                'content' => [
                    'hero' => [
                        'title' => 'RÉNOVATION.',
                        'subtitle' => 'Expertise 02',
                        'image' => 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074'
                    ],
                    'intro' => [
                        'title' => 'Donnez une seconde vie à vos espaces.',
                        'text' => "Nous transformons l'existant en lieux d'exception. Notre expertise en rénovation allie respect du bâti et intégration de solutions modernes.",
                        'services' => [
                            "Réaménagement d'espaces", "Rénovation thermique", "Isolation par l'extérieur",
                            "Revêtements de sols et murs", "Menuiseries extérieures", "Plâtrerie et faux-plafonds"
                        ],
                        'images' => [
                            'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069',
                            'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2070'
                        ]
                    ],
                    'articles' => [
                        [
                            'badge' => 'Focus Rénovation 01',
                            'title' => 'Réaménagement & Design',
                            'text' => "Repenser l'espace pour l'adapter à de nouveaux usages est notre spécialité. Nous abattons les cloisons inutiles, créons des ouvertures lumineuses et optimisons chaque mètre carré.",
                            'image' => 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Focus Rénovation 02',
                            'title' => 'Performance Énergétique',
                            'text' => "La rénovation thermique est un enjeu majeur. Nous installons des solutions d'isolation performantes, remplaçons les menuiseries obsolètes et optimisons les systèmes de chauffage.",
                            'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069'
                        ],
                        [
                            'badge' => 'Focus Rénovation 03',
                            'title' => 'Finitions & Second Œuvre',
                            'text' => "Le diable se cache dans les détails. Nous apportons un soin extrême aux finitions : plâtrerie fine, revêtements de sols et peintures décoratives.",
                            'image' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070'
                        ],
                        [
                            'badge' => 'Focus Rénovation 04',
                            'title' => 'Extension & Surélévation',
                            'text' => "Gagner de la place sans déménager est possible grâce à nos solutions d'extension latérale ou de surélévation de toiture.",
                            'image' => 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070'
                        ]
                    ]
                ]
            ]
        );
    }
}
