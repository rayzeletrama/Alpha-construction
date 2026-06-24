<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ContactPageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        Page::updateOrCreate(
            ['slug' => 'contact', 'tenant_id' => $tenant->id],
            [
                'title' => 'Contact',
                'content' => [
                    'form_recipient' => 'rivonirina.ra@gmail.com', // Ton email
                    'hero' => [
                        'title' => 'PARLONS DE VOTRE PROJET.',
                        'subtitle' => 'Contact',
                        'image' => 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a'
                    ],
                    'info_section' => [
                        'title' => 'Une réponse rapide.',
                        'description' => 'Devis gratuit sous 48h.',
                        'address' => "12 Rue de l'Innovation, 75008 Paris",
                        'phone' => '01 02 03 04 05',
                        'email' => 'contact@alpha-business.fr',
                        'google_maps_url' => 'https://www.google.com/maps/embed?pb=...'
                    ],
                    'values_section' => [
                        'articles' => [
                            [
                                'badge' => 'Valeurs 01',
                                'title' => 'Engagement Qualité',
                                'slug' => 'contact-engagement-qualite', // <-- LIEN
                                'text' => "La satisfaction client est notre priorité...",
                                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c'
                            ]
                        ]
                    ]
                ]
            ]
        );
    }
}
