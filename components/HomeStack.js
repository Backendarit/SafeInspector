import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screen/Home";
import WorkQueue from "../screen/WorkQueue";

const Stack = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={Home} options={{title: "Home Page"}}/>
      <Stack.Screen name="WorkQueueScreen" component={WorkQueue} options={{title: "Work Queue"}}/>
    </Stack.Navigator>
  );
}