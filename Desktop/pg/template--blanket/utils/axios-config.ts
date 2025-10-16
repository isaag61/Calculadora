import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Configurar URL base de la API
axios.defaults.baseURL = 'https://4ldjl2hx-8000.use2.devtunnels.ms';

// Configurar headers por defecto
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Interceptor para las solicitudes
axios.interceptors.request.use(
    async (config) => {
        try {
            // Obtener el token desde AsyncStorage
            const token = await AsyncStorage.getItem('token');
            
            // Si existe un token, agregarlo a los headers
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('Token agregado a la petición:', token);
            } else {
                console.log('No hay token disponible');
            }

            console.log('Configuración de la petición:', {
                url: config.url,
                method: config.method,
                headers: config.headers,
                data: config.data
            });

            return config;
        } catch (error) {
            console.error('Error en el interceptor de solicitud:', error);
            return Promise.reject(error);
        }
    },
    (error) => {
        console.error('Error en la configuración de la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor para las respuestas
axios.interceptors.response.use(
    (response) => {
        console.log('Respuesta exitosa:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    async (error) => {
        console.error('Error en la respuesta:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Si el error es 401 (No autorizado)
        if (error.response?.status === 401) {
            console.log('Error 401 detectado, limpiando sesión...');
            try {
                await AsyncStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            } catch (storageError) {
                console.error('Error al limpiar el token:', storageError);
            }
        }

        return Promise.reject(error);
    }
);