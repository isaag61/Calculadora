import { FontAwesome5 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';

// Importamos la configuración de axios
import '../utils/axios-config';

// Previene que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

// 1️⃣ Componente principal que incluye el layout y el contenedor del toast
function RootLayoutContent() {
  React.useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    import('../utils/auth').then(({ checkAuth }) => {
      checkAuth();
    });
  }, []);

  return (
    <>
      <TabLayout />
      <Toast />
    </>
  );
}

// 2️⃣ Configuración de pestañas inferiores (Tabs)
function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A87D8',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontFamily: 'Raleway-Regular' },
      }}
    >
      <Tabs.Screen
        name="resident/announcements"
        options={{
          title: 'Anuncios',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="bullhorn"
              size={20}
              color={focused ? color : '#888'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="resident/reservations"
        options={{
          title: 'Reservaciones',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="calendar-alt"
              size={20}
              color={focused ? color : '#888'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="resident/information"
        options={{
          title: 'Información',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="info-circle"
              size={20}
              color={focused ? color : '#888'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="resident/packages"
        options={{
          title: 'Paquetes',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="box"
              size={20}
              color={focused ? color : '#888'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// 3️⃣ Estilos del tab bar
const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

// 4️⃣ Exportación
export default RootLayoutContent;
