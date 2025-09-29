import "react-native-gesture-handler";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screen/Home";
import ClientList from "./screen/ClientList";
import WorkQueue from "./screen/WorkQueue";
import ProfileScreen from "./screen/ProfileScreen";
import SiteDetail from "./screen/SiteDetail";
import AddClient from "./screen/AddClient";
import { initialClients } from "./data/clientsData";

const Stack = createNativeStackNavigator();

export default function App() {
  // käytetään initialClients lähtödatana
  const [clients, setClients] = useState(initialClients);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#D2D5D7" },
          headerTintColor: "#000",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="Clients">
          {(props) => <ClientList {...props} clients={clients} />}
        </Stack.Screen>

        <Stack.Screen name="Work Queue" component={WorkQueue} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SiteDetail" component={SiteDetail} />

        <Stack.Screen name="AddClient">
          {(props) => (
            <AddClient {...props} clients={clients} setClients={setClients} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
//Azure Deploy
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;