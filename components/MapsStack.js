import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import Maps from "./Maps"; tai millä nimellä se sitten tulee olemaan
import SiteDetail from "../screen/SiteDetail";
import { stackHeader } from "../components/headerOptions"; 

const Stack = createNativeStackNavigator();
export default function MapsStack() {
  return (
    //koska ei ole vielä karttaa, niin laitetaan SiteDetail tähän
    <Stack.Navigator initialRouteName="SiteDetailScreen" screenOptions={stackHeader}>
        {/*<Stack.Screen name="MapsScreen" component={Maps} />*/}
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