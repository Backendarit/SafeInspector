import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";

export default function EditExtinguisher() {
  const route = useRoute();
  const navigation = useNavigation();
  const { extinguisher, site, client } = route.params;

  const [location, setLocation] = useState(extinguisher.location);
  const [notes, setNotes] = useState(extinguisher.notes || "");

  // Update Inspection
  const handleUpdateInspection = async () => {
    const today = new Date();
    const lastInspection = today.toISOString().split("T")[0];
    const nextInspectionDate = new Date(today);
    nextInspectionDate.setFullYear(
      today.getFullYear() + extinguisher.intervalYears
    );
    const nextInspection = nextInspectionDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...extinguisher,
            lastInspection,
            nextInspection,
          }),
        }
      );
      if (!response.ok) throw new Error("Update failed");

      Alert.alert("Updated", "Inspection updated successfully.");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update inspection.");
    }
  };

  // Päivitä sijainti + muistiinpanot
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...extinguisher,
            location,
            notes,
          }),
        }
      );
      if (!response.ok) throw new Error("Update failed");

      Alert.alert("Saved", "Extinguisher updated successfully.");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update extinguisher.");
    }
  };

  // Poista sammutin
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Delete failed");

      Alert.alert("Deleted", "Extinguisher removed.");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete extinguisher.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{extinguisher.type}</Text>

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateInspection}>
        <Text style={styles.buttonText}>Update Inspection Date</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>Delete Extinguisher</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  label: { marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
