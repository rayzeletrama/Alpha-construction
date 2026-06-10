<?php

namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use BelongsToTenant;

    protected $fillable = ['tenant_id', 'slug', 'title', 'content'];

    protected $casts = [
        'content' => 'array',
    ];
}
