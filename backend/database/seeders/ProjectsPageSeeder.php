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

        // Page structure
        Page::updateOrCreate(['slug' => 'projects', 'tenant_id' => $tenant->id], [
            'title' => 'Réalisations',
            'content' => [
                'hero' => ['title' => 'NOS RÉALISATIONS.', 'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'],
                'intro' => ['title' => "L'excellence en images.", 'description' => "Nos plus beaux projets."]
            ]
        ]);

        // Projects list (Portfolio)
        $list = [
            ['title' => 'Villa Contemporaine', 'category' => 'Construction', 'slug' => 'maconnerie-gros-oeuvre', 'image_url' => 'https://images.unsplash.com/photo-1600585154340-be6199f7d009'],
            ['title' => 'Rénovation Loft', 'category' => 'Rénovation', 'slug' => 'renovation-design', 'image_url' => 'https://images.unsplash.com/photo-1600607687940-467f5b637a61']
        ];

        foreach ($list as $p) {
            Project::updateOrCreate(['title' => $p['title'], 'tenant_id' => $tenant->id], $p);
        }
    }
}
