import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../config";
import styles from '../components/styles';


export default function SiteDetail({ navigation, setClients }) {
  const route = useRoute();
  const { site, client } = route.params;
  const [currentSite, setCurrentSite] = useState(site);
  const [loading, setLoading] = useState(false);

  // Retrieves the latest information
  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedSite = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${BASE_URL}/api/clients/${client.id}`);
          if (!response.ok) throw new Error("Failed to fetch client");

          const updatedClient = await response.json();
          const updatedSite = updatedClient.sites.find((s) => s.id === site.id);
          if (updatedSite) setCurrentSite(updatedSite);
        } catch (err) {
          console.error("Error refreshing site:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUpdatedSite();
    }, [client.id, site.id])
  );

  //  Update Inspection 
  const handleUpdateInspection = async (extinguisher) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}/inspect`,
        { method: "PUT" }
      );

      const data = await response.json();
          // If Service Due is before next Inspection
      if (!response.ok && data.error === "Inspection blocked") {
        Alert.alert(
          "Service Due Approaching",
          data.message,
          [{ text: "OK", style: "default" }]
        );
        return; // do not update
      }

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      // Update localstate
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? {
                ...c,
                sites: c.sites.map((s) =>
                  s.id === site.id
                    ? {
                        ...s,
                        extinguishers: s.extinguishers.map((ext) =>
                          ext.id === extinguisher.id ? data.extinguisher : ext
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
      console.error("Error updating inspection:", err);
      Alert.alert("Error", "Failed to update inspection.");
    } finally {
      setLoading(false);
    }
  };

  // Käyttöliittymä
  return (
    <View style={styles.siteContainer}>
      {/* --- Site Header --- */}
      <View style={styles.siteCard}>
        <View style={styles.siteHeaderRow}>
          <Text style={styles.siteTitle}>{currentSite.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("EditSite", {
                ssite: currentSite,
                client,
              })
            }
          >
            <Ionicons name="pencil" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text>Address: {currentSite.address}</Text>
        <Text>Contact: {currentSite.contact.name}</Text>
        <Text>Phone: {currentSite.contact.phone}</Text>
      </View>
      {/* --- Extinguishers Header with Add Button --- */}
      <View style={styles.siteExtHeader}> 
        <Text style={styles.siteSectionTitle}>Extinguishers</Text>
        <TouchableOpacity
          style={styles.addButton} 
          onPress={() =>
            navigation.navigate("AddExtinguisher", {
              clientId: client.id,
              siteId: currentSite.id,
            })
          }
        >
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="green" />}
      <FlatList
        data={currentSite.extinguishers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.siteCard}>
            <Text style={styles.siteExtinguisherName}>{item.id} {item.type}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Manufacture Year: {item.manufactureYear}</Text>
            <Text>Last Inspection: {item.lastInspection}</Text>
            <Text>Interval: {item.intervalYears} years</Text>
            <Text>Next Inspection: {item.nextInspection}</Text>
            <Text>Service Due: {item.serviceDue}</Text>
            <Text>Status: {item.status}</Text>
            {item.notes ? <Text>Notes: {item.notes}</Text> : null}

            {/* --- Button Row --- */}
            <View style={styles.siteButtonRow}>
              <TouchableOpacity
                style={styles.siteSmallButton}
                onPress={() => handleUpdateInspection(item)}
              >
              <Text style={styles.siteButtonText}>Inspected today</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("EditExtinguisher", {
                    extinguisher: item,
                    site,
                    client,
                  })
                }
              >
              <Ionicons name="pencil" size={22} color="#fff" />
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
    </View>
  );
}

