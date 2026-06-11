<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public $withinTransaction = false;
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug'); // <--- C'est cette ligne qui manquait
            $table->string('domain')->nullable();
            $table->string('plan')->default('free');
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    // 2. Ajout de l'index unique séparément
    Schema::table('tenants', function (Blueprint $table) {
        $table->unique('slug');
        $table->unique('domain');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
