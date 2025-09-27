import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function SiteDetail() {
  const route = useRoute();
  const { site, client } = route.params;

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
