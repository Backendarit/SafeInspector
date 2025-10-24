import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../components/styles';

const LOGO = require('../assets/safeinspector.png');

export default function Home({ navigation, clients = [] }) {
  const today = new Date().toISOString().split('T')[0];

// Counters for inspections due today and late inspection 
let dueToday = 0;
let late = 0;

// Go through all clients, sites and extinguishers
clients.map(c => c.sites || []).flat().map(s => s.extinguishers || []).flat().forEach(e => {
  if (e?.nextInspection === today) {
    dueToday++;
  }
  if (String(e?.status || '').toLowerCase().includes('late')) {
    late++;
  }
});


  return (
    <View style={styles.homeContainer}>
      {/* Logo */}
      <Image
        source={LOGO}
        style={{ width: 280, height: 150, marginBottom: 10, marginTop: -40 }}
        resizeMode="contain"
      />
    {/* Slogan under the logo */}
      <Text style={{ fontSize: 22, color: '#333', fontStyle: 'italic', marginBottom: 30 }}>
        Safety in your pocket.
      </Text>

      
      <View style={styles.homeSummaryCard}>
        <Text style={styles.homeSummaryTitle}>Work Queue (today)</Text>

        {/* Due today row */}
        <View style={styles.homeSummaryRow}>
          <Ionicons name="checkmark-circle" size={22} color="#176817" style={{ marginRight: 8 }}
          />
          <Text style={styles.homeSummaryLabel}>Due today</Text>
          <Text style={styles.homeSummaryValue}>{dueToday}</Text>
        </View>

        {/* Late row */}
        <View style={styles.homeSummaryRow}>
          <Ionicons
            name="alert-circle"  size={22} color="#c62828" style={{ marginRight: 8 }}
          />
          <Text style={styles.homeSummaryLabel}>Late</Text>
          <Text style={styles.homeSummaryValue}>{late}</Text>
        </View>
        
        {/* Button to Work queue */}
        <TouchableOpacity
          style={styles.homeWorkButton}
          onPress={() => navigation.navigate('WorkQueue')}
        >
          <Text style={styles.homeWorkButtonText}>Go to Work Queue</Text>
        </TouchableOpacity>
      </View>
    </View> 
  );         
}             






