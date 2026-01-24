# 📚 SGIE Frontend - Documentación de Arquitectura (CELINE)

## 🏗️ Estructura del Proyecto

```
frontend-deber/
├── src/
│   ├── config/
│   │   └── api.js                    # Configuración de Axios con interceptores JWT
│   ├── components/
│   │   └── layout/
│   │       ├── Layout.jsx            # Componente contenedor principal
│   │       ├── Navbar.jsx            # Barra de navegación
│   │       └── Footer.jsx            # Pie de página
│   ├── pages/
│   │   ├── Home.jsx                  # Página de inicio
│   │   ├── Login.jsx                 # Página de login (placeholder)
│   │   ├── Users/
│   │   │   └── UserList.jsx          # Módulo de usuarios (Estefany)
│   │   ├── Subjects/
│   │   │   └── SubjectList.jsx       # Módulo de asignaturas (Kevin)
│   │   ├── Enrollments/
│   │   │   └── EnrollmentList.jsx    # Módulo de inscripciones (Julian)
│   │   ├── Grades/
│   │   │   └── GradeList.jsx         # Módulo de calificaciones (Julian)
│   │   └── Payments/
│   │       └── PaymentList.jsx       # Módulo de pagos (Xavier)
│   ├── App.jsx                       # Configuración de rutas principales
│   ├── main.jsx                      # Punto de entrada con BrowserRouter
│   └── index.css                     # Estilos globales + Bootstrap
├── package.json
└── README.md
```

## 🚀 Tecnologías Utilizadas

- **React 19.2.0** - Framework frontend
- **Vite 7.2.4** - Build tool y dev server
- **React Router DOM 7.13.0** - Sistema de rutas
- **Axios 1.13.2** - Cliente HTTP para API REST
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **SweetAlert2** - Alertas y notificaciones elegantes

## 📋 Configuración Implementada

### 1. **Configuración de Axios** (`src/config/api.js`)

#### Características:
- ✅ BaseURL configurada: `http://localhost:8000/api/v1`
- ✅ Interceptor de Request: Agrega automáticamente el token JWT desde localStorage
- ✅ Interceptor de Response: Manejo global de errores con SweetAlert2
- ✅ Detección automática de sesión expirada (Error 401)
- ✅ Manejo de errores 403, 404, 500

#### Uso:
```javascript
import api from './config/api';

// Ejemplo de petición GET
const response = await api.get('/usuarios');

// Ejemplo de petición POST
const response = await api.post('/usuarios', { nombre: 'Juan', email: 'juan@mail.com' });
```

### 2. **Sistema de Rutas**

#### Rutas Configuradas:
| Ruta | Componente | Responsable | Estado |
|------|------------|-------------|--------|
| `/` | Home | CELINE | ✅ Implementado |
| `/login` | Login | ESTEFANY | 🟡 Placeholder |
| `/usuarios` | UserList | ESTEFANY | 🟡 Placeholder |
| `/asignaturas` | SubjectList | KEVIN | 🟡 Placeholder |
| `/inscripciones` | EnrollmentList | JULIAN | 🟡 Placeholder |
| `/calificaciones` | GradeList | JULIAN | 🟡 Placeholder |
| `/pagos` | PaymentList | XAVIER | 🟡 Placeholder |

### 3. **Layout Principal**

El componente `Layout` envuelve todas las páginas y proporciona:
- **Navbar**: Menú de navegación con enlaces a todos los módulos
- **Main**: Área de contenido principal (usa `<Outlet />` de React Router)
- **Footer**: Pie de página con información del sistema

### 4. **Navbar Interactivo**

Características:
- ✅ Muestra/oculta menús según autenticación
- ✅ Botón de logout con confirmación (SweetAlert2)
- ✅ Muestra nombre del usuario logueado
- ✅ Responsive y compatible con dispositivos móviles
- ✅ Iconos de Bootstrap Icons

### 5. **Página de Inicio (Home)**

Características:
- ✅ Vista diferente para usuarios autenticados y no autenticados
- ✅ Dashboard con tarjetas para cada módulo del sistema
- ✅ Efectos hover en las tarjetas
- ✅ Links directos a cada sección

## 🎨 Estilos

### Bootstrap + Estilos Personalizados

- **Paleta de colores**: Usa la paleta de Bootstrap (primary, success, info, warning, danger)
- **Efectos hover**: Tarjetas con elevación (shadow) al pasar el mouse
- **Responsive**: Navbar colapsable en dispositivos móviles
- **Iconos**: Bootstrap Icons integrados vía CDN

## 🔐 Manejo de Autenticación

### LocalStorage

El sistema utiliza `localStorage` para almacenar:
- `token`: Token JWT recibido del backend
- `user`: Información del usuario logueado (objeto JSON)

### Flujo de Autenticación (para ESTEFANY)

1. Usuario ingresa credenciales en `/login`
2. Se hace POST a `/api/v1/auth/login`
3. Backend responde con `{ access_token: "...", user: {...} }`
4. Se guarda en localStorage:
   ```javascript
   localStorage.setItem('token', response.data.access_token);
   localStorage.setItem('user', JSON.stringify(response.data.user));
   ```
5. El interceptor de Axios agrega automáticamente el token a todas las peticiones
6. Si el token expira (401), se limpia localStorage y redirige a `/login`

## 📦 Instalación y Ejecución

### Instalar Dependencias
```bash
npm install
```

### Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Build para Producción
```bash
npm run build
```

## 🧑‍💻 Guía para los Colaboradores

### Para ESTEFANY (Seguridad & Usuarios)

**Archivos a modificar/crear:**
- `src/pages/Login.jsx` - Implementar formulario de login
- `src/pages/Users/UserList.jsx` - Lista de usuarios
- `src/pages/Users/UserForm.jsx` - Formulario crear/editar usuario
- `src/components/ProtectedRoute.jsx` - Componente de protección de rutas

**Endpoints a consumir:**
```javascript
import api from '../config/api';

// Login
await api.post('/auth/login', { email, password });

// CRUD Usuarios
await api.get('/usuarios');
await api.get('/usuarios/{id}');
await api.post('/usuarios', userData);
await api.put('/usuarios/{id}', userData);
await api.delete('/usuarios/{id}');
```

### Para KEVIN (Asignaturas)

**Archivos a modificar/crear:**
- `src/pages/Subjects/SubjectList.jsx` - Lista de asignaturas
- `src/pages/Subjects/SubjectForm.jsx` - Formulario crear/editar asignatura

**Endpoints a consumir:**
```javascript
import api from '../config/api';

await api.get('/asignaturas');
await api.post('/asignaturas', subjectData);
await api.put('/asignaturas/{id}', subjectData);
await api.delete('/asignaturas/{id}');
```

### Para JULIAN (Inscripciones y Calificaciones)

**Archivos a modificar/crear:**
- `src/pages/Enrollments/EnrollmentList.jsx` - Gestión de inscripciones
- `src/pages/Grades/GradeList.jsx` - Gestión de calificaciones

**Endpoints a consumir:**
```javascript
import api from '../config/api';

// Inscripciones
await api.get('/matriculas');
await api.post('/matriculas', enrollmentData);

// Calificaciones
await api.get('/calificaciones');
await api.post('/calificaciones', gradeData);
await api.put('/calificaciones/{id}', gradeData);
```

### Para XAVIER (Pagos y Reportes)

**Archivos a modificar/crear:**
- `src/pages/Payments/PaymentList.jsx` - Gestión de pagos
- `src/pages/Payments/PaymentForm.jsx` - Formulario de pagos

**Endpoints a consumir:**
```javascript
import api from '../config/api';

// Pagos
await api.get('/finanzas');
await api.post('/finanzas', paymentData);

// Reportes (descarga PDF)
const response = await api.get('/reportes/estudiante/{id}', {
  responseType: 'blob'
});
const url = window.URL.createObjectURL(new Blob([response.data]));
const link = document.createElement('a');
link.href = url;
link.setAttribute('download', 'reporte.pdf');
document.body.appendChild(link);
link.click();
```

## ✅ Checklist de Tareas Completadas (CELINE)

- ✅ Instalación de dependencias (axios, react-router-dom, sweetalert2, bootstrap)
- ✅ Configuración de Axios con interceptores JWT
- ✅ Creación de estructura de carpetas
- ✅ Componente Layout (Navbar + Footer)
- ✅ Sistema de rutas configurado
- ✅ Página de inicio (Home)
- ✅ Placeholders para módulos de los demás miembros
- ✅ Estilos globales con Bootstrap
- ✅ Documentación completa

## 📞 Soporte

Para cualquier duda sobre la arquitectura o configuración, contactar a **CELINE** (DevOps & Lead Frontend).

---

**Versión del Proyecto:** 0.0.0  
**Última Actualización:** Enero 2026
