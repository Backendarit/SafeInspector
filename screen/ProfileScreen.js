import React from 'react';
import { View, Text } from 'react-native';
import styles from '../components/styles';

export default function ProfileScreen() {
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileText}>Profile Screen</Text>
      <Text style={styles.profileSubtext}>User profile and settings will be here</Text>
    </View>
  );
}

