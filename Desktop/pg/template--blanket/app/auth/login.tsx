import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import '../../utils/axios-config'; // Importamos la configuración global de axios
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false); // Nuevo estado para manejo de carga
    const [error, setError] = useState<string | null>(null); // Nuevo estado para manejo de errores

    // Estados para los campos del formulario
    const [numero_apartamento, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const handleLogin = async () => {
        if (loading) return; // Evita múltiples clics

        setLoading(true);
        setError(null);

        try {
            // Configuración de Axios con headers CORS
            const config = {
                'withCredentials': true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Permitir credenciales
                }
            };

            // Envía los datos del usuario al backend
            // La URL base ya está configurada en axios-config
            console.log('Intentando iniciar sesión...');

            const response = await axios.post(
                '/api/usuarios/login/',
                { numero_apartamento, password },
                {
                    ...config,
                    timeout: 10000, // Timeout de 10 segundos
                    validateStatus: function (status) {
                        return status >= 200 && status < 500; // No rechazar respuestas con status < 500
                    }
                }
            );

            if (!response.data) throw new Error('Respuesta vacía del servidor.');

            console.log('Respuesta completa:', response.data);
            
            if (!response.data.data || !response.data.data.token) {
                console.error('No se recibió token en la respuesta');
                throw new Error('No se recibió token del servidor');
            }

            const userData = response.data.data;
            const token = userData.token;
            const rol = userData.rol;
            
            console.log('Token recibido:', token);
            console.log('Rol recibido:', rol);

            try {
                // Guardar el token JWT
                console.log('Intentando guardar token en AsyncStorage...');
                await AsyncStorage.setItem('token', token);
                console.log('Token guardado exitosamente en AsyncStorage');

                // Verificar que el token se guardó
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token recuperado de AsyncStorage:', storedToken);

                if (!storedToken) {
                    console.error('El token no se guardó correctamente');
                    throw new Error('El token no se guardó correctamente');
                }

                // Configurar el token en los headers por defecto de axios
                console.log('Configurando token en headers de axios...');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                console.log('Token configurado en axios correctamente');
            } catch (error) {
                console.error('Error detallado al manejar el token:', error);
                if (error instanceof Error) {
                    throw new Error(`Error al manejar el token: ${error.message}`);
                } else {
                    throw new Error('Error desconocido al manejar el token');
                }
            }

            switch (rol) {
                case 'admin':
                    router.replace('/admin/announcements' as never);
                    break;
                case 'residente':
                    router.replace('/resident/announcements' as never);
                    break;
                default:
                    router.replace('/resident/announcements' as never);
            }

        } catch (error: any) {
            console.error('Error completo al iniciar sesión:', error);
            let errorMessage = 'Error de conexión. Inténtalo más tarde.';

            if (axios.isAxiosError(error)) {
                console.error('Detalles del error de Axios:', {
                    message: error.message,
                    code: error.code,
                    request: error.request?.data,
                    response: {
                        status: error.response?.status,
                        data: error.response?.data
                    }
                });

                if (error.code === 'ECONNREFUSED') {
                    errorMessage = 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
                } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
                    errorMessage = 'La conexión al servidor ha tardado demasiado. Por favor, inténtalo de nuevo.';
                } else if (error.response) {
                    const status = error.response.status;
                    console.error('Datos del error del servidor:', error.response.data);
                    
                    if (status === 401) {
                        errorMessage = 'Usuario o contraseña incorrectos.';
                    } else if (status === 404) {
                        errorMessage = 'Usuario no encontrado.';
                    } else {
                        errorMessage = `Error del servidor (código ${status}): ${error.response.data.message || 'Error desconocido'}`;
                    }
                } else if (error.request) {
                    errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
                    console.error('Error de solicitud:', error.request);
                }
            } else {
                // Para errores que no son de Axios (como los de AsyncStorage)
                errorMessage = error.message || 'Error inesperado durante el inicio de sesión';
                console.error('Error no relacionado con Axios:', {
                    message: error.message,
                    stack: error.stack
                });
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />

            {/* Sección del logo */}
            <View style={styles.logoContainer}>
                {/* Ícono original, color principal */}
                <FontAwesome5 name="house-user" size={80} color="#001F3F" />
                {/* Tipografía Raleway-Bold */}
                <Text style={styles.logoText}>LIFETOGETHER</Text>
            </View>

            {/* Tarjeta del formulario de inicio de sesión */}
            <View style={styles.card}>
                {/* Muestra el error si existe */}
                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* Label con Raleway-Bold */}
                <Text style={styles.label}>Usuario (Número de Apartamento)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: 101"
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                    keyboardType='numeric'
                    value={numero_apartamento}
                    onChangeText={setUsername}
                />

                {/* Label con Raleway-Bold */}
                <Text style={styles.label}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Tu contraseña"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Botón de Login con Raleway-Bold */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={loading} // Deshabilita mientras carga
                >
                    <Text style={styles.loginButtonText}>
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Text>
                </TouchableOpacity>

                {/* Enlace con Raleway-Regular */}
                <TouchableOpacity>
                    <Text style={styles.forgotPasswordText}>¿Olvidó su contraseña?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center', // Centrado vertical para la pantalla de login
    },
    logoContainer: {
        alignItems: 'center',
        // Centramos el logo más arriba para dejar espacio al formulario
        position: 'absolute',
        top: 70,
        marginBottom: 0,
    },
    logoText: {
        fontSize: 32, // Un poco más grande
        fontFamily: 'Raleway-Bold', // 🔑 APLICADO RALEWAY BOLD
        fontWeight: 'normal',
        color: '#001F3F',
        marginTop: 10,
    },
    card: {
        width: '90%',
        maxWidth: 400,
        padding: 25, // Un poco más de padding
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, // Sombra más fuerte
        shadowRadius: 10,
        elevation: 6,
        alignItems: 'stretch',
        // Esto centra el card verticalmente
        marginTop: 140, // Separación del logo
    },
    label: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold', // 🔑 APLICADO RALEWAY BOLD
        fontWeight: 'normal',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#E8E8E8',
        borderRadius: 10, // Más redondeado
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        fontFamily: 'Raleway-Regular', // 🔑 APLICADO RALEWAY REGULAR
        color: '#000', // Asegura que el texto ingresado se vea bien
    },
    loginButton: {
        backgroundColor: '#6A87D8', // Color de acento
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        // Efecto de sombra para el botón
        shadowColor: '#6A87D8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Raleway-Bold', // 🔑 APLICADO RALEWAY BOLD
        fontWeight: 'normal',
    },
    forgotPasswordText: {
        color: '#6A87D8', // Color de acento
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Raleway-Regular', // 🔑 APLICADO RALEWAY REGULAR
        textDecorationLine: 'underline',
    },
    errorText: {
        fontFamily: 'Raleway-Regular',
        fontSize: 14,
        color: 'red',
        textAlign: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fee',
        borderRadius: 8,
    }
});