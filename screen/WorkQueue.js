import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { calculateNextInspection, calculateServiceDueDate, calculateExtinguisherStatus } from '../backend/utils/extinguisherUtils';
import { useNavigation } from '@react-navigation/native';
import styles from '../components/styles';
import { BASE_URL } from "../config";


export default function WorkQueue({ clients, setClients }) {

  const navigation = useNavigation();
  const [filterExt, setFilterExt] = useState("all");
  const today = new Date().toISOString().split("T")[0];

  //useMemo - react hook to memorize calculated extinguisher list
  //recalculates only if clients data changes
  const extinguisherList = useMemo(() => {
    
    // all extinguishers combined with clients details and site details
    //go through all clients
    return clients.flatMap(client =>
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
    //only if clients data changes
  }, [clients]);

  // arrange by status and sort by "all", "dueToday" or "late"
  const sortExtinguishersByStatus = useMemo(() => {
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
    return [...filteredExtList].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  }, [extinguisherList, filterExt]);

    // Update Extinguisher Status
  const handleStatusUpdate = async (item) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/clients/${item.clientId}/sites/${item.siteId}/extinguishers/${item.id}/inspect`,
        {
          method: "PUT",
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
        const updatedExtinguisherStatus = backendData.extinguisher;

        // new version of clients list
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

  const renderExtingusher = ({ item }) => (
    <View style={styles.siteCard}>
      <TouchableOpacity onPress={() => 
      //when navigating to site detail screen, give props site and client so that clientId and siteId match
        navigation.navigate('SiteDetailScreen', { site: clients.find( c => c.id === item.clientId).sites.find( s => s.id === item.siteId), 
        client: clients.find( c => c.id === item.clientId) })}>
      <View style={styles.siteHeaderRow}> 
        <Text style={styles.siteTitle}>{item.clientName}</Text>
      </View>
      <View>
        <Text>Site: {item.siteName}</Text>
        <Text>Location: {item.location}</Text>
        <Text>Next Inspection: {item.nextInspection}</Text>
        <Text>Service Due: {item.serviceDue}</Text>
        <Text>Status: {item.status}</Text>
      </View>
      </TouchableOpacity>
      <View style={styles.siteButtonRow}>
        <TouchableOpacity style = {styles.siteSmallButton} onPress = { () => handleStatusUpdate(item) }>
          <Text style={styles.siteButtonText}> Update Inspection Status </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.siteContainer}>
      <View>
        <Text style={styles.siteTitle}>Tasks and inspections {today}</Text>
      </View>
      <View style={styles.siteButtonRow}>
        <TouchableOpacity style={styles.siteSmallButton} onPress={() => setFilterExt("all")}>
          <Text style={styles.siteButtonText}> All </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.siteSmallButton} onPress={() => setFilterExt("dueToday")}>
          <Text style={styles.siteButtonText}> Due Today </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.siteSmallButton} onPress={() => setFilterExt("late")}>
          <Text style={styles.siteButtonText}> Late </Text>
        </TouchableOpacity>
      </View>
      <View>
      <FlatList
        data={sortExtinguishersByStatus}
        keyExtractor={(item) => `${item.clientId}-${item.siteId}-${item.id}`}
        renderItem={renderExtingusher}
      />
      </View>
    </View>
  );
}

