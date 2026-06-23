<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Article; // Import manquant ajouté
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index() {
        // Retourne les articles du client actuel (via trait)
        return response()->json(Article::all());
    }

    public function show($slug) {
        $article = Article::where('slug', $slug)->firstOrFail();
        return response()->json($article);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string',
            'category' => 'required|string',
            'full_description' => 'required|string',
            'main_image' => 'nullable|string',
            'sections' => 'nullable|array',
            'faqs' => 'nullable|array'
        ]);

        $data['slug'] = Str::slug($data['title']);
        return Article::create($data);
    }

    public function update(Request $request, $id) {
        $article = Article::findOrFail($id);
        $article->update($request->all());
        return response()->json($article);
    }

    public function destroy($id) {
        Article::destroy($id);
        return response()->json(['message' => 'Supprimé']);
    }
}
