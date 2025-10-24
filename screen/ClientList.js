import React, { useState } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../config";
import styles from "../components/styles";

export default function ClientList({ clients = [], setClients }) {
  const navigation = useNavigation();

  // Search text typed by the user
  const [search, setSearch] = useState("");

  // Page control states
  const [refreshing, setRefreshing] = useState(false); // true when user pulls to refresh
  const [loading, setLoading] = useState(false);       // true when we are loading data
  const [error, setError] = useState(null);            // store error message if fetch fails
  const [expandedClientId, setExpandedClientId] = useState(null); // shows which client is open

  // Get client list from Azure backend
  const fetchClients = async () => {
    if (loading || refreshing) return; // stop if we are already fetching

    setRefreshing(true);
    setError(null);

    try {
      console.log("Getting latest clients from Azure...");
      const response = await fetch(`${BASE_URL}/api/clients`);
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setClients(data); // save the updated list to the main App state
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Could not load client data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  // Search for clients or sites that match the search text
  const filteredClients = clients.filter((client) => {
    const clientMatch = client.name.toLowerCase().includes(search.toLowerCase());
    const siteMatch = client.sites?.some((site) =>
      site.name.toLowerCase().includes(search.toLowerCase())
    );
    return clientMatch || siteMatch;
  });

  // Open or close a client's site list
  const toggleExpand = (id) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };

  // Show a spinner while we wait for the first data
  if (!clients.length && (loading || refreshing)) {
    return (
      <View style={styles.backgroundContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.backgroundContainer}>
      {/* Search bar */}
      <TextInput
        style={styles.input}
        placeholder="Search clients or sites..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Button to add a new client */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddClientScreen")}
      >
        <Ionicons name="add-circle" size={40} color="#66B166" />
      </TouchableOpacity>

      {/* List of all clients (with pull-to-refresh) */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}   // pull to refresh control
        onRefresh={fetchClients}  // when user refreshes
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* 👤 Client info */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.clientSiteCount}>{item.sites.length} sites</Text>
            </TouchableOpacity>

            {/* Show client's sites when opened */}
            {expandedClientId === item.id && (
              <View>
                {item.sites.map((site) => (
                  <TouchableOpacity
                    key={site.id}
                    style={styles.clientSiteCard}
                    onPress={() =>
                      navigation.navigate("SiteDetailScreen", {
                        site,
                        client: item,
                      })
                    }
                  >
                    <Text style={styles.siteExtinguisherName}>• {site.name}</Text>
                    <Text style={styles.clientSiteInfo}>
                      {site.extinguishers.length} extinguishers
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
              No clients found.
            </Text>
          )
        }
      />

      {/* Error message if something goes wrong */}
      {error && (
        <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
