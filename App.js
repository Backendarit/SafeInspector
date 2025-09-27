import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screen/Home';
import ClientList from './screen/ClientList';
import WorkQueue from './screen/WorkQueue';
import ProfileScreen from './screen/ProfileScreen';
import SiteDetail from './screen/SiteDetail';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#D2D5D7' },
          headerTintColor: '#000',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Clients" component={ClientList} />
        <Stack.Screen name="Work Queue" component={WorkQueue} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="SiteDetail" component={SiteDetail} display="none" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
