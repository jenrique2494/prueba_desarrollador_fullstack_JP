<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cliente extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'documento',
        'nombres',
        'email',
        'celular',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'clientes';

    /**
     * Get the wallet associated with the client.
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class, 'cliente_id');
    }

    /**
     * Get the payment sessions for the client.
     */
    public function paymentSessions(): HasMany
    {
        return $this->hasMany(PaymentSession::class, 'cliente_id');
    }
}
