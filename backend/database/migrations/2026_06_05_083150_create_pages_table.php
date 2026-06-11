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
    Schema::create('pages', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->string('slug'); // <--- CETTE LIGNE EST INDISPENSABLE
        $table->json('content');
        $table->timestamps();

        // Index unique pour éviter deux pages "home" pour la même boutique
        $table->unique(['tenant_id', 'slug']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pages');
    }
};
