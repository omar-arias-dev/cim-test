# CIM-TEST

# Proyecto Fullstack con Docker, PHP, Node y Base de Datos

Este proyecto incluye un backend en PHP (Laravel) y un frontend en React, junto con una base de datos administrada mediante Docker. Se requiere un gestor de base de datos (pgAdmin o DBeaver) para la visualización y administración de los datos.

## Requisitos

Asegúrate de tener instalados los siguientes programas antes de comenzar:

- Docker
- PHP
- Node.js
- Composer
- pgAdmin o DBeaver (para gestionar la base de datos)

## Instrucciones de Configuración

1. Ve a la carpeta `backend`.
2. Ejecuta el siguiente comando para levantar los servicios de Docker:
   ```bash
   docker compose up
3. Verifica que la base de datos esté funcionando correctamente desde pgAdmin o DBeaver.
4. Ejecuta las migraciones de la base de datos con el siguiente comando:
```bash
php artisan migrate
```
4. Genera y cachea la configuración del proyecto:
```bash
php artisan config:cache
```
5. Para iniciar el servidor del backend, ejecuta:
```bash
php artisan serve
```
6. Dirígete a la carpeta /frontend y ejecuta el siguiente comando para instalar las dependencias:
```bash
npm i
```
7. Una vez instaladas las dependencias, inicia el servidor de desarrollo del frontend con el comando:
```bash
npm run dev
```