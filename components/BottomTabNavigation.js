import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import WorkQueueStack from './WorkQueueStack';
import MapsStack from './MapsStack';
import ClientsStack from './ClientsStack';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

//Bottom tab navigation component receiving clients and setClients as props
export default function BottomTabNavigation({ clients, setClients }) {
    return (
       <Tab.Navigator
            screenOptions={{
                //colors for active and inactive bottom tab icons
                tabBarActiveTintColor: '#176817',
                tabBarInactiveTintColor: '#66B166',
                headerShown: false
            }}
        >
        <Tab.Screen 
            name="Home"
            options={{
                //icon for home tab, size automatically provided by react navigation, colors from screenOptions
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />
                ),
            }}
        >
            {/*rendering HomeStack and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <HomeStack
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Tab.Screen>


        <Tab.Screen 
            name="WorkQueue" 
            options={{ tabBarIcon: ({ color, size }) => (
                <Ionicons name='checkmark-circle' size={size} color={color}/>
                ),
            }}
        >
            {/*rendering WorkQueueStack and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <WorkQueueStack 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}    
        </Tab.Screen>
        
        <Tab.Screen
            name="Map"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="map" size={size} color={color} />
                ),
            }}
        >
            {/*rendering MapsStack and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <MapsStack
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Tab.Screen>

        <Tab.Screen 
            name="Clients" 
            options={{ tabBarIcon: ({ color, size }) => (
                <Ionicons name='people' size={size} color={color} />
                ),
            }}
        >
            {/*rendering ClientsStack and passing default props and in addition clients and setClients as props*/}
            {(props) => (
                <ClientsStack 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Tab.Screen>
       </Tab.Navigator>
    );
}