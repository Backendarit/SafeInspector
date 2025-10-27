import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BASE_URL } from "../config";
import styles from '../components/styles';

export default function EditExtinguisher() {
  const route = useRoute();
  const navigation = useNavigation();
  // Get extinguisher, site, and client data passed from the previous screen
  const { extinguisher, site, client } = route.params;
  //Local state for the extinguisher form.
  const [form, setForm] = useState({
    id: extinguisher.id,
    type: extinguisher.type,
    location: extinguisher.location,
    manufactureYear: String(extinguisher.manufactureYear),
    lastInspection: extinguisher.lastInspection,
    intervalYears: String(extinguisher.intervalYears),
    status: extinguisher.status,
    notes: extinguisher.notes || "",
  });
  //Helper function for updating a specific field in the form.
  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  // Update Extinguisher Information
  const handleSave = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form), // send the updated form data
        }
      );
      const data = await response.json();  

      if (!response.ok) throw new Error(data.message || 'Update failed');
      Alert.alert('Success', 'Extinguisher updated successfully.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to update extinguisher');
    }
  };

  // Delete Extinguisher
  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this extinguisher?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
                { method: "DELETE" }
              );
              if (!response.ok) throw new Error("Delete failed");
              // Show confirmation and return to previous screen
              Alert.alert("Deleted", "Extinguisher removed.");
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete extinguisher.");
            }
          },
        },
      ]
    );
  };

  //Displays editable text fields for extinguisher properties.
  //Automatically maps over all keys in `form` (except ID) to generate inputs.
  return (
    <ScrollView style={styles.backgroundContainer}>
      {/* Loop through form fields dynamically (skip ID) */}
      {Object.keys(form).map((key) => (
        key !== "id" && (
          <View key={key}>
            <Text style={styles.label}>{key}</Text>
            <TextInput
              style={styles.input}
              value={String(form[key])}
              onChangeText={(val) => handleChange(key, val)}
            />
          </View>
        )
      ))}
      {/* Bottom button row: Delete and Save */}
      <View style={styles.siteButtonRow}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.saveText}>Delete Extinguisher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

