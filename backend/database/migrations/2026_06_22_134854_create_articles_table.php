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
            Schema::create('articles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
                $table->string('category');      // ex: Maçonnerie
                $table->string('title');
                $table->string('slug')->unique(); // ex: maconnerie-gros-oeuvre
                $table->string('subtitle')->nullable();
                $table->string('main_image')->nullable();
                $table->text('full_description')->nullable();
                $table->json('sections')->nullable(); // Les paragraphes détaillés
                $table->json('faqs')->nullable();     // Questions / Réponses
                $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
