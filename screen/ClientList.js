import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { clients } from "../data/clientsData";

export default function ClientList() {
  const navigation = useNavigation();
  const route = useRoute();

  const initialSearch = route.params?.search || "";
  const [search, setSearch] = useState(initialSearch);

  const [expandedClientId, setExpandedClientId] = useState(null);

  // Suodata asiakkaat
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedClientId(expandedClientId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Hakukenttä */}
      <TextInput
        style={styles.search}
        placeholder="Search clients..."
        value={search}
        onChangeText={setSearch}
      />
      {/* Lisää asiakas */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddClient")}
      >
        <Ionicons name="add-circle" size={28} color="green" />
      </TouchableOpacity>

      {/* Lista asiakkaista */}
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.clientCard}>
            {/* Asiakas */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text style={styles.clientName}>{item.name}</Text>
              <Text style={styles.siteCount}>{item.sites.length} sites</Text>
            </TouchableOpacity>

            {/* Kohteet näkyviin jos asiakas avattu */}
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
