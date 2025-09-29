// screen/AddExtinguisher.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { BASE_URL } from "../config";

export default function AddExtinguisher({ route, navigation }) {
  const { clientId, siteId } = route.params;

  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [lastInspection, setLastInspection] = useState("");
  const [intervalYears, setIntervalYears] = useState("2"); // default 2 years
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    if (!type.trim() || !location.trim() || !manufactureYear) {
      Alert.alert("Error", "Please fill required fields (type, location, year).");
      return;
    }

    const newExtinguisher = {
      id: Date.now().toString(),
      type,
      location,
      manufactureYear: parseInt(manufactureYear, 10),
      lastInspection,
      intervalYears: parseInt(intervalYears, 10),
      nextInspection: "", // backend voi laskea tai jätetään tyhjäksi
      serviceDue: "", // backend voi laskea tai jätetään tyhjäksi
      status: "OK",
      notes,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${clientId}/sites/${siteId}/extinguishers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExtinguisher),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      Alert.alert("Saved!", "New extinguisher added successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("Error adding extinguisher:", err);
      Alert.alert("Error", "Failed to save extinguisher.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Extinguisher</Text>

      <TextInput
        style={styles.input}
        placeholder="Type (e.g. Tamrex 6kg ABC)"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.input}
        placeholder="Location (e.g. Backroom)"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Manufacture Year (e.g. 2019)"
        value={manufactureYear}
        onChangeText={setManufactureYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Inspection (YYYY-MM-DD)"
        value={lastInspection}
        onChangeText={setLastInspection}
      />
      <TextInput
        style={styles.input}
        placeholder="Interval Years"
        value={intervalYears}
        onChangeText={setIntervalYears}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Extinguisher</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
