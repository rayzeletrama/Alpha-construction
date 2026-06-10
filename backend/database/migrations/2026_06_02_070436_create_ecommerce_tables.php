<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ecommerce_tables', function (Blueprint $table) {
        $table->id();
        $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
        $table->string('name');
        $table->string('slug');
        $table->text('description')->nullable();
        $table->decimal('price', 12, 2);
        $table->integer('stock')->default(0);
        $table->string('category')->nullable(); // Maçonnerie, Rénovation, etc.
        $table->json('metadata')->nullable(); // Pour des champs flexibles
        $table->timestamps();

        $table->unique(['tenant_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ecommerce_tables');
    }
};
