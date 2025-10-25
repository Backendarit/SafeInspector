import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SiteDetail from "../screen/SiteDetail";
import Maps from "../screen/Map";   
import { stackHeader } from "../components/headerOptions"; 

const Stack = createNativeStackNavigator();

export default function MapsStack({ clients, setClients }) {
  return (
    <Stack.Navigator initialRouteName="MapsScreen" screenOptions={stackHeader}>
      <Stack.Screen name="MapsScreen" options={{ title: "Map" }}>
        {(props) => (
          <Maps {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>

      <Stack.Screen name="SiteDetailScreen" options={{ title: "Site Detail" }}>
        {(props) => (
          <SiteDetail {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
