import React from "react";  
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { stackHeader } from "../components/headerOptions"; 
import ClientList from "../screen/ClientList";
import AddClient from "../screen/AddClient";
import AddExtinguisher from "../screen/AddExtinguisher";
import EditExtinguisher from "../screen/EditExtinguisher";
import SiteDetail from "../screen/SiteDetail";
import SiteUpdate from "../screen/SiteUpdate";

const Stack = createNativeStackNavigator();

export default function ClientsStack({ clients, setClients }) {

  return (
    <Stack.Navigator initialRouteName="ClientListScreen" screenOptions={stackHeader}> 
        <Stack.Screen name="ClientListScreen" options={{title: "Clients"} }>
            {(props) => (
                <ClientList 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Stack.Screen>
        <Stack.Screen name="AddClientScreen" options={{title: "Add Client"}}>
            {(props) => (
                <AddClient 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Stack.Screen>
        <Stack.Screen name="AddExtinguisherScreen" options={{title: "Add Extinguisher"}} component={AddExtinguisher} />
        <Stack.Screen name="EditExtinguisherScreen" options={{title: "Edit Extinguisher"}} component={EditExtinguisher} />
        <Stack.Screen name="SiteDetailScreen" options={{title: "Site Details"}}>
            {(props) => (
                <SiteDetail 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Stack.Screen>
        {/*<Stack.Screen name="SiteUpdateScreen" component={SiteUpdate} />*/}
    </Stack.Navigator>
    );
}