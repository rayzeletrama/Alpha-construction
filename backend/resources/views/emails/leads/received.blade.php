@component('mail::message')
# Nouvelle demande de contact

Vous avez reçu un nouveau message depuis votre site **{{ config('app.name') }}**.

**Détails du prospect :**
- **Nom :** {{ $lead->name }}
- **Email :** {{ $lead->email }}
- **Sujet :** {{ $lead->subject }}

**Message :**
{{ $lead->message }}

@component('mail::button', ['url' => config('app.url') . '/admin'])
Accéder au Dashboard
@endcomponent

Merci,<br>
L'équipe {{ config('app.name') }}
@endcomponent
