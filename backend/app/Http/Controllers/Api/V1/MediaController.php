<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,ico|max:2048',
        ]);

        $tenant = app('currentTenant');

        // On range l'image dans un dossier propre au tenant
        $path = $request->file('file')->store("tenants/{$tenant->id}/media", 'public');

        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }
}
