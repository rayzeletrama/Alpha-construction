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
                    'form_recipient' => 'rivonirina.ra@gmail.com',
                    'hero' => [
                        'title' => 'PARLONS DE VOTRE PROJET.',
                        'subtitle' => 'Contact',
                        'image' => 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074'
                    ],
                    'info_section' => [
                        'title' => 'Une réponse rapide.',
                        'description' => 'Devis gratuit et personnalisé sous 48h.',
                        'address' => "12 Rue de l'Innovation, 75008 Paris",
                        'phone' => '01 02 03 04 05',
                        'email' => 'contact@alpha-business.fr',
                        'hours' => 'Lun - Ven: 8h00 - 18h00',
                        'google_maps_url' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.221424510188!2d2.306366315674375!3d48.87276297928916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc4f4f4f4f5%3A0x4f4f4f4f4f4f4f4f!2sParis!5e0!3m2!1sen!2sfr!4v1625584800000!5m2!1sen!2sfr'
                    ],
                    'values_section' => [
                        'title' => "Plus qu'une Entreprise",
                        'description' => "Découvrez les valeurs et l'équipe qui portent vos projets au quotidien.",
                        'articles' => [
                            [
                                'badge' => 'Valeurs 01',
                                'title' => 'Notre Engagement Qualité',
                                'text' => "La satisfaction de nos clients est le moteur de notre entreprise...",
                                'image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c'
                            ],
                            [
                                'badge' => 'Valeurs 02',
                                'title' => 'Une Équipe de Passionnés',
                                'text' => "Alpha Construction, c'est avant tout une aventure humaine...",
                                'image' => 'https://images.unsplash.com/photo-1556761175-b413da4baf72'
                            ]
                        ]
                    ]
                ]
            ]
        );
    }
}
