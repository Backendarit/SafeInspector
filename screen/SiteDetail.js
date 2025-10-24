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
import styles from "../components/styles";

export default function SiteDetail({ navigation, setClients }) {
  const route = useRoute();
  const { site, client } = route.params;

  // Current site data (will update when inspection or edit happens)
  const [currentSite, setCurrentSite] = useState(site);

  // Loading spinner control
  const [loading, setLoading] = useState(false);

  // Latest site data when opened
  useFocusEffect(
    useCallback(() => {
      const fetchUpdatedSite = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}/api/clients/${client.id}`);
          if (response.ok) {
            const updatedClient = await response.json();
            const updatedSite = updatedClient.sites.find((s) => s.id === site.id);
            if (updatedSite) setCurrentSite(updatedSite);
          }
          // If fetch fails, keep the local data instead of crashing
        } catch (err) {
          console.warn("Failed to refresh site data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchUpdatedSite();
    }, [client.id, site.id, setClients])
  );

  /**
   * Handle "Inspected today" button press.
   * Sends a POST request to backend to mark extinguisher as inspected today.
   * Updates both the global client list and this screen's local state.
   */
  const handleUpdateInspection = async (extinguisher) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${client.id}/sites/${site.id}/extinguishers/${extinguisher.id}/inspect`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      const data = await response.json();

      // If backend reports that the extinguisher cannot be inspected yet
      if (!response.ok && data.error === "Inspection blocked") {
        Alert.alert(
          "Service Due Approaching",
          data.message,
          [{ text: "OK", style: "default" }]
        );
        return;
      }

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      // Update client list
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

      // Update local site state for this screen
      setCurrentSite((prev) => ({
        ...prev,
        extinguishers: prev.extinguishers.map((ext) =>
          ext.id === extinguisher.id ? data.extinguisher : ext
        ),
      }));

      Alert.alert("Success", "Inspection updated successfully.");
    } catch (err) {
      console.error("Error updating inspection:", err);
      Alert.alert("Error", "Failed to update inspection.");
    } finally {
      setLoading(false);
    }
  };

  //Color and icon for extinguishers status.
  const getStatusStyle = (status) => {
    switch (status) {
      case "OK":
        return { color: "#66B166", icon: "checkmark" };
      case "Inspection Due":
        return { color: "#ffcc00ff", icon: "time-outline" };
      case "Service Due":
        return { color: "#9b59b6", icon: "build" };
      case "Late":
        return { color: "#F45A5A", icon: "alert" };
      default:
        return { color: "#bdc3c7", icon: "help" };
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      {/* Site Header */}
      <View style={styles.card}>
        <View style={styles.siteHeaderRow}>
          <Text style={styles.clientName}>{currentSite.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("SiteUpdateScreen", {
                ssite: currentSite,
                client,
              })
            }
          >
            <Ionicons name="pencil" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.textDetails}>Address: {currentSite.address}</Text>
        <Text style={styles.textDetails}>Contact: {currentSite.contact.name}</Text>
        <Text style={styles.textDetails}>Phone: {currentSite.contact.phone}</Text>
      </View>

      {/* Extinguisher header with Add button */}
      <View style={styles.siteExtHeader}>
        <Text style={styles.clientName}>Extinguishers</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddExtinguisherScreen", {
              clientId: client.id,
              siteId: currentSite.id,
            })
          }
        >
          <Ionicons name="add-circle" size={40} color="#66B166" />
        </TouchableOpacity>
      </View>

      {/* Loading indicator when waiting for response */}
      {loading && <ActivityIndicator size="large" color="green" />}

      {/* List of all extinguishers */}
      <FlatList
        data={currentSite.extinguishers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const { color, icon } = getStatusStyle(item.status);

          return (
            <View style={styles.card}>
              {/* Header row with status icon */}
              <View style={styles.extinguisherStatus}>
                <View style={[styles.statusBubble, { backgroundColor: color }]}>
                  <Ionicons name={icon} size={16} color="#fff" />
                </View>
                <Text style={styles.siteExtinguisherName}>
                  {item.id} {item.type}
                </Text>
              </View>

              {/* Extinguisher details */}
              <Text>Location: {item.location}</Text>
              <Text>Manufacture Year: {item.manufactureYear}</Text>
              <Text>Last Inspection: {item.lastInspection}</Text>
              <Text>Interval: {item.intervalYears} years</Text>
              <Text>Next Inspection: {item.nextInspection}</Text>
              <Text>Service Due: {item.serviceDue}</Text>
              <Text>Status: {item.status}</Text>
              {item.notes ? <Text>Notes: {item.notes}</Text> : null}

              {/* Button Row */}
              <View style={styles.siteButtonRow}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleUpdateInspection(item)}
                >
                  <Text style={styles.saveText}>Inspected today</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("EditExtinguisherScreen", {
                      extinguisher: item,
                      site,
                      client,
                    })
                  }
                >
                  <Ionicons name="pencil" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
