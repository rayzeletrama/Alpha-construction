<?php

namespace App\Mail;

use App\Models\Lead;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewLeadReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Lead $lead) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau message de contact : ' . $this->lead->name,

            replyTo: [
                new \Illuminate\Mail\Mailables\Address($this->lead->email, $this->lead->name),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.leads.received', // On va créer ce fichier
        );
    }
}
