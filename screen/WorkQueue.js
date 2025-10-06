import React from 'react';
import { View, Text } from 'react-native';
import styles from '../components/styles';

export default function WorkQueue() {
  return (
    <View style={styles.workContainer}>
      <Text style={styles.workText}>Work Queue Screen</Text>
      <Text style={styles.workSubtext}>Tasks and inspections will be listed here</Text>
    </View>
  );
}

