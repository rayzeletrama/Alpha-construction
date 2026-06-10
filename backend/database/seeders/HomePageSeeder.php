<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class HomePageSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first(); // On récupère ta boutique

        Page::updateOrCreate(
            ['slug' => 'home', 'tenant_id' => $tenant->id],
            [
                'title' => 'Accueil',
                'content' => [
                    'hero' => [
                        'subtitle' => 'Expertise & Excellence',
                        'title' => 'BÂTIR LE FUTUR AVEC PRÉCISION.',
                        'description' => "L'architecture au service de vos projets de vie. ALPHA transforme vos visions en réalités durables.",
                        'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070'
                    ],
                    'about' => [
                        'image' => 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&q=80&w=2071',
                        'experience_years' => '15+',
                        'experience_label' => "Années d'expérience",
                        'subtitle' => 'Notre Identité',
                        'title' => "L'alliance de la technique et de l'esthétique.",
                        'paragraphs' => [
                            "Depuis plus de 15 ans, ALPHA s'impose comme un acteur majeur du bâtiment premium. Notre approche repose sur une exigence absolue : celle du travail bien fait, dans le respect des délais et des normes environnementales.",
                            "Nous ne nous contentons pas de construire ; nous concevons des espaces qui respirent et qui durent. Chaque projet est une signature, un engagement envers nos clients."
                        ]
                    ],
                    'expertise' => [
                        'subtitle' => 'Nos Métiers',
                        'title' => 'Une expertise multi-facettes.',
                        'services' => [
                            [
                                'id' => '01',
                                'title' => 'Maçonnerie Générale',
                                'description' => 'La fondation de tout projet durable. Nos équipes maîtrisent les techniques traditionnelles et modernes pour garantir la solidité et la pérennité de vos structures.',
                                'image' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2070',
                                'link' => '/maconnerie'
                            ],
                            [
                                'id' => '02',
                                'title' => "Rénovation d'Exception",
                                'description' => "Redonner vie au patrimoine tout en intégrant le confort moderne. Nous transformons l'ancien en espaces contemporains sans dénaturer l'âme des lieux.",
                                'image' => 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=2069',
                                'link' => '/renovation'
                            ],
                            [
                                'id' => '03',
                                'title' => 'Terrassement & VRD',
                                'description' => 'Préparer le terrain avec une précision chirurgicale. Une étape cruciale où chaque centimètre compte pour la réussite de vos aménagements extérieurs.',
                                'image' => 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80&w=2070',
                                'link' => '/terrassement'
                            ]
                        ]
                    ]
                ]
            ]
        );
    }
}
