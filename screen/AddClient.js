import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function AddClient({ navigation, clients = [], setClients }) {
  const [selectedClient, setSelectedClient] = useState("new");
  const [clientName, setClientName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");

  const handleSave = () => {
    if (selectedClient === "new" && clientName.trim() === "") {
      Alert.alert("Error", "Please enter a client name.");
      return;
    }
    if (siteName.trim() === "") {
      Alert.alert("Error", "Please enter a site name.");
      return;
    }

    if (selectedClient === "new") {
      // luodaan uusi asiakas
      const newClient = {
        id: Date.now().toString(),
        name: clientName,
        sites: [
          {
            id: Date.now().toString() + "-site",
            name: siteName,
            address,
            contact,
            phone,
            extinguishers: [],
          },
        ],
      };
      setClients((prev) => [...prev, newClient]);
    } else {
      // lisätään kohde olemassa olevaan asiakkaaseen
      setClients((prev) =>
        prev.map((c) =>
          c.id === selectedClient
            ? {
                ...c,
                sites: [
                  ...c.sites,
                  {
                    id: Date.now().toString() + "-site",
                    name: siteName,
                    address,
                    contact,
                    phone,
                    extinguishers: [],
                  },
                ],
              }
            : c
        )
      );
    }

    Alert.alert("Saved!", "Data was saved successfully.");
    navigation.goBack();
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
        {clients && clients.length > 0 ? (
          clients.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))
        ) : (
          <Picker.Item label="No clients yet" value="none" />
        )}
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
