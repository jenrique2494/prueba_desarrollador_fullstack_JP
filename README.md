# ePayco - Sistema de Billetera Virtual

<div align="center">
  <h2>🏦 ePayco Billetera Virtual</h2>
  <p>Sistema completo de billetera digital con confirmación de pagos mediante tokens</p>
  
  [![Laravel](https://img.shields.io/badge/Laravel-11-red?style=flat-square&logo=laravel)](https://laravel.com)
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org)
  [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker)](https://www.docker.com)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)](https://www.mysql.com)
  [![Material-UI](https://img.shields.io/badge/Material--UI-v5-0081CB?style=flat-square&logo=mui)](https://mui.com)
</div>

---

## 📋 Descripción del Proyecto

**ePayco** es una solución de billetera virtual que implementa un sistema de gestión de pagos seguro y confiable. El proyecto está estructurado en dos servicios REST independientes que se comunican entre sí, proporcionando una arquitectura escalable y mantenible.

### 🔗 Repositorio

**GitHub**: [https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP](https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP)

Clone el repositorio con:

```bash
git clone https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP.git
```

### Características Principales

✅ **Registro de Clientes** - Creación de usuarios con validación completa  
✅ **Recarga de Billetera** - Carga de dinero con verificación de datos  
✅ **Pagos Seguros** - Sistema de confirmación con token de 6 dígitos  
✅ **Consulta de Saldo** - Verificación del balance disponible con WalletCard  
✅ **UI Moderna Material-UI** - Interfaz con tema azul degradado y responsive  
✅ **Emails Automáticos** - Notificaciones de confirmación (en desarrollo: logs)  
✅ **Arquitectura de Microservicios** - Dos backends independientes con API clara

---

## 🚀 Inicio Rápido

### Prerequisitos

- Docker & Docker Compose
- Git

### Instalación y Ejecución

```bash
# 1. Clonar repositorio
git clone https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP.git
cd prueba_desarrollador_fullstack_JP

# 2. Iniciar servicios con Docker
docker-compose up -d

# 3. Esperar 10-15 segundos para que los servicios inicien completamente

# 4. Verificar que todo está funcionando
# Frontend: http://localhost:3000
# Backend Cliente: http://localhost:8001/api/clientes/registro
# Backend DB: http://localhost:8000/api/clientes/registro
```

**Nota importante**: Las migraciones se ejecutan automáticamente. Si necesitas resetear:

```bash
docker-compose exec backend_api_db php artisan migrate:fresh --seed
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│              ePayco Frontend (React 19 + MUI)               │
│                   http://localhost:3000                      │
└────────────────┬────────────────────────────────────────────┘
                 │ (Axios)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│         Backend API Cliente (Puente/Consumer)               │
│              http://localhost:8001                           │
│    - Consume API de Backend DB                              │
│    - Expone endpoints al Frontend                           │
└────────────────┬────────────────────────────────────────────┘
                 │ (HTTP Client)
                 ▼
┌─────────────────────────────────────────────────────────────┐
│     Backend API DB (Acceso Directo a BD - Eloquent)        │
│              http://localhost:8000                           │
│    - ORM Eloquent (Laravel 11)                              │
│    - Acceso directo a MySQL                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              Base de Datos MySQL 8.0                        │
│                 localhost:3306                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Funcionalidades Implementadas

### 1. **Registro de Cliente**

- **Endpoint**: `POST /api/clientes/registro`
- **Parámetros**: documento, nombres, email, celular
- **Validación**: Todos los campos requeridos
- **Respuesta**: Cliente creado con ID único

### 2. **Recarga de Billetera**

- **Endpoint**: `POST /api/billetera/recargar`
- **Parámetros**: documento, celular, valor
- **Validación**: Documento y celular deben coincidir con cliente registrado
- **Respuesta**: Nuevo balance actualizado

### 3. **Pago con Token de Confirmación**

**Iniciar Pago**: `POST /api/pagos/iniciar`
- Genera token de 6 dígitos
- Crea sesión con expiración (10 minutos)
- En desarrollo: token disponible en logs
- Retorna: session_id, token_debug, estado

**Confirmar Pago**: `POST /api/pagos/confirmar`
- Valida session_id y token
- Descuenta monto de la billetera
- Marca pago como confirmado

### 4. **Consultar Saldo**

- **Endpoint**: `GET /api/billetera/saldo?documento=X&celular=Y`
- **Parámetros** (Query): documento, celular
- **Validación**: Ambos parámetros deben coincidir
- **Respuesta**: Datos del cliente y saldo disponible

---

## 📁 Estructura del Proyecto

```
prueba_desarrollador_fullstack_JP/
├── backend_api_db/              
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/              
│   │   ├── Requests/            
│   │   └── Mail/                
│   ├── database/migrations/
│   ├── routes/api.php
│   └── Dockerfile
│
├── backend_api_cliente/         
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Services/            
│   │   └── Requests/
│   ├── routes/api.php
│   └── Dockerfile
│
├── frontend/                    
│   ├── src/
│   │   ├── components/          
│   │   │   ├── RegistroForm.tsx
│   │   │   ├── RecargarForm.tsx
│   │   │   ├── PagarForm.tsx
│   │   │   ├── ConfirmarPagoForm.tsx
│   │   │   ├── ConsultarSaldoForm.tsx
│   │   │   └── WalletCard.tsx
│   │   ├── api/client.ts
│   │   ├── hooks/useRegistro.ts
│   │   ├── theme/index.ts
│   │   └── App.tsx
│   ├── Dockerfile.dev
│   └── package.json
│
├── postman/
│   ├── billetera_virtual.json
│   └── README.md
│
├── docker-compose.yml
└── README.md
```

---

## 🎯 Flujo de Trabajo Completo

### 1. Registro de Cliente

1. Ir a tab **📝 Registro**
2. Ingresar: documento, nombres, email, celular
3. Presionar "Registrar"
4. Confirmación ✅

### 2. Recargar Billetera

1. Ir a tab **💰 Recargar**
2. Ingresar: documento, celular, monto
3. Presionar "Recargar"
4. Balance se actualiza

### 3. Realizar Pago (Flujo Completo)

1. Ir a tab **💳 Pagar**
2. Ingresar: documento, celular, monto
3. Presionar "Iniciar Pago"
4. **Automáticamente** cambia a tab **✅ Confirmar Pago**
5. Se muestra session_id y monto
6. Obtener token de:
   - Email (producción)
   - Logs: `docker-compose logs backend_api_db | grep -i token`
   - Endpoint: `GET http://localhost:8001/api/pagos/token/{sessionId}`
7. Ingresar token de 6 dígitos
8. Presionar "Confirmar Pago"
9. Pago completado y balance deducido ✅

### 4. Consultar Saldo

1. Ir a tab **🔍 Consultar Saldo**
2. Ingresar: documento, celular
3. Presionar "Consultar Saldo"
4. Se muestra **WalletCard** con:
   - Saldo disponible
   - Datos del cliente
   - Balance total

---

## 🔌 Endpoints API

### Backend API Cliente (Puerto 8001)

```
POST   /api/clientes/registro
POST   /api/billetera/recargar
GET    /api/billetera/saldo?documento=X&celular=Y
POST   /api/pagos/iniciar
POST   /api/pagos/confirmar
GET    /api/pagos/token/{sessionId}    (Solo en desarrollo)
```

---

## 📝 Respuestas Estándar

### Éxito (200/201)

```json
{
    "success": true,
    "code": 200,
    "message": "Operación exitosa",
    "data": {
        "id": 1,
        "documento": "1234567890",
        "nombres": "Juan Perez",
        "email": "juan@example.com",
        "celular": "3001234567"
    }
}
```

### Error (4xx/5xx)

```json
{
    "success": false,
    "code": 422,
    "message": "Error de validación",
    "errors": {
        "documento": ["El documento es requerido"],
        "celular": ["El celular es requerido"]
    }
}
```

---

## 🔍 Debugging y Desarrollo

### Ver Token de Pago en Desarrollo

**Opción 1: Ver logs del backend**

```bash
docker-compose logs -f backend_api_db | grep -i token
```

**Opción 2: Usar endpoint de desarrollo**

```bash
curl http://localhost:8001/api/pagos/token/{session_id}
```

**Opción 3: Postman**

La respuesta de `POST /api/pagos/iniciar` incluye `token_debug`

### Comandos Docker Útiles

```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend_api_db
docker-compose logs -f frontend

# Ejecutar PHP artisan
docker-compose exec backend_api_db php artisan migrate:fresh --seed

# Ver estado de servicios
docker-compose ps

# Detener servicios
docker-compose down
```

---

## 🔧 Cambios Recientes y Correcciones

### Frontend React

- ✅ React 19 + TypeScript
- ✅ Material-UI v5+ con tema personalizado (azul degradado)
- ✅ Componentes de formularios con validación
- ✅ WalletCard para visualizar saldo
- ✅ Persistencia de sesión de pago con localStorage
- ✅ Parsing correcto de respuestas API (response.data.data)
- ✅ Navegación por pestañas (Tabs)

### Backend

- ✅ Respuestas estandarizadas ApiResponse
- ✅ Validación con Form Requests
- ✅ Session ID con expiración
- ✅ Token de 6 dígitos
- ✅ Relaciones Eloquent ORM

### Docker

- ✅ Frontend con Vite en desarrollo
- ✅ Migraciones automáticas
- ✅ MySQL con volúmenes persistentes
- ✅ Networking entre servicios

---

## 🛠️ Stack Tecnológico

### Backend

- **Framework**: Laravel 11
- **ORM**: Eloquent
- **Validación**: Form Requests
- **Base de Datos**: MySQL 8.0
- **HTTP Client**: Laravel HTTP Client

### Frontend

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **UI**: Material-UI v5+
- **HTTP**: Axios
- **Almacenamiento**: localStorage

### DevOps

- **Contenedorización**: Docker
- **Orquestación**: Docker Compose
- **Base de Datos**: MySQL 8.0

---

## 📊 Pruebas con Postman

Se incluye colección completa: `postman/billetera_virtual.json`

1. Importar en Postman
2. Ver ejemplos en `postman/README.md`
3. Ejecutar requests en orden

---

## 👨‍💻 Información del Proyecto

**Proyecto**: Prueba ePayco - Desarrollador Full Stack  
**Repositorio**: [https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP](https://github.com/jenrique2494/prueba_desarrollador_fullstack_JP)  
**Fecha**: Octubre 2025  
**Versión**: 1.0.0  
**Autor**: Jesús Enrique Velasco

---

## 📄 Licencia

© 2025 ePayco. Todos los derechos reservados. Proyecto educativo.
