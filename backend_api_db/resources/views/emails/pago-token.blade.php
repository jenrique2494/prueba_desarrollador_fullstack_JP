<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
        }
        .content {
            line-height: 1.6;
            color: #333;
        }
        .token-box {
            background-color: #f0f8ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .token-value {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            text-align: center;
            letter-spacing: 2px;
        }
        .info {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #856404;
        }
        .footer {
            text-align: center;
            border-top: 2px solid #e0e0e0;
            padding-top: 20px;
            margin-top: 20px;
            color: #888;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Token de Confirmación de Pago</h1>
        </div>

        <div class="content">
            <p>Hola <strong>{{ $cliente->nombres }}</strong>,</p>

            <p>Has iniciado una operación de pago en tu billetera virtual. Para completar la transacción, usa el siguiente token de confirmación:</p>

            <div class="token-box">
                <div style="color: #666; font-size: 14px; margin-bottom: 10px;">Tu Token:</div>
                <div class="token-value">{{ $token }}</div>
            </div>

            <div class="info">
                <strong>⚠️ Información importante:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li><strong>Monto:</strong> ${{ number_format($monto, 2) }}</li>
                    <li><strong>Session ID:</strong> {{ $sessionId }}</li>
                    <li><strong>Válido por:</strong> 10 minutos</li>
                    <li><strong>Expira:</strong> {{ $expiresAt->format('H:i:s') }}</li>
                </ul>
            </div>

            <p>Este token es único y personal. <strong>No lo compartas con nadie</strong>. Si no solicitaste esta operación, ignora este correo.</p>

            <p>Una vez tengas el token, dirígete a tu aplicación y úsalo para confirmar el pago.</p>
        </div>

        <div class="footer">
            <p>© 2025 Billetera Virtual - Todos los derechos reservados</p>
            <p>Este es un correo automático, por favor no responder.</p>
        </div>
    </div>
</body>
</html>
