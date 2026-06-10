<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
{
    // Reset cache des rôles
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    // Créer les rôles
    $admin = \Spatie\Permission\Models\Role::create(['name' => 'admin']);
    $manager = \Spatie\Permission\Models\Role::create(['name' => 'manager']);
    $customer = \Spatie\Permission\Models\Role::create(['name' => 'customer']);

    // Créer des permissions
    $p1 = \Spatie\Permission\Models\Permission::create(['name' => 'edit products']);
    $p2 = \Spatie\Permission\Models\Permission::create(['name' => 'view orders']);

    $admin->givePermissionTo([$p1, $p2]);
    $manager->givePermissionTo($p1);
}
}
