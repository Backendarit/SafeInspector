import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../components/styles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeTitle}>SafeInspector 🚒</Text>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Clients')}
      >
        <Text style={styles.homeButtonText}>Go to Clients</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Work Queue')}
      >
        <Text style={styles.homeButtonText}>Go to Work Queue</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Text style={styles.homeButtonText}>Go to Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

