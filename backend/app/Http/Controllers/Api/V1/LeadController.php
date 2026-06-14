<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\Page;
use App\Mail\NewLeadReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        // 1. Sauvegarde en base de données
        $lead = Lead::create($validated);

        // 2. Récupérer le destinataire configuré dans la page contact
        $page = Page::where('slug', 'contact')->first();

        if ($page && isset($page->content['form_recipient'])) {
            $recipient = $page->content['form_recipient'] ?? env('MAIL_USERNAME');

            try {
            // On envoie au destinataire choisi dans l'admin
            // On ajoute un replyTo pour que l'artisan puisse répondre directement au prospect
                Mail::to($recipient)->send(new NewLeadReceived($lead));
                \Log::info("Email envoyé à : " . $recipient);
            } catch (\Exception $e) {
                \Log::error("Erreur envoi mail smtp : " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Message envoyé avec succès !'], 200);
    }
}
