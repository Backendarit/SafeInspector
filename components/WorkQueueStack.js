import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkQueue from "../screen/WorkQueue";
import SiteDetail from "../screen/SiteDetail";

const Stack = createNativeStackNavigator();

export default function WorkQueueStack({ clients, setClients }) {
  return (
    <Stack.Navigator initialRouteName="WorkQueueScreen">
        <Stack.Screen name="WorkQueueScreen" options={{title: "Work Queue"}}>
          {(props) => (
            <WorkQueue 
                {...props}
                  clients={clients} 
                  setClients={setClients}
              />
            )}
        </Stack.Screen>
        <Stack.Screen name="SiteDetailScreen" options={{title: "Site Detail"}}>
          {(props) => (
            <SiteDetail 
                {...props}
                  clients={clients}
                  setClients={setClients}
              />
            )}
          </Stack.Screen>
    </Stack.Navigator>
    );
}