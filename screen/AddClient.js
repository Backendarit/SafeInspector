import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../config";
import { saveClients } from "../sqlconnection/db"; 

import styles from '../components/styles';

// Screen for adding a new client or adding a new site to an existing client
export default function AddClient({ navigation, clients = [], setClients }) {
  // State variables to store the form values the user types in
  const [selectedClient, setSelectedClient] = useState("new"); //Default: "new client"
  const [clientName, setClientName] = useState(""); //For new client name
  const [businessId, setBusinessId] = useState(""); // For new client business ID
  const [siteName, setSiteName] = useState(""); //Every new client must include one site
  const [address, setAddress] = useState(""); //Site address
  const [contact, setContact] = useState(""); // Contact person name  
  const [phone, setPhone] = useState(""); //Contact phone number
  const [latitude, setLatitude] = useState("");  //Optional coordinate (latitude) for map
  const [longitude, setLongitude] = useState("");  //Optiona coordinate (longitude) for map
  const [loading, setLoading] = useState(false); // Shows loading state while POST request is happening

  
  const handleSave = async () => {
    //Make sure required fields are filled
    if (selectedClient === "new" && clientName.trim() === "") {
      Alert.alert("Error", "Please enter a client name.");
      return;
    }
    if (siteName.trim() === "") {
      Alert.alert("Error", "Please enter a site name.");
      return;
    }

    // Convert coordinates to numbers only if they are typed correctly
    const latNum = latitude === "" ? null : Number(latitude);
    const lngNum = longitude === "" ? null : Number(longitude);
    const hasCoords =
      typeof latNum === "number" &&
      typeof lngNum === "number" &&
      !Number.isNaN(latNum) &&
      !Number.isNaN(lngNum);

    setLoading(true);

    try {
      let response;
      // If user chooses "new client"
      if (selectedClient === "new") {
        const newClient = {
          name: clientName,
          businessId,
          sites: [
            {
              id: Date.now().toString() + "-site", // Unique ID for new site
              name: siteName,
              address,
              contact: { name: contact, phone },
              extinguishers: [], // New site starts without extinguishers
              ...(hasCoords ? { coords: { latitude: latNum, longitude: lngNum } } : {}), // Add map coordinates only if valid
            },
          ],
        };
      //POST to Azure backend: create a new client that includes one initial site
        response = await fetch(`${BASE_URL}/api/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });
      } else {
        // Add a new site to an existing client
        const newSite = {
          name: siteName,
          address,
          contact: { name: contact, phone },
          extinguishers: [],
          ...(hasCoords ? { coords: { latitude: latNum, longitude: lngNum } } : {}), // Add map coordinates only if valid
        };
        // Sent to backend: add site to existing client
        response = await fetch(`${BASE_URL}/api/clients/${selectedClient}/sites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSite),
        });
      }

      if (!response.ok) {
        const txt = await response.text().catch(() => "");
        throw new Error(`Server error: ${response.status} ${txt}`);
      }

      const data = await response.json();

      //Fetch the full updated client list after successful POST
      const listRes = await fetch(`${BASE_URL}/api/clients`);
      if (!listRes.ok) throw new Error("Fetching updated list failed.");
      const latest = await listRes.json();

      // Update React state and save full list to SQLite (offline database)
      setClients(latest);
      await saveClients(latest);

      Alert.alert("Success", "Data saved successfully!");
      navigation.goBack();
    } catch (err) {
      console.error("Error saving client/site:", err);
      Alert.alert("Error", "Failed to save data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.backgroundContainer}> 
  {/* Select existing client or choose to create a new one */}
      <Text style={styles.label}>Select client</Text>
      <Picker
        selectedValue={selectedClient}
        onValueChange={(itemValue) => setSelectedClient(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="New client" value="new" />
         {/* Show all clients in dropdown if available */}
        {clients && clients.length > 0
          ? clients.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))
          : null}
      </Picker>
    
{/* These fields are only visible if adding a new client */}
      {selectedClient === "new" && (
        <>
          <Text style={styles.label}>Client name</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="e.g. Sale-R Oy"
          />
          <Text style={styles.label}>Business ID</Text>
          <TextInput
            style={styles.input}
            value={businessId}
            onChangeText={setBusinessId}
            placeholder="e.g. 1234567-8"
          />
        </>
      )}


    {/* Always needed when adding a new site */}
     {/* Site name */}
      <Text style={styles.label}>Site name</Text>
      <TextInput
        style={styles.input}
        value={siteName}
        onChangeText={setSiteName}
        placeholder="e.g. Sale Härmälänranta Tampere"
      />
       {/* Address*/}
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="e.g. Lentovarikonkatu 1, 33900 Tampere"
      />
         {/* Contact person*/}
      <Text style={styles.label}>Contact person</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={setContact}
        placeholder="e.g. Maija Menninkäinen"
      />
         {/* Phone number */}
      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="040 123 456"
        keyboardType="phone-pad"
      />

      {/* Coordinate fields (optional) */}
      <Text style={styles.label}>Latitude (optional)</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="e.g. 61.4981"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Longitude (optional)</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="e.g. 23.7600"
        keyboardType="numeric"
      />

       {/* Save button */}
      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
