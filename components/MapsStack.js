import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SiteDetail from "../screen/SiteDetail";
import Maps from "../screen/Map";   
import { stackHeader } from "../components/headerOptions"; 

const Stack = createNativeStackNavigator();

export default function MapsStack({ clients, setClients }) {
  return (
    //initialRouteName sets the default screen when this stack is loaded
    <Stack.Navigator initialRouteName="MapsScreen" screenOptions={stackHeader}>
      <Stack.Screen name="MapsScreen" options={{ title: "Map" }}>
        //rendering Maps screen and passing clients and setClients as props in addition to default props
        {(props) => (
          <Maps {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>

      <Stack.Screen name="SiteDetailScreen" options={{ title: "Site Detail" }}>
        //rendering SiteDetail screen and passing clients and setClients as props in addition to default props
        {(props) => (
          <SiteDetail {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
