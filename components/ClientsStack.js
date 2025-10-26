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

//Clients stack navigator component receiving clients and setClients as props from BottomTabNavigation
export default function ClientsStack({ clients, setClients }) {

  return (
    //initialRouteName sets the default screen when this stack is loaded
    <Stack.Navigator initialRouteName="ClientListScreen" screenOptions={stackHeader}> 
        <Stack.Screen name="ClientListScreen" options={{title: "Clients"} }>
            {/*rendering ClientList and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <ClientList 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Stack.Screen>
        <Stack.Screen name="AddClientScreen" options={{title: "Add Client"}}>
            {/*rendering AddClient and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <AddClient 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Stack.Screen>
        {/*screens for adding and editing extinguishers, no additional props needed so component is provided directly*/}
        <Stack.Screen name="AddExtinguisherScreen" options={{title: "Add Extinguisher"}} component={AddExtinguisher} />
        <Stack.Screen name="EditExtinguisherScreen" options={{title: "Edit Extinguisher"}} component={EditExtinguisher} />
        <Stack.Screen name="SiteDetailScreen" options={{title: "Site Details"}}>
            {/*rendering SiteDetail and passing default props and in addition clients and setClients as props*/}
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