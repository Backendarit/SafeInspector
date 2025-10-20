import React from "react";
import { Text } from "react-native";

export const stackHeader = {
  headerTitleAlign: "center",
  headerTitle: ({ children }) => (
    <Text
      style={{
        fontSize: 24,
        fontWeight: "bold",
        color: "#161616ff",
      }}
    >
      {children}
    </Text>
  ),
  headerTintColor: "#161616ff", // värjää nuolen 
};
