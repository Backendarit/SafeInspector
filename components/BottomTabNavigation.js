import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeStack from './HomeStack';
import WorkQueueStack from './WorkQueueStack';
import MapsStack from './MapsStack';
import ClientsStack from './ClientsStack';

import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigation({ clients, setClients }) {
    return (
       <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#176817',
                tabBarInactiveTintColor: '#66B166',
                headerShown: false
            }}
        >
        <Tab.Screen name="Home" component={HomeStack} 
            options={{ tabBarIcon: ({ color, size }) => (
                <Ionicons name='home' size={size} color={color} />
                ),
            }}
        />

        <Tab.Screen name="WorkQueue" 
            options={{ tabBarIcon: ({ color, size }) => (
                <Ionicons name='checkmark-circle' size={size} color={color}/>
                ),
            }}
        >
            {(props) => (
                <WorkQueueStack 
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}    
        </Tab.Screen>
        
            <Tab.Screen
            name="Maps"
            options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="map" size={size} color={color} />
                ),
            }}
        >
            {(props) => (
                <MapsStack
                    {...props}
                    clients={clients}
                    setClients={setClients}
                />
            )}
        </Tab.Screen>

        <Tab.Screen name="Clients" 
            options={{ tabBarIcon: ({ color, size }) => (
                <Ionicons name='people' size={size} color={color} />
                ),
            }}
        >
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