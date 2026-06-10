<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use App\Traits\BelongsToTenant; // Si tu veux que les clients appartiennent à une boutique

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, BelongsToTenant;

    protected $fillable = [
        'name', 'email', 'password', 'tenant_id',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];
}
