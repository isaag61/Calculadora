import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// URL de la API para obtener datos del usuario
const USER_INFO_API_URL = 'https://4ldjl2hx-8000.use2.devtunnels.ms/api/usuarios/information_temp';

// Interface para los datos del usuario
interface UserData {
    nombre_completo: string;
    correo: string;
    numero_apartamento: string;
    torre: string;
    foto: string;
}

// Estado inicial del usuario
const initialUserData: UserData = {
    nombre_completo: '',
    correo: '',
    numero_apartamento: '',
    torre: '',
    foto: '../../assets/images/PROFILE_IMAGE.png',
};

// Constantes de colores
const ACCENT_COLOR = '#6A87D8';
const MAIN_COLOR = '#001F3F';

// Componente Tarjeta de Acción (para Visitantes, Vehículos, Reservaciones)
const ActionCard = ({ iconName, title, onPress }: { iconName: string, title: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
        <FontAwesome5 name={iconName as any} size={24} color="#001F3F" style={styles.actionIcon} />
        <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
);

// Componente Tarjeta de Navegación (para Vehículos y Reservaciones)
const NavCard = ({ iconName, title, onPress }: { iconName: string, title: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.navCard} onPress={onPress}>
        <FontAwesome5 name={iconName as any} size={40} color="#001F3F" />
        <Text style={styles.navCardTitle}>{title}</Text>
    </TouchableOpacity>
);

export default function InformationScreen() {
    const [userData, setUserData] = useState<UserData>(initialUserData);
    const [loading, setLoading] = useState(true);

    // Función para cargar los datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(USER_INFO_API_URL);

                if (response.data && response.data.length > 0) {
                    const userData = response.data[0]; // Tomamos el primer usuario
                    setUserData({
                        nombre_completo: userData.nombre_completo || '',
                        correo: userData.correo || '',
                        numero_apartamento: userData.numero_apartamento || '',
                        torre: userData.torre || '',
                        foto: userData.foto || '../../assets/images/PROFILE_IMAGE.png'
                    });
                } else {
                    Alert.alert('Sin datos', 'No se encontraron datos del usuario');
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Error al cargar los datos';
                Alert.alert('Error', errorMessage);
                console.error('Error al cargar datos del usuario:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Manejadores de navegación
    const handleEdit = () => alert("Editar Información");
    const handleVisitors = () => alert("Navegar a Visitantes");
    const handleVehicles = () => alert("Navegar a Vehículos");
    const handleReservations = () => router.push('/resident/reservations');

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* 1. HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <FontAwesome5 name="house-user" size={24} color="#001F3F" />
                        <Text style={styles.logoText}>LIFETOGETHER</Text>
                    </View>
                    <Image
                        source={require('../../assets/images/PROFILE_IMAGE.png')}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.paddingContainer}>
                    {/* 2. TÍTULO */}
                    <Text style={styles.mainTitle}>Tu información está aquí</Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={ACCENT_COLOR} />
                            <Text style={styles.loadingText}>Cargando información...</Text>
                        </View>
                    ) : (
                        <>
                            {/* 3. TARJETA DE INFORMACIÓN PERSONAL BÁSICA */}
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Torre:</Text>
                                    <Text style={styles.infoValue}>{userData.torre}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Apartamento:</Text>
                                    <Text style={styles.infoValue}>{userData.numero_apartamento}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Nombre:</Text>
                                    <Text style={styles.infoValue}>{userData.nombre_completo}</Text>
                                </View>
                            </View>

                            {/* 4. TARJETA DE CORREO Y EDICIÓN */}
                            <Text style={styles.sectionTitle}>Información personal</Text>
                            <View style={styles.emailCard}>
                                <Text style={styles.emailLabel}>Correo:</Text>
                                <Text style={styles.emailValue}>{userData.correo}</Text>
                                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                                    <Text style={styles.editButtonText}>Editar</Text>
                                </TouchableOpacity>
                            </View>

                            {/* 5. SECCIÓN DE VISITANTES */}
                            <ActionCard iconName="user-check" title="Visitantes" onPress={handleVisitors} />

                            {/* 6. SECCIÓN DE NAVEGACIÓN */}
                            <View style={styles.navGrid}>
                                <NavCard iconName="car" title="Tus vehículos" onPress={handleVehicles} />
                                <NavCard iconName="calendar-alt" title="Reservaciones" onPress={handleReservations} />
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    paddingContainer: {
        paddingHorizontal: 20,
    },
    // Header y Logo
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: 'white',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        marginBottom: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
        color: MAIN_COLOR,
        marginLeft: 8,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: ACCENT_COLOR,
    },
    // Títulos
    mainTitle: {
        fontSize: 24,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
        color: MAIN_COLOR,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
        color: ACCENT_COLOR,
        marginBottom: 10,
        marginTop: 20,
    },
    // Tarjeta de información básica
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
        color: ACCENT_COLOR,
        width: '40%',
    },
    infoValue: {
        fontSize: 18,
        fontFamily: 'Raleway-Regular',
        color: MAIN_COLOR,
        width: '60%',
        textAlign: 'right',
    },
    // Tarjeta de correo y edición
    emailCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    emailLabel: {
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
        color: ACCENT_COLOR,
        marginBottom: 5,
    },
    emailValue: {
        fontSize: 16,
        fontFamily: 'Raleway-Regular',
        color: MAIN_COLOR,
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: ACCENT_COLOR,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Raleway-Bold',
        fontWeight: 'normal',
    },
    // Sección de visitantes
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    actionIcon: {
        marginRight: 15,
        color: ACCENT_COLOR,
    },
    actionTitle: {
        fontSize: 20,
        fontFamily: 'Raleway-Regular',
        color: MAIN_COLOR,
    },
    // Sección de navegación
    navGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    navCard: {
        width: '48%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        aspectRatio: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    navCardTitle: {
        fontSize: 14,
        fontFamily: 'Raleway-Regular',
        color: MAIN_COLOR,
        marginTop: 10,
        textAlign: 'center',
    },
    // Estado de carga
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    loadingText: {
        fontSize: 16,
        fontFamily: 'Raleway-Regular',
        color: MAIN_COLOR,
        marginTop: 10,
    },
});