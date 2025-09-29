import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../config";

// Päivittää tarkastustiedot sammuttimelle
function updateInspection(extinguisher) {
  const today = new Date();
  const lastInspection = today.toISOString().split("T")[0];

  // Seuraava tarkastus = nykyinen päivä + intervalYears
  const nextInspectionDate = new Date(today);
  nextInspectionDate.setFullYear(today.getFullYear() + extinguisher.intervalYears);
  const nextInspection = nextInspectionDate.toISOString().split("T")[0];

  // Huolto erääntyy = valmistusvuosi + 10
  const serviceDue = extinguisher.manufactureYear + 10;

  return {
    ...extinguisher,
    lastInspection,
    nextInspection,
    serviceDue,
  };
}

export default function SiteDetail({ navigation, setClients }) {
  const route = useRoute();
  const { site, client } = route.params; // näistä tulee navigoinnin mukana
  const [loading, setLoading] = useState(false);

  // Päivitä tarkastus backendissä ja tilassa
  const handleUpdateInspection = async (extinguisher) => {
    const updatedExt = updateInspection(extinguisher);
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedExt),
        }
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      // Päivitetään local state
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === client.id
            ? {
                ...c,
                sites: c.sites.map((s) =>
                  s.id === site.id
                    ? {
                        ...s,
                        extinguishers: s.extinguishers.map((ext) =>
                          ext.id === extinguisher.id ? updatedExt : ext
                        ),
                      }
                    : s
                ),
              }
            : c
        )
      );
      Alert.alert("Success", "Inspection updated successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update inspection.");
    } finally {
      setLoading(false);
    }
  };

  // Poista sammutin backendistä ja tilasta
  const handleDeleteExtinguisher = async (extinguisherId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisherId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      // Päivitetään local state
      setClients((prevClients) =>
        prevClients.map((c) =>
          c.id === client.id
            ? {
                ...c,
                sites: c.sites.map((s) =>
                  s.id === site.id
                    ? {
                        ...s,
                        extinguishers: s.extinguishers.filter(
                          (ext) => ext.id !== extinguisherId
                        ),
                      }
                    : s
                ),
              }
            : c
        )
      );
      Alert.alert("Deleted", "Extinguisher deleted successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to delete extinguisher.");
    } finally {
      setLoading(false);
    }
  };

  // Renderöi näkymä
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{site.name}</Text>
      <Text style={styles.subtitle}>Client: {client.name}</Text>
      <Text>Address: {site.address}</Text>
      <Text>Contact: {site.contact.name}</Text>
      <Text>Phone: {site.contact.phone}</Text>

      {/* Add New Extinguisher */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("AddExtinguisher", {
            clientId: client.id,
            siteId: site.id,
          })
        }
      >
        <Text style={styles.addButtonText}>+ Add Extinguisher</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Extinguishers</Text>
      {loading && <ActivityIndicator size="large" color="green" />}
      <FlatList
        data={site.extinguishers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.extinguisherName}>{item.type}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Manufacture Year: {item.manufactureYear}</Text>
            <Text>Last Inspection: {item.lastInspection}</Text>
            <Text>Inspection Interval: {item.intervalYears} years</Text>
            <Text>Next Inspection: {item.nextInspection}</Text>
            <Text>Service Due: {item.serviceDue}</Text>
            <Text>Status: {item.status}</Text>
            {item.notes ? <Text>Notes: {item.notes}</Text> : null}

            {/* UPDATE INSPECTION */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleUpdateInspection(item)}
            >
              <Text style={styles.buttonText}>Update Inspection</Text>
            </TouchableOpacity>

          
            {/* EDIT */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4d94ff" }]}
              onPress={() =>
                navigation.navigate("EditExtinguisher", {
                  extinguisher: item,
                  site,
                  client,
                })
              }
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 16, marginBottom: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  extinguisherName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  addButton: {
  backgroundColor: "green",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 12,
},
addButtonText: {
  color: "#fff",
  fontWeight: "bold",
},
});
