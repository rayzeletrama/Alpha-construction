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

        \Log::info("Tentative d'envoi d'email...");
        \Log::info("Destinataire identifié : " . $recipient);
        \Log::info("Mailer utilisé : " . config('mail.default'));

            // On envoie au destinataire choisi dans l'admin
            // On ajoute un replyTo pour que l'artisan puisse répondre directement au prospect
        try {
            Mail::to($recipient)->send(new NewLeadReceived($lead));
        } catch (\Exception $e) {
    // Si ça échoue encore, on veut savoir pourquoi dans les logs de Render
            \Log::error("Erreur Resend : " . $e->getMessage());
        }
                \Log::info("Email envoyé à : " . $recipient);
        }

        return response()->json(['message' => 'Message envoyé avec succès !'], 200);
    }

    public function index() {
        // Retourne les leads du tenant actuel, triés du plus récent au plus ancien
        return response()->json(
            \App\Models\Lead::orderBy('created_at', 'desc')->get()
        );
    }

    public function destroy($id) {
        $lead = \App\Models\Lead::findOrFail($id);
        $lead->delete();
        return response()->json(['message' => 'Message supprimé']);
    }

    public function markAsRead($id) {
        $lead = \App\Models\Lead::findOrFail($id);
        $lead->update(['status' => 'read']);
        return response()->json($lead);
    }
}
