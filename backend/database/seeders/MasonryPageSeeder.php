<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class MasonryPageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();

        Page::updateOrCreate(
            ['slug' => 'masonry', 'tenant_id' => $tenant->id],
            [
                'title' => 'Maçonnerie',
                'content' => [
                    'hero' => [
                        'title' => 'MAÇONNERIE.',
                        'subtitle' => 'Expertise 01',
                        'image' => 'https://images.unsplash.com/photo-1590069230002-70cc83810bb3?q=80&w=2070'
                    ],
                    'intro' => [
                        'title' => 'Des fondations solides pour vos projets.',
                        'text' => 'La maçonnerie est le cœur de notre métier. Nous intervenons sur tous types de structures...',
                        'services' => [
                            "Fondations spéciales", "Murs porteurs et refends", "Dalles et chapes béton",
                            "Maçonnerie de pierre", "Ouvertures en sous-œuvre", "Escaliers béton sur-mesure"
                        ],
                        'images' => [
                            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
                            'https://images.unsplash.com/photo-1541888946425-d81bb19480c5'
                        ]
                    ],
                    'articles' => [
                        [
                            'badge' => 'Focus Technique 01',
                            'title' => 'Fondations & Gros Œuvre',
                            'slug' => 'maconnerie-gros-oeuvre',
                            'text' => 'La base de toute construction pérenne repose sur la qualité de ses fondations...',
                            'image' => 'https://images.unsplash.com/photo-1590069230002-70cc83810bb3'
                        ],
                        [
                            'badge' => 'Focus Technique 02',
                            'title' => 'Maçonnerie de Pierre & Tradition',
                            'slug' => 'maconnerie-tradition',
                            'text' => "Allier le charme de l'ancien aux performances modernes...",
                            'image' => 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15'
                        ],
                        [
                            'badge' => 'Focus Technique 03',
                            'title' => 'Ouvrages Béton & Finitions',
                            'slug' => 'maconnerie-finitions',
                            'text' => 'Le béton n\'est pas seulement structurel, il est aussi un élément de design...',
                            'image' => 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f'
                        ],
                        [
                            'badge' => 'Focus Technique 04',
                            'title' => 'Ouvertures en Sous-Œuvre',
                            'slug' => 'maconnerie-sous-oeuvre',
                            'text' => 'Modifier la structure porteuse d\'un bâtiment existant requiert une expertise pointue...',
                            'image' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'
                        ]
                    ]
                ]
            ]
        );
    }
}
