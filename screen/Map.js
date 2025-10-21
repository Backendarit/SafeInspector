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
  const [region] = useState(DEFAULT_REGION);
  const [data, setData] = useState(Array.isArray(clients) ? clients : []);

  // Fetch data again every time this screen is opened
  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const response = await fetch(`${BASE_URL}/api/clients`);
          const fresh = await response.json();
          if (Array.isArray(fresh)) setData(fresh);
        } catch (error) {
          console.log("Error fetching clients:", error);
        }
      })();
    }, [])
  );

  // Build site list
  const allSites = [];
  for (const client of Array.isArray(data) ? data : []) {
    if (!client?.sites) continue;
    for (const site of client.sites) {
      allSites.push({ client, site });
    }
  }

  // Get pin color based on extinguisher status
  const getPinColor = (site) => {
    const extinguishers = Array.isArray(site.extinguishers)
      ? site.extinguishers
      : [];

    if (extinguishers.length === 0) return "gray"; // no extinguishers -> gray

    let hasLate = false;
    let hasServiceDue = false;

    for (const e of extinguishers) {
      const status = String(e.status || "").toLowerCase();
      if (status.includes("late")) hasLate = true;
      if (status.includes("service")) hasServiceDue = true;
    }

    if (hasLate) return "red"; // late
    if (hasServiceDue) return "orange"; // service due
    return "green"; // OK
  };

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider="google"
        region={region}
        showsUserLocation
      >
        {allSites.map(({ client, site }) => {
          const key = `${client.id}:${site.id}`;
          const coord = site?.coords
            ? {
                latitude: Number(site.coords.latitude),
                longitude: Number(site.coords.longitude),
              }
            : null;
          if (
            !coord ||
            Number.isNaN(coord.latitude) ||
            Number.isNaN(coord.longitude)
          )
            return null;

          const color = getPinColor(site);

          return (
            <Marker
              key={key}
              coordinate={coord}
              title={site.name} 
              onCalloutPress={() =>
                navigation.navigate("SiteDetailScreen", { site, client })
              }
            >
              <View style={styles.markerWrap}>
                <View style={[styles.markerDot, { backgroundColor: color }]} />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}


