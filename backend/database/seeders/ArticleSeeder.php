<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::first();
        if (!$tenant) return;

        // On définit l'instance pour le trait BelongsToTenant
        app()->instance('currentTenant', $tenant);

        $articles = [
            // --- MAÇONNERIE ---
            [
                'slug' => 'maconnerie-gros-oeuvre',
                'category' => 'Maçonnerie',
                'title' => 'Fondations & Gros Œuvre',
                'subtitle' => 'La base de toute construction pérenne.',
                'main_image' => 'https://images.unsplash.com/photo-1590069230002-70cc83810bb3',
                'full_description' => 'La structure d’un bâtiment détermine sa longévité. Nous mettons en œuvre des techniques de pointe pour garantir une stabilité absolue.',
                'sections' => [
                    ['title' => 'Étude de sol', 'text' => 'Chaque projet commence par une analyse rigoureuse pour adapter les fondations.'],
                    ['title' => 'Béton Armé', 'text' => 'Utilisation de ferraillage haute densité pour une résistance sismique optimale.']
                ],
                'faqs' => [
                    ['question' => 'Quelle est la durée de séchage du béton ?', 'answer' => 'Le temps de séchage structurel minimum est de 28 jours.'],
                    ['question' => 'Et si le terrain est instable ?', 'answer' => 'Nous installons des micro-pieux ou des radiers renforcés.']
                ]
            ],
            [
                'slug' => 'maconnerie-pierre',
                'category' => 'Maçonnerie',
                'title' => 'Maçonnerie de Pierre',
                'subtitle' => 'L’alliance du charme ancien et de la performance.',
                'main_image' => 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15',
                'full_description' => 'Restaurer le patrimoine demande une main d’œuvre d’exception et des matériaux authentiques.',
                'sections' => [
                    ['title' => 'Taille de pierre', 'text' => 'Nos artisans taillent chaque bloc sur mesure pour respecter l’âme du bâti.'],
                    ['title' => 'Mortiers à la chaux', 'text' => 'Nous n’utilisons que de la chaux naturelle pour laisser respirer les murs.']
                ],
                'faqs' => [
                    ['question' => 'Utilisez-vous du ciment classique ?', 'answer' => 'Non, exclusivement de la chaux NHL pour la respiration du bâti.'],
                    ['question' => 'D’où viennent vos pierres ?', 'answer' => 'De carrières locales sélectionnées pour leur grain et leur teinte.']
                ]
            ],

            // --- RÉNOVATION ---
            [
                'slug' => 'renovation-design',
                'category' => 'Rénovation',
                'title' => 'Réaménagement & Design',
                'subtitle' => 'Repenser vos volumes pour un confort moderne.',
                'main_image' => 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6',
                'full_description' => 'Transformer un espace demande une vision globale : abattre des porteurs, créer de la lumière et optimiser chaque m².',
                'sections' => [
                    ['title' => 'Conception 3D', 'text' => 'Nous modélisons votre futur intérieur avant le premier coup de pioche.'],
                    ['title' => 'Suivi de chantier', 'text' => 'Un conducteur de travaux unique coordonne tous les corps d’état.']
                ],
                'faqs' => [
                    ['question' => 'Proposez-vous des plans 3D ?', 'answer' => 'Oui, pour chaque projet de réaménagement complet.'],
                    ['question' => 'Comment est organisée la logistique ?', 'answer' => 'Nous gérons les livraisons et les évacuations de gravats en flux tendu.']
                ]
            ],

            // --- CONTACT / VALEURS (Nouveau) ---
            [
                'slug' => 'contact-engagement-qualite',
                'category' => 'Valeurs',
                'title' => 'Engagement Qualité',
                'subtitle' => 'La satisfaction client au centre de nos préoccupations.',
                'main_image' => 'https://images.unsplash.com/photo-1497366216548-37526070297c',
                'full_description' => 'Depuis 15 ans, nous ne faisons aucun compromis sur la qualité des matériaux et la précision de pose.',
                'sections' => [
                    ['title' => 'Transparence', 'text' => 'Nos devis sont détaillés et nos délais sont fermes.'],
                    ['title' => 'Certification RGE', 'text' => 'Nous sommes agréés pour vous faire bénéficier des aides d’État.']
                ],
                'faqs' => [
                    ['question' => 'Le chiffrage initial est-il garanti ?', 'answer' => 'Oui, sauf modification expresse demandée en cours de chantier.']
                ]
            ]
        ];

        foreach ($articles as $art) {
    Article::updateOrCreate(
        ['slug' => $art['slug'], 'tenant_id' => $tenant->id], // On cherche par slug ET tenant
        $art
    );
        }
    }
}
