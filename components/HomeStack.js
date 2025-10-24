// stack/HomeStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screen/Home";
import WorkQueue from "../screen/WorkQueue";
import { stackHeader } from "../components/headerOptions"; 

const Stack = createNativeStackNavigator();

export default function HomeStack({ clients, setClients }) {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}  
    >
      <Stack.Screen name="HomeScreen">
        {(props) => (
          <Home {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>

      <Stack.Screen name="WorkQueueScreen" options={{ title: "Work Queue" }}>
        {(props) => (
          <WorkQueue {...props} clients={clients} setClients={setClients} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}