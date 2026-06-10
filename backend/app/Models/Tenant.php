<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    // Ajoute cette ligne pour autoriser l'écriture de ces colonnes
    protected $fillable = ['name', 'slug', 'domain', 'settings','plan'];
    protected $casts = [
        'settings' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
