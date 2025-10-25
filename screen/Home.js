import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../components/styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BASE_URL } from '../config';

// Load SafeInspector logo from assets
const LOGO = require('../assets/safeinspector.png');


export default function Home({ navigation, clients = [], setClients }) {
  // Get today's date in format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Get the latest client data when Home opens
    useFocusEffect(
    useCallback(() => {
      const fetchClients = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/clients`);
          const fresh = await res.json();
          if (Array.isArray(fresh) && setClients) setClients(fresh);
        } catch (err) {
          console.warn('Failed to refresh clients:', err);
        }
      };
      fetchClients();
    }, [setClients])
  );


// Counters for inspections due today and late inspection 
let dueToday = 0;
let late = 0;

// Go through all clients, sites and extinguishers
clients
  .flatMap(c => c.sites || [])
  .flatMap(s => s.extinguishers || [])
  .forEach(e => {
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






