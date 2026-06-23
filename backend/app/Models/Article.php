<?php
namespace App\Models;

use App\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Model;

class Article extends Model {
    use BelongsToTenant;
    protected $fillable = ['tenant_id', 'category', 'title', 'slug', 'subtitle', 'main_image', 'full_description', 'sections', 'faqs'];
    protected $casts = [
        'sections' => 'array',
        'faqs' => 'array',
    ];
}
