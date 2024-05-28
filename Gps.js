import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import * as Network from "expo-network";
import Constants from "expo-constants";
import axios from "axios";

export default function Gps() {
  const [ipAddress, setIpAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [deviceName, setDeviceName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const name = Constants.deviceName;

        setIpAddress(ip);
        setLocation(loc);
        setDeviceName(name);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 2 seconds
    const intervalId = setInterval(fetchData, 2000);

    // Clean up the interval
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const sendDataToServer = async () => {
      try {
        if (location && ipAddress && deviceName) {
          const response = await axios.get("http://192.168.3.133:5002/gps");
          const gpsData = response.data;

          const existingDevice = gpsData.find(
            (item) => item.deviceName === deviceName
          );

          if (existingDevice) {
            // If deviceName exists, update existing item with new ipAddress and location
            await axios.put(
              `http://192.168.3.133:5002/gps/${existingDevice.id}`,
              {
                deviceName: existingDevice.deviceName, 
                ipAddress: ipAddress,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            );

            console.log("Updated data on server:", existingDevice);
          } else {
            // If deviceName doesn't exist, add a new item to the server
            const newItem = {
              deviceName: deviceName,
              ipAddress: ipAddress,
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };
            await axios.post("http://192.168.3.133:5002/gps", newItem);
            console.log("Data sent to server:", newItem);
          }
        } else {
          console.error("Location data is not available yet");
        }
      } catch (error) {
        console.error("Error sending data to server:", error);
      }
    };

    const intervalId = setInterval(sendDataToServer, 2000);

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [location, ipAddress, deviceName]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text selectable>
        GPS Location:
        {location ? (
          <>
            {"\n"}Latitude: {location.coords.latitude}
            {"\n"}Longitude: {location.coords.longitude}
          </>
        ) : (
          "\nNo location fetched yet"
        )}
      </Text>
      <Text>IP Address: {ipAddress || "Fetching IP address..."}</Text>
      <Text>Device Name: {deviceName || "Fetching device name..."}</Text>
    </View>
  );
}
