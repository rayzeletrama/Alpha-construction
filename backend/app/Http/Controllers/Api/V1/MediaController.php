<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
// Import du SDK officiel
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class MediaController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,ico|max:5120',
        ]);

        $tenant = app('currentTenant');
        $file = $request->file('file');

        if (app()->environment('local')) {
            return $this->uploadLocal($file, $tenant);
        }

        return $this->uploadCloudinary($file, $tenant);
    }

    private function uploadLocal($file, $tenant)
    {
        $path = $file->store("tenants/tenant_{$tenant->id}/media", 'public');
        return response()->json([
            'url' => asset(Storage::url($path)),
            'provider' => 'local'
        ]);
    }

    private function uploadCloudinary($file, $tenant)
    {
        try {
            // Configuration manuelle du SDK (plus de dépendance au package Laravel)
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                    'api_key'    => env('CLOUDINARY_API_KEY'),
                    'api_secret' => env('CLOUDINARY_API_SECRET'),
                ],
                'url' => ['secure' => true]
            ]);

            $upload = new UploadApi();
            $result = $upload->upload($file->getRealPath(), [
                'folder' => "alpha_saas/tenant_{$tenant->id}",
                'quality' => 'auto',
                'fetch_format' => 'auto'
            ]);

            return response()->json([
                'url' => $result['secure_url'],
                'provider' => 'cloudinary'
            ]);
        } catch (\Exception $e) {
            \Log::error("Cloudinary Error: " . $e->getMessage());
            // En cas d'erreur cloud, on sauve en local pour ne pas bloquer l'utilisateur
            return $this->uploadLocal($file, $tenant);
        }
    }
}
