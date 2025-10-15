import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './components/BottomTabNavigation';
import { BASE_URL } from "./config";
import { init, fetchAllClients, saveClients } from './sqlconnection/db';

export default function App() {
  
  // Store clients fetched from Azure backend
  const [clients, setClients] = useState([]);

  // Fetch clients from API when app starts
  useEffect(() => {
    const fetchClients = async () => {
      // Init SQLite and try offline read first
      await init();
      try {
        const offline = await fetchAllClients();
+       console.log('Loaded from SQLite:', offline?.length); // log SQLite result
        if (offline?.length && (!clients || clients.length === 0)) {
          setClients(offline);
        }
      } catch (e) {
        console.log('Offline read failed', e);
      }

      try {
        const res = await fetch(`${BASE_URL}/api/clients`);
        const data = await res.json();
        setClients(data);
        // Save newest Azure data to SQLite
        await saveClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    fetchClients();
  }, []);

  return (
    <NavigationContainer>
      <BottomTabNavigation clients={clients} setClients={setClients} />
    </NavigationContainer>
  );
}
