<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConsultarSaldoRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'documento' => 'required|string|min:1',
            'celular' => 'required|string|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es requerido',
            'documento.string' => 'El documento debe ser texto',
            'celular.required' => 'El celular es requerido',
            'celular.string' => 'El celular debe ser texto',
        ];
    }
}
