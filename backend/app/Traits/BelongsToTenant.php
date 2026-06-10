<?php

namespace App\Traits;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            if (app()->bound('currentTenant') && app('currentTenant') != null) {
                $model->tenant_id = app('currentTenant')->id;
            }
        });

        static::addGlobalScope('tenant', function (Builder $builder) {
            if (app()->bound('currentTenant') && app('currentTenant') != null) {
                $builder->where('tenant_id', app('currentTenant')->id);
            }
        });
    }
}
