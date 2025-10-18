<?php

namespace App\Mail;

use App\Models\Cliente;
use App\Models\PaymentSession;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PagoTokenMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Cliente $cliente,
        public PaymentSession $sesionPago,
    ) {
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Token de Confirmación de Pago - ePayco Billetera Virtual',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.pago-token',
            with: [
                'cliente' => $this->cliente,
                'token' => $this->sesionPago->token,
                'monto' => $this->sesionPago->monto,
                'sessionId' => $this->sesionPago->session_id,
                'expiresAt' => $this->sesionPago->expires_at,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
