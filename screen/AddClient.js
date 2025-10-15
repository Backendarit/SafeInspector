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
  const [businessId, setBusinessId] = useState("");
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

    setLoading(true);

    try {
      let response;

      if (selectedClient === "new") {
        // New Client
        const newClient = {
          name: clientName,
          businessId, // use form value
          sites: [
            {
              id: Date.now().toString() + "-site",
              name: siteName,
              address,
              contact: { name: contact, phone },
              extinguishers: [],
            },
          ],
        };

        // POST to Azure
        response = await fetch(`${BASE_URL}/api/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClient),
        });
      } else {
        // New Site to old Client
        const newSite = {
          name: siteName,
          address,
          contact: { name: contact, phone },
          extinguishers: [],
        };

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

      // Show new client on clientlist
      if (data.client) {
        setClients((prev) => [...prev, data.client]);

        // Save to local SQLite
        try {
          const { addClient } = await import('../sqlconnection/db');
          await addClient(data.client);
        } catch (e) {
          console.log('SQLite addClient failed', e);
        }

      } else if (data.site) {
        // New site added to existing client
        setClients((prev) =>
          prev.map((c) =>
            String(c.id) === String(selectedClient)
              ? { ...c, sites: [...c.sites, data.site] }
              : c
          )
        );

        // Find updated client and save to SQLite
        const updatedClient = clients.find((c) => String(c.id) === String(selectedClient));
        if (updatedClient) {
          const newClientData = {
            ...updatedClient,
            sites: [...updatedClient.sites, data.site],
          };
          try {
            const { addClient } = await import('../sqlconnection/db');
            await addClient(newClientData);
          } catch (e) {
            console.log('SQLite addClient failed', e);
          }
        }
      }

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
          <Text style={styles.label}>Business ID</Text>
          <TextInput
            style={styles.input}
            value={businessId}
            onChangeText={setBusinessId}
            placeholder="e.g. 1234567-8"
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
