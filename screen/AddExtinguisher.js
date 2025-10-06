import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import { BASE_URL } from "../config";
import styles from "../components/styles";

export default function AddExtinguisher({ route, navigation }) {
  const { clientId, siteId } = route.params;

  // Input fields
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [manufactureYear, setManufactureYear] = useState("");
  const [lastInspection, setLastInspection] = useState("");
  const [intervalYears, setIntervalYears] = useState(2); // default 2 years
  const [notes, setNotes] = useState("");

  // Save new Extinguisher
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
      intervalYears,
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

      const data = await response.json();

      // Jos backend esti lisäämisen
      if (!response.ok && data.error === "Inspection blocked") {
        Alert.alert(
          "Cannot Add Extinguisher",
          data.message,
          [{ text: "OK", style: "default" }]
        );
        return;
      }

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      Alert.alert("Saved!", "New extinguisher added successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("Error adding extinguisher:", err);
      Alert.alert("Error", "Failed to save extinguisher.");
    }
  };

  // --- INPUTS ---

  return (
    <View style={styles.addExtContainer}>
      <Text style={styles.addExtTitle}>Add Extinguisher</Text>

      <TextInput
        style={styles.addExtInput}
        placeholder="Type (e.g. Tamrex 6kg ABC)"
        value={type}
        onChangeText={setType}
      />
      <TextInput
        style={styles.addExtInput}
        placeholder="Location (e.g. Backroom)"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.addExtInput}
        placeholder="Manufacture Year (e.g. 2019)"
        value={manufactureYear}
        onChangeText={setManufactureYear}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.addExtInput}
        placeholder="Last Inspection (YYYY-MM-DD)"
        value={lastInspection}
        onChangeText={setLastInspection}
      />

      <Text style={styles.addExtlabel}>Inspection Interval (years)</Text>
      <Picker
        selectedValue={intervalYears}
        onValueChange={(value) => setIntervalYears(value)}
        style={styles.addExtInput}
      >
        <Picker.Item label="1 year" value={1} />
        <Picker.Item label="2 years" value={2} />
      </Picker>

      <TextInput
        style={styles.addExtInput}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.addExtButton} onPress={handleSave}>
        <Text style={styles.addExtButtonText}>Save Extinguisher</Text>
      </TouchableOpacity>
    </View>
  );
}
