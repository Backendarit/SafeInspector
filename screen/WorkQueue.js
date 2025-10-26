import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { calculateNextInspection, calculateServiceDueDate, calculateExtinguisherStatus } from '../backend/utils/extinguisherUtils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../components/styles';
import { BASE_URL } from "../config";
import { Ionicons } from "@expo/vector-icons";


export default function WorkQueue({ clients, setClients }) {

  const navigation = useNavigation();
  // true when user pulls to refresh
  const [refreshing, setRefreshing] = useState(false); 
  //filter for extinguisher list, default "all"
  const [filterExt, setFilterExt] = useState("all"); 
  // today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  //refreshing clients data from backend
  const fetchClients = async () => {
    setRefreshing(true);
    try {
      const response = await fetch (`${BASE_URL}/api/clients`);
      const updatedClients = await response.json();
      setClients(updatedClients);
      } catch (error) {
        console.log(error);
      } finally {
        setRefreshing(false); 
      }
  }; 
  
  //fetch clients every time when screen is opened
  useFocusEffect(
    useCallback(() => {
      fetchClients();
    }, [])
  );

  // extinguisher list combined with clients details and site details
  const extinguisherList = 
    //go through all clients
    clients.flatMap(client =>
      //go trhough all sites of each client
      client.sites.flatMap(site =>
        //go through all extinguishers of each site
        site.extinguishers.map(extinguisher => {
          //calculate next inspection and service due dates
          const nextInspection = calculateNextInspection(extinguisher.lastInspection, extinguisher.intervalYears);
          const serviceDue = calculateServiceDueDate(extinguisher.manufactureYear, extinguisher.lastInspection);

          //temporary extinguisher to calculate status
          const tempExt = {
            ...extinguisher,
            nextInspection,
            serviceDue
          }

          const status = calculateExtinguisherStatus(tempExt);

          //return extinguisher with original data and client+site details and calculated fields
          return {
            ...extinguisher,
            clientId: client.id,
            clientName: client.name,
            siteId: site.id,
            siteName: site.name,
            nextInspection,
            serviceDue,
            status,
          };
        })
      )
    );
 
  // arrange by status and sort by "all", "dueToday" or "late"
  //status order
  const statusOrder = { "Late": 0, "Service Due": 1, "Inspection Due": 2, "OK": 3 };

  let filteredExtList = extinguisherList;

  //extinguishers with status only "dueToday" or "late"
  if (filterExt === "dueToday") {
    filteredExtList = extinguisherList.filter(ext => ext.nextInspection === today);
  } else if (filterExt === "late") {
    filteredExtList = extinguisherList.filter(ext => ext.status === "Late");
  }
  //sort by status order, late first, ok last
  const sortExtinguishersByStatus = [...filteredExtList].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
 

  // Update Extinguisher Status
  const handleStatusUpdate = async (item) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${item.clientId}/sites/${item.siteId}/extinguishers/${item.id}/inspect`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inspectToday: true })
        }
      );

      //message from extinguisherRoutes
      const backendData = await response.json();

      if (!response.ok) {
        console.log("Backend error data:", backendData);
        Alert.alert("Inspection not allowed. Next inspection exceeds service due.");
        return;
      }

      //updated extinguisher data from backend for updating state  and to show new info in alert after update
      const updatedExtinguisherStatus = backendData.extinguisher;

        // update clients data with new extinguisher inspection date
        // everything else remains the same
        setClients(prevClients =>
          prevClients.map(client => 
            //if client matches...
            client.id === item.clientId
              ? {
                  ...client,
                  sites: client.sites.map(site =>
                    //if site matches...
                    site.id === item.siteId
                      ? {
                          ...site,
                          //if extinguisher matches update lastInspection date to today
                          extinguishers: site.extinguishers.map(ext =>
                            ext.id === item.id
                            ? { ...ext, lastInspection: updatedExtinguisherStatus.lastInspection } : ext
                          )
                      }
                    : site
                  )
              }
            : client
          )
        );

        console.log("Backend success response data:", backendData);
        Alert.alert("Success", "Extinguisher inspection updated successfully. New Inspection Date: " + updatedExtinguisherStatus.nextInspection + ', Service Due Date: ' + updatedExtinguisherStatus.serviceDue);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update extinguishers inspection.");
    }
  };

  //get color and icon based on status
  const getStatusStyle = (status) => {
    switch (status) {
      case "OK":
        return { color: "#66B166", icon: "checkmark" };
      case "Inspection Due":
        return { color: "#ffcc00ff", icon: "time-outline" };
      case "Service Due":
        return { color: "#9b59b6", icon: "build" };
      case "Late":
        return { color: "#F45A5A", icon: "alert" };
      default:
        return { color: "#bdc3c7", icon: "help" };
    }
  };

  const renderExtingusher = ({ item }) => {
    const {color, icon} = getStatusStyle(item.status);
    return(
    <View style={styles.card}>
      <TouchableOpacity onPress={() => 
      //when navigating to site detail screen, give props site and client so that clientId and siteId match
        navigation.navigate('SiteDetailScreen', { site: clients.find( c => c.id === item.clientId).sites.find( s => s.id === item.siteId), 
        client: clients.find( c => c.id === item.clientId) })}>
      <View style={styles.siteHeaderRow}> 
        <Text style={styles.siteTitle}>{item.clientName}</Text>
      </View>
      <View style={[styles.statusBubble, { backgroundColor: color }]}>
        <Ionicons name={icon} size={16} color="#ffffffff" />
      </View>
      <View>
        <Text style={styles.siteExtinguisherName}>{item.type} </Text>
        <Text>Site: {item.siteName}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Next Inspection: {item.nextInspection}</Text>
        <Text>Service Due: {item.serviceDue}</Text>
        <Text>Status: {item.status}</Text>
      </View>

      </TouchableOpacity>
      <View style={styles.siteButtonRow}>
        {/* if status is "late", change button color */}
        <TouchableOpacity style = {[styles.siteSmallButton, item.status === "Late" && styles.statusLateButton]} 
          onPress = { () => handleStatusUpdate(item) }>
          {/* if status is "late", change button text */}
          <Text style={styles.siteButtonText}> {item.status === "Late" ? "Inspection Late" : "Update Inspection Status"} </Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <View style={styles.siteContainer}>
      <View>
        <Text style={styles.siteTitle}>Tasks and inspections {today}</Text>
      </View>
      <View style={styles.siteButtonRow}>
        {/* button colors chance based on which button is active  */}
        {["all", "dueToday", "late"].map((filter) => (
          <TouchableOpacity 
            key={filter}
            style={[styles.inspectionButton, filterExt === filter && styles.activeInspButton]} 
            onPress={() => setFilterExt(filter)}>
            <Text style={[styles.inspectionButtonText, filterExt === filter && styles.activeInsButtonText]}> 
              {filter === "all" ? "All" : filter === "dueToday" ? "Due Today" : "Late"} 
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>
      <FlatList
        data={sortExtinguishersByStatus}
        keyExtractor={(item) => `${item.clientId}-${item.siteId}-${item.id}`}
        renderItem={renderExtingusher}
        refreshing={refreshing}
        onRefresh={fetchClients}
        contentContainerStyle={{ paddingBottom: 80 }}
        extraData={filterExt}
      />
      </View>
    </View>
  );
}

