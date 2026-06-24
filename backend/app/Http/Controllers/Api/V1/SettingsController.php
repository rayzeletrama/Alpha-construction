<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $tenant = app('currentTenant');
        return response()->json([
            'name' => $tenant->name,
            'settings' => $tenant->settings ?? []
        ]);
    }

    public function update(Request $request)
    {
        $tenant = app('currentTenant');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'settings' => 'required|array',
            'settings.logo_url' => 'nullable|string',
            'settings.favicon_url' => 'nullable|string',
            'settings.browser_title' => 'nullable|string',
            'settings.primary_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'], // Correction ici
            'settings.socials' => 'nullable|array',
            'settings.contact' => 'nullable|array',
            'settings.why_us' => 'nullable|array',
            'settings.partners' => 'nullable|array',
        ]);

        $tenant->update([
            'name' => $validated['name'],
            'settings' => $validated['settings']
        ]);

        return response()->json(['message' => 'Paramètres sauvegardés']);
    }
}
