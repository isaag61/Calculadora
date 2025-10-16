import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Después de 5 segundos, navega a la pantalla de login
    const timer = setTimeout(() => {
      router.replace('/auth/register');
    }, 5000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainer}>
        {/* LOGO ORIGINAL - NO CAMBIADO */}
        <FontAwesome5 name="home" size={64} color="#001F3F" />
        {/* TEXTO ORIGINAL CON TIPOGRAFÍA ACTUALIZADA */}
        <Text style={styles.logoText}>LIFE</Text>
        <Text style={styles.logoTextt}>TOGETHER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Usé el color de acento principal para consistencia.
    backgroundColor: '#dce6ffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    // 🔑 CAMBIO CLAVE: Aplicamos la tipografía Raleway-Bold
    fontFamily: 'Raleway-Bold',
    fontWeight: 'normal', // Usamos 'normal' ya que el archivo TTF ya define el peso
    color: '#1674d3ff',
    marginLeft: 10,
  },
  logoTextt: {
    fontSize: 40,
    // 🔑 CAMBIO CLAVE: Aplicamos la tipografía Raleway-Bold
    fontFamily: 'Raleway-Bold',
    fontWeight: 'normal', // Usamos 'normal' ya que el archivo TTF ya define el peso
    color: '#001F3F',
    marginLeft: 10,
  },
});