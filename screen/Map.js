import React, { useState, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { BASE_URL } from "../config";
import styles from "../components/styles";

// Tampere as default region
const DEFAULT_REGION = {
  latitude: 61.4981,
  longitude: 23.7600,
  latitudeDelta: 0.6,
  longitudeDelta: 0.6,
};

export default function Maps({ navigation, clients = [] }) {
    // The map starts from Tampere area
  const [region] = useState(DEFAULT_REGION);
  // Store client data that will be shown on the map
  const [data, setData] = useState(Array.isArray(clients) ? clients : []);

  // Fetch data again every time this screen is opened
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
           // Ask newest client data from the server
          const response = await fetch(`${BASE_URL}/api/clients`);
          const fresh = await response.json();
           // If the data looks correct, save it to state
          if (Array.isArray(fresh)) setData(fresh);
        } catch (error) {
          console.log("Error fetching clients:", error);
        }
      })();
    }, [])
  );

   // Make one list that includes every site from every client
  const allSites = [];
  for (const client of Array.isArray(data) ? data : []) {
    if (!client?.sites) continue; // Skip clients that have no sites
    for (const site of client.sites) {
      allSites.push({ client, site }); // Add the site and remember its client
    }
  }

  // Get pin color based on extinguisher status
  const getPinColor = (site) => {
    const extinguishers = Array.isArray(site.extinguishers)
      ? site.extinguishers
      : [];

    if (extinguishers.length === 0) return "#bdc3c7"; // no extinguishers -> gray

    let hasLate = false;
    let hasServiceDue = false;
    let hasInspectionDue = false;

    for (const e of extinguishers) {
      const status = String(e.status || "").toLowerCase();
      if (status.includes("late")) hasLate = true; // Found late extinguisher
      if (status.includes("service")) hasServiceDue = true;  // Found late extinguisher
      if (status.includes("inspection")) hasInspectionDue = true; // Needs inspection
    }

    if (hasLate) return "#F45A5A"; // late
    if (hasServiceDue) return "#9b59b6"; // service due
    if (hasInspectionDue) return "#ffcc00ff"; // Inspection due
    return "#66B166"; // OK
  };

  return (
    <View style={styles.backgroundContainer}>
      {/* Map that shows all client sites as markers */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider="google"
        region={region}
        showsUserLocation
      >
        {allSites.map(({ client, site }) => {
          const key = `${client.id}:${site.id}`; // Unique key for each site
          const coord = site?.coords
            ? {
                latitude: Number(site.coords.latitude),
                longitude: Number(site.coords.longitude),
              }
            : null;

          // Skip this site if coordinates are missing or wrong
          if (
            !coord ||
            Number.isNaN(coord.latitude) ||
            Number.isNaN(coord.longitude)
          )
            return null;

          const color = getPinColor(site); // Decide the correct marker color

          return (
        <Marker
          key={key}
          coordinate={coord}
          title={site.name}
          onCalloutPress={() =>
            navigation.navigate('Clients', {
              screen: 'SiteDetailScreen',
              params: { site, client },
            })
          }
        >
        <View style={styles.markerWrap}>
          <View style={[styles.statusBubble, { backgroundColor: color }]} />
        </View>
      </Marker>

          );
        })}
      </MapView>
    </View>
  );
}


