import React, { useState, useEffect } from "react";
import {
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
import styles from '../components/styles';

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

  // Search clients and their sites
  const filteredClients = clients.filter((client) => {
    const clientMatch = client.name.toLowerCase().includes(search.toLowerCase());
    const siteMatch = client.sites?.some((site) =>
      site.name.toLowerCase().includes(search.toLowerCase())
    );
    return clientMatch || siteMatch;
  });

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
    <View style={styles.backgroundContainer}>
      {/* Searchbar */}
      <TextInput
        style={styles.input}
        placeholder="Search clients..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Add CLient */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddClientScreen")}
      >
        <Ionicons name="add-circle" size={40} color="#66B166" />
      </TouchableOpacity>

      {/* Client List */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}   // Pull-to-refresh 
        onRefresh={onRefresh}     
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Clients */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.clientSiteCount}>{item.sites.length} sites</Text>
            </TouchableOpacity>

            {/* Widen to Sites if Client is open */}
            {expandedClientId === item.id && (
              <View>
                {item.sites.map((site) => (
                  <TouchableOpacity
                    key={site.id}
                    style={styles.clientSiteCard}
                    onPress={() =>
                      navigation.navigate("SiteDetailScreen", { site, client: item })
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
      />
    </View>
  );
}

