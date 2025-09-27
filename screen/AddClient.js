import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AddClient() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Client Screen (placeholder)</Text>
      <Text style={styles.subtext}>
        Tänne tehdään myöhemmin lomake asiakkaan lisäämistä varten.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D2D5D7",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: "#333",
  },
});
