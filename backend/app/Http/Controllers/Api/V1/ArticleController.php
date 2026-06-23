<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
       public function show($slug) {
        $article = Article::where('slug', $slug)->firstOrFail();
        return response()->json($article);
    }

    public function index() {
        return response()->json(Article::all());
    }

    public function store(Request $request) {
        $data = $request->all();
        $data['slug'] = \Str::slug($data['title']);
        return Article::create($data);
    }

    public function update(Request $request, $id) {
        $article = Article::findOrFail($id);
        $article->update($request->all());
        return $article;
    }
}
