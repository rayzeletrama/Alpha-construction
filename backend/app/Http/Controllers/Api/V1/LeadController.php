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

        // On récupère l'email dans le JSON 'content'
        $recipient = $page->content['form_recipient'] ?? null;

        // 3. Envoi de l'email si un destinataire est configuré
        if ($recipient && filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
            try {
                Mail::to($recipient)->send(new NewLeadReceived($lead));
            } catch (\Exception $e) {
                // On log l'erreur mais on ne bloque pas la réponse pour l'utilisateur
                \Log::error("Erreur envoi mail : " . $e->getMessage());
            }
        }

        return response()->json(['message' => 'Message envoyé avec succès !'], 201);
    }
}
