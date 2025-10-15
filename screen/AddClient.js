import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BASE_URL } from "../config";

import styles from '../components/styles';

export default function AddClient({ navigation, clients = [], setClients }) {
  const [selectedClient, setSelectedClient] = useState("new");
  const [clientName, setClientName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false); // load POST

  const handleSave = async () => {
    if (selectedClient === "new" && clientName.trim() === "") {
      Alert.alert("Error", "Please enter a client name.");
      return;
    }
    if (siteName.trim() === "") {
      Alert.alert("Error", "Please enter a site name.");
      return;
    }

    // New Client
    const newClient = {
      name: clientName,
      businessId: "",
      sites: [
        {
          id: Date.now().toString() + "-site",
          name: siteName,
          address,
          contact: { name: contact, phone }, // huom: backend odottaa objektia
          extinguishers: [],
        },
      ],
    };

    setLoading(true);

    // POST to Azure
    try {
      const response = await fetch(`${BASE_URL}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const savedClient = await response.json();

      // Show the new client on client list
      setClients((prev) => [...prev, savedClient.client]);

      // Save to local SQLite for offline reading
      try {
        const { addClient } = await import('../sqlconnection/db');
        await addClient(savedClient.client);
      } catch (e) {
        console.log('SQLite addClient failed', e);
      }

      Alert.alert("Saved!", "Client was added successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("Error saving client:", err);
      Alert.alert("Error", "Failed to save client. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Client or Site</Text>

      <Text style={styles.label}>Select client</Text>
      <Picker
        selectedValue={selectedClient}
        onValueChange={(itemValue) => setSelectedClient(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="New client" value="new" />
        {clients && clients.length > 0
          ? clients.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))
          : null}
      </Picker>

      {selectedClient === "new" && (
        <>
          <Text style={styles.label}>Client name</Text>
          <TextInput
            style={styles.input}
            value={clientName}
            onChangeText={setClientName}
            placeholder="e.g. Sale-R Oy"
          />
        </>
      )}

      <Text style={styles.label}>Site name</Text>
      <TextInput
        style={styles.input}
        value={siteName}
        onChangeText={setSiteName}
        placeholder="e.g. Sale Härmälänranta Tampere"
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="e.g. Lentovarikonkatu 1, 33900 Tampere"
      />

      <Text style={styles.label}>Contact person</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={setContact}
        placeholder="e.g. Maija Menninkäinen"
      />

      <Text style={styles.label}>Phone number</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="040 123 456"
        keyboardType="phone-pad"
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
