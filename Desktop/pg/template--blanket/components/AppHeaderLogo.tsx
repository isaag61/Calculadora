// components/AppHeaderLogo.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
// Eliminamos la importación de FontAwesome5

// 1. Importación de la imagen del logo completo
const LOGO_IMAGE = require('../assets/images/logo.png');

interface AppHeaderLogoProps {
  // Opcional: para controlar el ancho del logo si es necesario
  width?: 250; 
  height?: 70; 
}

export default function AppHeaderLogo({ width = 250, height = 70 }: AppHeaderLogoProps) {
  return (
    <View style={styles.container}>
      {/* Usamos un solo componente Image para el logo completo */}
      <Image resizeMode="contain" style={{ width: 100, height: 100 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Los estilos de aquí simplemente centran la imagen si es necesario,
    // pero la clave es que la imagen es la que lleva todo el diseño.
    flexDirection: 'row',
    alignItems: 'center',
  },
});