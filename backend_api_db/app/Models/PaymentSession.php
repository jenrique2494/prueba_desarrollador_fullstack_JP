<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentSession extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'cliente_id',
        'session_id',
        'documento',
        'monto',
        'token',
        'estado',
        'expires_at',
        'confirmed_at',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'payment_sessions';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'confirmed_at' => 'datetime',
    ];

    /**
     * Get the client associated with the payment session.
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }
}
