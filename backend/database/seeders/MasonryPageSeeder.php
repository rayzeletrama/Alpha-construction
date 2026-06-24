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
                        'image' => 'https://images.unsplash.com/photo-1590069230002-70cc83810bb3'
                    ],
                    'intro' => [
                        'title' => 'Des fondations solides pour vos projets.',
                        'text' => 'La maçonnerie est le cœur de notre métier...',
                        'services' => ["Fondations spéciales", "Murs porteurs", "Dalles béton"],
                        'images' => [
                            'https://images.unsplash.com/photo-1589939705384-5185137a7f0f',
                            'https://images.unsplash.com/photo-1541888946425-d81bb19480c5'
                        ]
                    ],
                    'articles' => [
                        [
                            'badge' => 'Focus Technique 01',
                            'title' => 'Fondations & Gros Œuvre',
                            'slug' => 'maconnerie-gros-oeuvre', // <-- LIEN VERS L'ARTICLE
                            'text' => 'La base de toute construction pérenne...',
                            'image' => 'https://images.unsplash.com/photo-1590069230002-70cc83810bb3'
                        ],
                        [
                            'badge' => 'Focus Technique 02',
                            'title' => 'Maçonnerie de Pierre',
                            'slug' => 'maconnerie-pierre', // <-- LIEN VERS L'ARTICLE
                            'text' => "Allier le charme de l'ancien aux performances...",
                            'image' => 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15'
                        ]
                    ]
                ]
            ]
        );
    }
}
