# 🐳 Ejecución Completa con Docker Compose

## ⚡ Inicio Rápido

### Windows
```bash
# En PowerShell
.\docker-rebuild.bat
```

### macOS / Linux
```bash
# En Terminal
chmod +x docker-rebuild.sh
./docker-rebuild.sh
```

## 📋 Servicios Disponibles

Cuando ejecutes `docker-compose up`, se iniciarán:

1. **MySQL** (Puerto 3306)
   - Usuario: `app_user`
   - Contraseña: `app_password`
   - Base de datos: `app_db`

2. **Backend API DB** (Puerto 8000)
   - URL: `http://localhost:8000/api`
   - Acceso directo a base de datos
   - Laravel Artisan serve

3. **Backend API Cliente** (Puerto 8001)
   - URL: `http://localhost:8001/api`
   - Puente entre frontend y base de datos
   - Laravel Artisan serve

4. **Frontend React** (Puerto 3000)
   - URL: `http://localhost:3000`
   - Hot reload habilitado
   - Material-UI

## 🔄 Comandos Docker Útiles

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f react

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reconstruir sin caché
docker-compose build --no-cache

# Ejecutar comando en contenedor
docker-compose exec react npm list

# Limpiar todo
docker system prune -a
```

## 🔧 Troubleshooting

### Error: Port already in use
```bash
# Windows - Encontrar qué usa el puerto
netstat -ano | findstr :3000

# macOS/Linux - Encontrar qué usa el puerto
lsof -i :3000

# Matar el proceso o cambiar puertos en docker-compose.yml
```

### Error: node_modules not found
```bash
# Limpiar y reconstruir
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Error: Cannot connect to backend
- Verifica que los 3 backends estén corriendo: `docker-compose ps`
- Comprueba los logs: `docker-compose logs -f backend_api_cliente`
- La URL debe ser `http://localhost:8001/api` (desde el host)

### Error: Permission denied (en Linux)
```bash
sudo usermod -aG docker $USER
newgrp docker
```

## 📊 Flujo Completo de Prueba

1. **Verificar que todo está corriendo:**
   ```bash
   docker-compose ps
   ```

2. **Abrir Frontend en navegador:**
   ```
   http://localhost:3000
   ```

3. **Probar endpoints del backend:**
   ```bash
   curl http://localhost:8001/api/clientes/registro \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{
       "documento":"123456",
       "nombres":"Juan Pérez",
       "email":"juan@example.com",
       "celular":"3001234567"
     }'
   ```

4. **Ver logs en tiempo real:**
   ```bash
   docker-compose logs -f
   ```

## 📁 Estructura del Proyecto

```
proyecto/
├── docker-compose.yml       # Orquestación de servicios
├── docker-rebuild.sh        # Script de rebuild (Linux/Mac)
├── docker-rebuild.bat       # Script de rebuild (Windows)
├── frontend/                # React + Material-UI
│   ├── Dockerfile           # Build producción
│   ├── Dockerfile.dev       # Build desarrollo
│   └── package.json
├── backend_api_db/          # Laravel - Acceso BD
│   ├── Dockerfile
│   └── app/
├── backend_api_cliente/     # Laravel - API Bridge
│   ├── Dockerfile
│   └── app/
└── README.md
```

## 🚀 Notas Importantes

- **Hot reload**: El frontend tiene hot reload habilitado. Los cambios se reflejan automáticamente
- **Volúmenes**: Los cambios en código se sincronizan automáticamente
- **Base de datos**: Se crea automáticamente en el primer inicio
- **CORS**: Está habilitado en los backends
- **Variables de entorno**: Se pasan automáticamente vía docker-compose.yml

## 📝 Variables de Entorno

Las variables se definen en `docker-compose.yml`:

```yaml
environment:
  - DB_HOST: mysql
  - DB_PORT: 3306
  - DB_DATABASE: app_db
  - DB_USERNAME: app_user
  - DB_PASSWORD: app_password
  - API_DB_URL: http://backend_api_db:8000/api
  - REACT_APP_API_URL: http://localhost:8001/api
```

## ✅ Checklist de Verificación

- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Archivo `.env` en frontend configurado
- [ ] Ejecutar script de rebuild
- [ ] Esperar a que las imágenes se construyan (~5-10 minutos)
- [ ] Verificar `docker-compose ps` muestra todos los servicios
- [ ] Abrir http://localhost:3000 en navegador
- [ ] Probar flujo completo de la aplicación

## 🔗 URLs Importantes

- **Frontend**: http://localhost:3000
- **Backend API Cliente**: http://localhost:8001/api
- **Backend API DB**: http://localhost:8000/api
- **MySQL**: localhost:3306 (usuario: `app_user`)
- **phpmyadmin** (opcional): http://localhost:8080

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs: `docker-compose logs -f`
2. Limpia y reconstruye: `./docker-rebuild.sh` o `.\docker-rebuild.bat`
3. Verifica puertos disponibles
4. Consulta la documentación de cada servicio en su carpeta

---

**¡Listo para ejecutar todo en Docker! 🎉**
