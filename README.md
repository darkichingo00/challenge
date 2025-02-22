# Challenge Técnico - Fullstack

Bienvenido al Challenge Técnico - Fullstack. Este proyecto consiste en desarrollar una aplicación de lista de tareas utilizando Angular en el frontend y un backend en Node.js con TypeScript, utilizando Firebase Firestore para la persistencia de datos.

## Tecnologías Utilizadas

### Frontend:
- **Angular 17** (con standalone components y Angular Material)
- **TypeScript**
- **SCSS** para el manejo de estilos
- **Angular Routing** para la navegación
- **Firebase Authentication** para la autenticación de usuarios

### Backend:
- **Node.js con TypeScript**
- **Express**
- **Firebase Firestore** como base de datos
- **Cloud Functions** para la implementación del API REST
- **JWT (JSON Web Token)** para autenticación segura

## Funcionalidades

### Frontend:
1. **Inicio de sesión:** El usuario ingresa su correo y si existe, se redirige a la página principal; si no existe, se le da la opción de crear una cuenta.
2. **Lista de tareas:** Se pueden agregar, editar, eliminar y marcar tareas como completadas.
3. **Interfaz responsive:** Adaptada para diferentes dispositivos.
4. **Validaciones:** Se implementan validaciones en formularios y campos obligatorios.

### Backend:
1. **Autenticación de usuarios con Firebase Authentication**.
2. **Endpoints para la gestión de tareas:**
   - `GET /tasks`: Obtener la lista de todas las tareas.
   - `POST /tasks`: Agregar una nueva tarea.
   - `PUT /tasks/{taskId}`: Actualizar los datos de una tarea existente.
   - `DELETE /tasks/{taskId}`: Eliminar una tarea existente.
   - `GET /users/{email}`: Buscar el usuario por email.
   - `POST /users`: Crear un nuevo usuario.

## Estructura del Proyecto

### Frontend:
```
/src
  /app
    /components
    /services
    /pages
    /models
  /assets
  /environments
```

### Backend:
```
/src
  /controllers
  /routes
  /services
  /models
  /middlewares
```

## Instalación y Ejecución

### Frontend:
```sh
cd frontend
npm install
ng serve
```

### Backend:
```sh
cd backend
npm install
npm run dev
```

## Despliegue
El frontend se ha desplegado en **Firebase Hosting** y el backend en **Cloud Functions** de Firebase.

## Contribución
Si deseas contribuir a este proyecto, realiza un fork del repositorio, crea una rama con tus cambios y envía un pull request.

## Contacto
Para consultas o sugerencias, puedes contactarme en GitHub o a través de mis redes sociales.

---
**Desarrollado por Guillermo Hernández**

