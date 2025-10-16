import { FontAwesome5 } from '@expo/vector-icons';
import axios, { AxiosError } from 'axios';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// 🔑 URL de tu API para el registro (DEBES CONFIGURAR ESTA RUTA EN DJANGO)
import '../../utils/axios-config'; // Importamos la configuración global de axios
// Asumiendo que tu API de registro es similar a tu API de anuncios.

export default function RegisterScreen() {
    // Estado para los campos del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apartmentNumber, setApartmentNumber] = useState('');
    const [tower, setTower] = useState('');

    const [loading, setLoading] = useState(false);

    // Lógica para enviar los datos a la API
    const handleRegister = async () => {
        if (!name || !email || !password || !apartmentNumber || !tower) {
            Alert.alert("Error de Registro", "Por favor, completa todos los campos.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/usuarios/register/', {
                full_name: name,
                email: email,
                password: password,
                apartment_number: apartmentNumber,
                tower: tower,
                // No incluimos vehículos aquí; se agregarán en la pantalla vehicles.tsx
            });

            // Registro exitoso
            Alert.alert("¡Registro Exitoso!", "Tu cuenta ha sido creada. Por favor, inicia sesión ahora.");

            // Navegar a la pantalla de Login después de un registro exitoso
            router.replace('/auth/login');

        } catch (error) {
            console.error("Error en el registro:", error);
            // Manejo de errores específicos (ej. usuario ya existe, error de servidor)
            const axiosError = error as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || "Hubo un error al intentar registrarte. Revisa tu conexión, la URL de la API o la configuración CORS.";
            Alert.alert("Error", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            {/* Logo de la aplicación */}
            <View style={styles.logoContainer}>
                <FontAwesome5 name="home" size={60} color={ACCENT_COLOR} />
                <Text style={styles.logoText}>LIFETOGETHER</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.title}>Crear Cuenta</Text>

                    {/* Nombre Completo */}
                    <Text style={styles.label}>Nombre Completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre y apellido"
                        value={name}
                        onChangeText={setName}
                        keyboardType="default"
                    />

                    {/* Correo Electrónico */}
                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="tu.correo@ejemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    {/* Contraseña */}
                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Torre y Apartamento en una sola fila */}
                    <View style={styles.row}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Torre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 5"
                                value={tower}
                                onChangeText={setTower}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Apartamento</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ej: 749"
                                value={apartmentNumber}
                                onChangeText={setApartmentNumber}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Botón de Registro */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Registrar</Text>
                        )}
                    </TouchableOpacity>

                    {/* Enlace para ir al Login */}
                    <TouchableOpacity onPress={() => router.replace('/auth/login')}>
                        <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const ACCENT_COLOR = '#6A87D8'; // Azul de acento
const MAIN_COLOR = '#001F3F'; // Azul marino

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F0F0', // Fondo claro
        justifyContent: 'center',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 50,
    },
    logoText: {
        fontSize: 28,
        fontFamily: 'Raleway-Bold', // 🔑 Raleway-Bold
        color: MAIN_COLOR,
        marginTop: 5,
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        shadowColor: MAIN_COLOR,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Raleway-Bold', // 🔑 Raleway-Bold
        color: MAIN_COLOR,
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular', // 🔑 Raleway-Regular
        color: MAIN_COLOR,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        fontFamily: 'Raleway-Regular', // 🔑 Raleway-Regular
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        width: '48%',
    },
    button: {
        backgroundColor: ACCENT_COLOR,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#AAB8D9', // Un azul más claro para indicar deshabilitado
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Raleway-Bold', // 🔑 Raleway-Bold
        fontWeight: 'normal',
    },
    linkText: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular', // 🔑 Raleway-Regular
        color: ACCENT_COLOR,
        textAlign: 'center',
    },
});