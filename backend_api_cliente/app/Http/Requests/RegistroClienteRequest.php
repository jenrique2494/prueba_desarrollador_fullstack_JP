<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistroClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'documento' => 'required|string',
            'nombres' => 'required|string',
            'email' => 'required|email',
            'celular' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es requerido',
            'nombres.required' => 'Los nombres son requeridos',
            'email.required' => 'El email es requerido',
            'email.email' => 'El email debe ser válido',
            'celular.required' => 'El celular es requerido',
        ];
    }
}
