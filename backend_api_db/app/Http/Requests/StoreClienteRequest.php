<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClienteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'documento' => 'required|string|unique:clientes,documento',
            'nombres' => 'required|string',
            'email' => 'required|email|unique:clientes,email',
            'celular' => 'required|string',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es requerido',
            'documento.unique' => 'El documento ya está registrado',
            'nombres.required' => 'Los nombres son requeridos',
            'email.required' => 'El email es requerido',
            'email.email' => 'El email debe ser válido',
            'email.unique' => 'El email ya está registrado',
            'celular.required' => 'El celular es requerido',
        ];
    }
}
