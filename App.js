import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screen/Home";
import ClientList from "./screen/ClientList";
import WorkQueue from "./screen/WorkQueue";
import ProfileScreen from "./screen/ProfileScreen";
import SiteDetail from "./screen/SiteDetail";
import AddClient from "./screen/AddClient";
import EditExtinguisher from "./screen/EditExtinguisher";
import AddExtinguisher from "./screen/AddExtinguisher";
import { BASE_URL } from "./config";

const Stack = createNativeStackNavigator();

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
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#D2D5D7" },
          headerTintColor: "#000",
        }}
      >
        {/* Home screen */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Clients list screen, pass clients from API */}
        <Stack.Screen name="Clients">
          {(props) => <ClientList {...props} clients={clients} />}
        </Stack.Screen>

        {/* Work queue and profile (simple static screens for now) */}
        <Stack.Screen name="Work Queue" component={WorkQueue} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* Site details page: needs both clients data and updater */}
        <Stack.Screen name="SiteDetail">
          {(props) => (
            <SiteDetail
              {...props}
              clients={clients}
              setClients={setClients}
            />
          )}
        </Stack.Screen>

        {/* Add new client: calls backend API and updates state */}
        <Stack.Screen name="AddClient">
          {(props) => (
            <AddClient {...props} clients={clients} setClients={setClients} />
          )}
        </Stack.Screen>

        <Stack.Screen name="EditExtinguisher" component={EditExtinguisher} />
        
        <Stack.Screen name="AddExtinguisher" component={AddExtinguisher} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
