import axios from 'axios';
import Swal from 'sweetalert2';

// Configuración de la URL base del backend
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Crear instancia de Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request - Agregar token JWT a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Response - Manejar errores globalmente
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejo de errores globales
        if (error.response) {
            // El servidor respondió con un código de error
            const status = error.response.status;
            const message = error.response.data?.detail || error.response.data?.message || 'Error en la operación';

            switch (status) {
                case 401:
                    // No autorizado - Eliminar token y redirigir al login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    Swal.fire({
                        icon: 'error',
                        title: 'Sesión Expirada',
                        text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
                        confirmButtonColor: '#d33',
                    }).then(() => {
                        window.location.href = '/login';
                    });
                    break;

                case 403:
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso Denegado',
                        text: 'No tienes permisos para realizar esta acción.',
                        confirmButtonColor: '#d33',
                    });
                    break;

                case 404:
                    Swal.fire({
                        icon: 'error',
                        title: 'No Encontrado',
                        text: message,
                        confirmButtonColor: '#d33',
                    });
                    break;

                case 500:
                    Swal.fire({
                        icon: 'error',
                        title: 'Error del Servidor',
                        text: 'Ocurrió un error en el servidor. Por favor, intenta más tarde.',
                        confirmButtonColor: '#d33',
                    });
                    break;

                default:
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: message,
                        confirmButtonColor: '#d33',
                    });
            }
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
                confirmButtonColor: '#d33',
            });
        } else {
            // Algo ocurrió al configurar la petición
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error inesperado.',
                confirmButtonColor: '#d33',
            });
        }

        return Promise.reject(error);
    }
);

export default api;
