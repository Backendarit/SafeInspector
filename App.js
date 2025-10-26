import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './components/BottomTabNavigation';
import { BASE_URL } from "./config";
import { init, fetchAllClients, saveClients } from './sqlconnection/db';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  
  // Store all clients (fetched from Azure or local SQLite)
  const [clients, setClients] = useState([]);

   // Run once when the app starts
  useEffect(() => {
    const fetchClients = async () => {
      // Initialize SQLite database
      await init();
      try {
        // Try reading clients from local SQLite
        const offline = await fetchAllClients();
         // Show local data first if no online data yet
        if (offline?.length && (!clients || clients.length === 0)) {
          setClients(offline);
        }
      } catch (e) {
        console.log('Offline read failed', e);
      }

      try {
        // Fetch the newest client data from Azure
        const res = await fetch(`${BASE_URL}/api/clients`);
        const data = await res.json();
        // Update the state with newest data
        setClients(data);
        // Save newest Azure data to SQLite for offline use 
        await saveClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };
    // Run data loading function on startup
    fetchClients();
      // Listen for network connection changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        fetchClients(); // Re-sync when connection is restored
      }
    });
    
    // Remove the network listener when leaving the screen
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {/* pass clients and setClients as props to BottomTabNavigation */}
      <BottomTabNavigation clients={clients} setClients={setClients} />
    </NavigationContainer>
  );
}
