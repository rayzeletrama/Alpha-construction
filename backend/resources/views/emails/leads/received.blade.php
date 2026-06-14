@component('mail::message')
# Nouvelle demande de contact

Vous avez reçu un nouveau message depuis votre site **{{ app('currentTenant')->name }}**.

**Détails du prospect :**
- **Nom :** {{ $lead->name }}
- **Email :** {{ $lead->email }}
- **Sujet :** {{ $lead->subject }}

**Message :**
{{ $lead->message }}

@php
    // On génère l'URL vers ton admin Render
    $adminUrl = config('app.url') . '/admin';
@endphp

@component('mail::button', ['url' => $adminUrl])
Accéder au Dashboard
@endcomponent

Merci,<br>
L'équipe {{ app('currentTenant')->name }}
@endcomponent
