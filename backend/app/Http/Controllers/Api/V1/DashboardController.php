<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Project;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Les statistiques sont filtrées par le TenantScope automatiquement
        return response()->json([
            'stats' => [
                [
                    'label' => 'Total Pages',
                    'value' => Page::count(),
                    'trend' => '+2 cette semaine',
                    'icon' => 'Files'
                ],
                [
                    'label' => 'Services Actifs',
                    'value' => Product::count(),
                    'trend' => 'Stable',
                    'icon' => 'Package'
                ],
                [
                    'label' => 'Utilisateurs Admin',
                    'value' => User::count(),
                    'trend' => 'Vous seul',
                    'icon' => 'Users'
                ],
                [
                'label' => 'Messages non lus',
                'value' => \App\Models\Lead::where('status', 'new')->count(),
                'trend' => 'À traiter',
                'icon' => 'Mail',
                'unread_count' => \App\Models\Lead::where('status', 'new')->count(), // Doublon pour le badge
                ],
            ],
            'unread_leads_count' => \App\Models\Lead::where('status', 'new')->count(),
            'recent_pages' => Page::orderBy('updated_at', 'desc')->take(5)->get(['title', 'slug', 'updated_at']),
            'tenant_info' => app('currentTenant')
        ]);
    }
}
