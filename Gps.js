import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import * as Device from 'expo-device';
import mysql from 'mysql';

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
                console.error('Error getting IP address:', error);
            }
        };

        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Location permission not granted');
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({});
                setLocation(loc);
            } catch (error) {
                console.error('Error getting location:', error);
            }
        };

        const fetchDeviceName = async () => {
            try {
                const name = Device.deviceName;
                setDeviceName(name);
            } catch (error) {
                console.error('Error getting device name:', error);
            }
        };

        fetchIpAddress();
        fetchLocation();
        fetchDeviceName();
    }, []);

    useEffect(() => {
        if (location && ipAddress && deviceName) {
            sendDataToMySQL();
        }
    }, [location, ipAddress, deviceName]);

    const sendDataToMySQL = async () => {
        try {
            const connection = await mysql.createConnection({
                host: 'your_mysql_host',
                user: 'your_mysql_user',
                password: 'your_mysql_password',
                database: 'your_mysql_database'
            });

            const [rows] = await connection.execute(
                'INSERT INTO gps (deviceName, ipAddress, latitude, longitude) VALUES (?, ?, ?, ?)',
                [deviceName, ipAddress, location.coords.latitude, location.coords.longitude]
            );

            console.log('Data sent to MySQL successfully');
            connection.end();
        } catch (error) {
            console.error('Error sending data to MySQL:', error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text selectable>
                GPS Location:
                {location ? (
                    <>
                        {'\n'}Latitude: {location.coords.latitude}
                        {'\n'}Longitude: {location.coords.longitude}
                    </>
                ) : (
                    '\nNo location fetched yet'
                )}
            </Text>
            <Text>IP Address: {ipAddress || 'Fetching IP address...'}</Text>
            <Text>Device Name: {deviceName || 'Fetching device name...'}</Text>
        </View>
    );
}
