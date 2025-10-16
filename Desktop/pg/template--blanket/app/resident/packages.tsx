import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import PageHeader from '../../components/PageHeader';

export default function PackagesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View>
          <PageHeader title="Paquetes" />
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Tus paquetes</Text>
          </View>
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
  contentContainer: {
    paddingBottom: 20,
  },
  titleContainer: {
    padding: 15,
  },
  mainTitle: {
    fontSize: 25,
    fontFamily: 'Raleway-Bold',
    fontWeight: 'normal',
    color: '#001F3F',
    marginTop: 5,
    textAlign: 'left',
  },
});
