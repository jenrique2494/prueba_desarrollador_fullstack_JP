<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RecargaBilleteraRequest extends FormRequest
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
            'documento' => 'required|string|exists:clientes,documento',
            'celular' => 'required|string',
            'valor' => 'required|numeric|min:0.01',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'documento.required' => 'El documento es requerido',
            'documento.exists' => 'El documento no está registrado',
            'celular.required' => 'El celular es requerido',
            'valor.required' => 'El valor es requerido',
            'valor.numeric' => 'El valor debe ser un número',
            'valor.min' => 'El valor debe ser mayor a 0',
        ];
    }
}
