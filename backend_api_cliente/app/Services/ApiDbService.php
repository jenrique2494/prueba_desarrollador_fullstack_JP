<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class ApiDbService
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('API_DB_URL', 'http://localhost:8000/api');
    }

    /**
     * Registrar cliente en backend_api_db
     */
    public function registroCliente(array $data): Response
    {
        return Http::post("{$this->baseUrl}/clientes/registro", $data);
    }
}
