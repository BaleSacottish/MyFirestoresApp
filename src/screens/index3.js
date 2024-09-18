import React, { useEffect, useState, KeyboardAvoidingView, Platform } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

import { firestore } from '../data/firebaseConfig';

const Index3 = () => {

    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);

    // const fetchStationsAndStatus = async () => {
    //     try {
    //         const stationsSnapshot = await getDocs(collection(firestore, 'station_realair'));
    //         const stationsData = [];

    //         // วนลูปเอกสารทั้งหมดใน collection station_realair
    //         for (const stationDoc of stationsSnapshot.docs) {
    //             const stationData = stationDoc.data();

    //             // ดึงข้อมูล subcollection 'status'
    //             const statusSnapshot = await getDocs(collection(stationDoc.ref, 'status'));
    //             const statusData = statusSnapshot.docs.map((statusDoc) => ({
    //                 ...statusDoc.data(), // รวมข้อมูล status_pm และ status_datestamp จาก subdocument
    //             }));

    //             // เก็บข้อมูล station พร้อมข้อมูล subcollection status
    //             stationsData.push({
    //                 id: stationDoc.id,
    //                 station_name: stationData.station_name,
    //                 status: statusData, // เก็บข้อมูล subcollection status
    //             });
    //         }

    //         setStations(stationsData); // ตั้งค่าข้อมูล stations ทั้งหมด
    //     } catch (error) {
    //         console.error('Error fetching stations and status:', error);
    //     } finally {
    //         setLoading(false); // ปิด loading หลังดึงข้อมูลเสร็จ
    //     }
    // };

    const fetchStationsAndStatus = async () => {
        try {
            const stationsSnapshot = await getDocs(collection(firestore, 'station_realair'));
            const stationsData = [];

            // Iterate over all documents in the station_realair collection
            for (const stationDoc of stationsSnapshot.docs) {
                const stationData = stationDoc.data();

                // Query to fetch the latest status document with the most recent status_datestamp
                const statusQuery = query(
                    collection(stationDoc.ref, 'status'),
                    orderBy('status_datestamp', 'desc'), // Order by status_datestamp in descending order
                    limit(1) // Limit to 1 document
                );

                const statusSnapshot = await getDocs(statusQuery);
                const statusData = statusSnapshot.docs.map((statusDoc) => ({
                    ...statusDoc.data(), // Spread the status data
                }));

                // If there is a latest status document, add it to the stationsData array
                if (statusData.length > 0) {
                    stationsData.push({
                        id: stationDoc.id,
                        station_name: stationData.station_name,
                        status: statusData[0], // Include only the latest status document
                    });
                }
            }

            setStations(stationsData); // Set the fetched station data
        } catch (error) {
            console.error('Error fetching stations and status:', error);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };


    useEffect(() => {
        fetchStationsAndStatus();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }


    return (
        // <SafeAreaView style={styles.container}>
        //     <ScrollView>
        //         {stations.map((station) => (
        //             <View key={station.id} style={styles.stationContainer}>
        //                 <Text style={styles.stationName}>Station: {station.station_name}</Text>

        //                 {/* แสดงข้อมูลของ subcollection status */}
        //                 {station.status.map((status, index) => (
        //                     <View key={index} style={styles.statusContainer}>
        //                         <Text style={styles.statusText}>
        //                             Status PM: {status.status_pm} μg/m³
        //                         </Text>
        //                         <Text style={styles.statusText}>
        //                             Status Date: {status.status_datestamp ?
        //                                 new Date(status.status_datestamp.seconds * 1000).toLocaleString() :
        //                                 'No timestamp available'}
        //                         </Text>
        //                     </View>
        //                 ))}
        //             </View>
        //         ))}
        //     </ScrollView>
        // </SafeAreaView>
        <SafeAreaView style={styles.container}>

                <ScrollView>
                    {stations.length === 0 ? (
                        <Text>No data available</Text>
                    ) : (
                        stations
                            .sort((a, b) => {
                                // ใช้ Regular Expression เพื่อดึงตัวเลขออกจาก station_name ที่เป็นภาษาไทย
                                const extractNumber = (name) => {
                                    const match = name.match(/\d+/); // ดึงเฉพาะตัวเลขออกมา
                                    return match ? parseInt(match[0], 10) : 0; // แปลงตัวเลขเป็น int หรือคืนค่า 0 ถ้าไม่มีตัวเลข
                                };

                                const stationA = extractNumber(a.station_name);
                                const stationB = extractNumber(b.station_name);

                                return stationA - stationB; // เรียงลำดับจากน้อยไปมาก
                            })
                            .map((station) => (
                                <View key={station.id} style={styles.stationContainer}>
                                    <Text style={styles.stationName}>Station: {station.station_name}</Text>
                                    {/* Handle single status object */}
                                    {station.status ? (
                                        <View style={styles.statusContainer}>
                                            <Text style={styles.statusText}>
                                                Status PM: {station.status.status_pm} μg/m³
                                            </Text>
                                            <Text style={styles.statusText}>
                                                Status Date: {station.status.status_datestamp ?
                                                    new Date(station.status.status_datestamp.seconds * 1000).toLocaleString() :
                                                    'No timestamp available'}
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text>No status available</Text>
                                    )}
                                </View>
                            ))
                    )}
                </ScrollView>



        </SafeAreaView>
    )
}

export default Index3

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    stationContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    stationName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    statusContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    statusText: {
        fontSize: 16,
    },
});
