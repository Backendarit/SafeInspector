import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, } from "react-native";
import { useRoute } from "@react-navigation/native";

// Update Inspection and count the next one
function updateInspection(extinguisher) {
  const today = new Date();
  const lastInspection = today.toISOString().split("T")[0];
  const nextInspection = new Date(
    today.setFullYear(today.getFullYear() + extinguisher.intervalYears)
  )
    .toISOString()
    .split("T")[0];

  return {
    ...extinguisher,
    lastInspection,
    nextInspection,
  };
}

  //Show selected Site
export default function SiteDetail({ navigation }) {
  const route = useRoute();
  const { site, client, setClients } = route.params;

  // Update inspection
  const handleUpdateInspection = (extinguisherId) => {
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
                        ext.id === extinguisherId
                          ? updateInspection(ext)
                          : ext
                      ),
                    }
                  : s
              ),
            }
          : c
      )
    );
  };

    // Delete Extinguisher
  const handleDeleteExtinguisher = (extinguisherId) => {
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
  };

  //Show Site details and it's Extinguishers
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{site.name}</Text>
      <Text style={styles.subtitle}>Client: {client.name}</Text>
      <Text>Address: {site.address}</Text>
      <Text>Contact: {site.contact.name}</Text>
      <Text>Phone: {site.contact.phone}</Text>

      <Text style={styles.sectionTitle}>Extinguishers</Text>
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
              onPress={() => handleUpdateInspection(item.id)}
            >
              <Text style={styles.buttonText}>Update Inspection</Text>
            </TouchableOpacity>

            {/* DELETE */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ff4d4d" }]}
              onPress={() => handleDeleteExtinguisher(item.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
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
});
