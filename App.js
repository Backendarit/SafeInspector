import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigation from './components/BottomTabNavigation';
import { BASE_URL } from "./config";

export default function App() {
  
  // Store clients fetched from Azure backend
    const [clients, setClients] = useState([]);

    // Fetch clients from API when app starts
    useEffect(() => {
      const fetchClients = async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/clients`);
          const data = await res.json();
          setClients(data);
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
