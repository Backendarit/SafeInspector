import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import styles from '../components/styles';

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
    <View style={styles.editExtContainer}>
      <Text style={styles.editExtTitle}>{extinguisher.type}</Text>

      <Text style={styles.editExtLabel}>Location</Text>
      <TextInput
        style={styles.editExtInput}
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.editExtLabel}>Notes</Text>
      <TextInput
        style={styles.editExtInput}
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.editExtButton} onPress={handleUpdateInspection}>
        <Text style={styles.editExtButtonText}>Update Inspection Date</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editExtButton} onPress={handleSave}>
        <Text style={styles.editExtButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editExtDeleteButton} onPress={handleDelete}>
        <Text style={styles.editExtButtonText}>Delete Extinguisher</Text>
      </TouchableOpacity>
    </View>
  );
}

