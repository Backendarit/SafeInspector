import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ClientList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clients</Text>
      <Text style={styles.subtext}>Here you will manage clients</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#444',
  },
});
