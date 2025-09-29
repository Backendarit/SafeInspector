import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "../config";

export default function ClientList() {
  const navigation = useNavigation();
  const route = useRoute();

  // Search bar
  const initialSearch = route.params?.search || "";
  const [search, setSearch] = useState(initialSearch);

  // Client Data
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // lataus-indikaattori
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh state
  const [error, setError] = useState(null); 
  const [expandedClientId, setExpandedClientId] = useState(null);

  // Azure Data
    const fetchClients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/clients`);
        console.log("Fetching:", `${BASE_URL}/api/clients`);

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        console.log("Received data:", data); // debug
        setClients(data); // save data to setClients
        setError(null); // tyhjennä aiemmat virheet onnistuneella fetchillä
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients. Please try again later.");
      } finally {
        setLoading(false); // hide load
        setRefreshing(false); // lopeta refresh-tilanne
      }
    };

  useEffect(() => {
    fetchClients();
  }, []);

  // Search by name
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  // Expand Client to Sites
  const toggleExpand = (id) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };

  // Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  if (loading) {
    // Show loading
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Searchbar */}
      <TextInput
        style={styles.search}
        placeholder="Search clients..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Add CLient */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddClient")}
      >
        <Ionicons name="add-circle" size={28} color="green" />
      </TouchableOpacity>

      {/* Client List */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}   // Pull-to-refresh 
        onRefresh={onRefresh}     
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
            {/* Clients */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.siteCount}>{item.sites.length} sites</Text>
            </TouchableOpacity>

            {/* Widen to Sites if Client is open */}
            {expandedClientId === item.id && (
              <View style={styles.sitesContainer}>
                {item.sites.map((site) => (
                  <TouchableOpacity
                    key={site.id}
                    style={styles.siteCard}
                    onPress={() =>
                      navigation.navigate("SiteDetail", { site, client: item })
                    }
                  >
                    <Text style={styles.siteName}>• {site.name}</Text>
                    <Text style={styles.siteInfo}>
                      {site.extinguishers.length} extinguishers
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2D5D7",
    padding: 15,
  },
  search: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  addButton: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  clientCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  siteCount: {
    fontSize: 14,
    color: "#444",
  },
  sitesContainer: {
    marginTop: 8,
    paddingLeft: 10,
  },
  siteCard: {
    backgroundColor: "#e9f5ff",
    padding: 8,
    marginVertical: 4,
    borderRadius: 6,
  },
  siteName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  siteInfo: {
    fontSize: 13,
    color: "#333",
  },
});
