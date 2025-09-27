import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WorkQueue() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work Queue Screen</Text>
      <Text style={styles.subtext}>Tasks and inspections will be listed here</Text>
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    marginTop: 10,
    fontSize: 16,
    color: '#444',
  },
});
