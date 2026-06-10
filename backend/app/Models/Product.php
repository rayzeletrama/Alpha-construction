<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Product extends Model {
    use BelongsToTenant; // L'isolation est activée ici !
    protected $fillable = ['name', 'slug', 'description', 'price', 'stock', 'category'];
}
