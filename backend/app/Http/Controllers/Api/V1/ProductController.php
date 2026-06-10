<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Liste les produits de la boutique actuelle
    public function index(Request $request)
    {
        $products = Product::when($request->category, function ($query, $category) {
            return $query->where('category', $category);
        })->get();

        return response()->json($products);
    }

    // Créer un produit (Admin seulement via les routes protégées)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category' => 'required|string', // ex: masonry, renovation, earthwork
            'stock' => 'integer'
        ]);

        $validated['slug'] = \Str::slug($validated['name']);

        // tenant_id est ajouté automatiquement via le Trait BelongsToTenant
        $product = Product::create($validated);

        return response()->json($product, 201);
    }
}
