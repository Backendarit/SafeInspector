import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WorkQueue from "../screen/WorkQueue";
import SiteDetail from "../screen/SiteDetail";
import { stackHeader } from "../components/headerOptions"; 

const Stack = createNativeStackNavigator();

export default function WorkQueueStack({ clients, setClients }) {
  return (
    <Stack.Navigator initialRouteName="WorkQueueScreen" screenOptions={stackHeader}>
        <Stack.Screen name="WorkQueueScreen" options={{title: "Work Queue"}}>
          {/*rendering WorkQueue screen and passing clients and setClients as props in addition to default props*/}
          {(props) => (
            <WorkQueue 
                {...props}
                  clients={clients} 
                  setClients={setClients}
              />
            )}
        </Stack.Screen>
        <Stack.Screen name="SiteDetailScreen" options={{title: "Site Detail"}}>
          {/*rendering SiteDetail screen and passing clients and setClients as props in addition to default props*/}
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