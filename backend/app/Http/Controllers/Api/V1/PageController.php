<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;

class PageController extends Controller
{
    // Récupérer le contenu d'une page
    public function show($slug)
    {
        $page = Page::where('slug', $slug)->firstOrFail();
        return response()->json($page);
    }

    // Mettre à jour le contenu d'une page (Admin seulement)
    public function update(Request $request, $slug)
    {
        $tenant = app('currentTenant');

        $page = \App\Models\Page::where('slug', $slug)
                            ->where('tenant_id', $tenant->id)
                            ->firstOrFail();

        // Validation simple du contenu JSON
        $request->validate([
            'content' => 'required|array',
            'title' => 'string'
        ]);

        $page->update([
            'content' => $request->content,
            'title' => $request->title ?? $page->title
        ]);

        return response()->json([
            'message' => 'Page mise à jour avec succès',
            'page' => $page
        ]);
    }
}
