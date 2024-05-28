import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import * as Location from "expo-location";
import * as Network from "expo-network";
import * as Device from "expo-device";
import axios from "axios";

export default function Gps() {
  const [ipAddress, setIpAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [deviceName, setDeviceName] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const ip = await Network.getIpAddressAsync();
        setIpAddress(ip);
      } catch (error) {
        console.error("Error getting IP address:", error);
      }
    };

    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.error("Location permission not granted");
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    const fetchDeviceName = async () => {
      try {
        const name = Device.deviceName;
        setDeviceName(name);
      } catch (error) {
        console.error("Error getting device name:", error);
      }
    };

    fetchIpAddress();
    fetchLocation();
    fetchDeviceName();
  }, []);

  const sendDataToServer = async () => {
    try {
      const newItem = {
        deviceName,
        ipAddress,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      await axios.post("http://localhost:5002/gps", newItem, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: [(data) => {
          const formData = new URLSearchParams();
          for (const key in data) {
            formData.append(key, data[key]);
          }
          return formData.toString();
        }],
      });
      console.log("Data sent to server:", newItem);
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  useEffect(() => {
    if (location && ipAddress && deviceName) {
      sendDataToServer();
    }
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
