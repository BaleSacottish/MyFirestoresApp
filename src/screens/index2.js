import React, { useEffect, useState } from 'react';
import { SafeAreaView, TextInput, Button, Alert, View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { collection, doc, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';


import { firestore } from '../data/firebaseConfig';

const Index2 = () => {

    const [stations, setStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');

    const [statusPm, setStatusPm] = useState(''); // สำหรับค่า status_pm
    const [statusDatestamp, setStatusDatestamp] = useState(new Date().toISOString()); // ค่าเริ่มต้นของ timestamp

    const [date, setDate] = useState(new Date()); // เก็บค่าวันที่และเวลา
    const [showPicker, setShowPicker] = useState(false); // แสดง/ซ่อน picker


    // const fetchStations = async () => {
    //     try {
    //         const querySnapshot = await getDocs(collection(firestore, 'station_realair'));
    //         const stationsList = querySnapshot.docs.map((doc) => ({
    //             label: doc.data().station_name, // เอา station_name เป็นชื่อ dropdown
    //             value: doc.id, // ใช้ document ID เป็นค่า
    //         }));
    //         setStations(stationsList);
    //     } catch (error) {
    //         console.error('Error fetching stations:', error);
    //         Alert.alert('Error', 'Failed to fetch stations: ' + error.message);
    //     }
    // };

    const fetchStations = async () => {
        try {
            const querySnapshot = await getDocs(collection(firestore, 'station_realair'));
            const stationsList = querySnapshot.docs.map((doc) => ({
                label: doc.data().station_name, // เอา station_name เป็นชื่อ dropdown
                value: doc.id, // ใช้ document ID เป็นค่า
            }));
    
            // Sort stations by `station_name` in ascending order
            const sortedStations = stationsList.sort((a, b) => a.label.localeCompare(b.label));
    
            setStations(sortedStations);
        } catch (error) {
            console.error('Error fetching stations:', error);
            Alert.alert('Error', 'Failed to fetch stations: ' + error.message);
        }
    };


    // ฟังก์ชันเพิ่ม subdocument ไปยัง subcollection 'status'
    // const addSubdocument = async () => {
    //     if (!selectedStation) {
    //         Alert.alert('Error', 'Please select a station first.');
    //         return;
    //     }

    //     try {
    //         const stationRef = doc(firestore, 'station_realair', selectedStation); // อ้างอิง document ที่เลือก
    //         const statusRef = collection(stationRef, 'status'); // อ้างอิง subcollection ที่ชื่อว่า 'status'

    //         await addDoc(statusRef, {
    //             status_pm: parseFloat(statusPm), // แปลงค่าเป็น number
    //             status_datestamp: Timestamp.fromDate(new Date(statusDatestamp)), // แปลงเป็น timestamp
    //         });

    //         Alert.alert('Success', 'Subdocument added to station with ID: ' + selectedStation);
    //     } catch (error) {
    //         console.error('Error adding subdocument:', error);
    //         Alert.alert('Error', 'Failed to add subdocument: ' + error.message);
    //     }
    // };

    const addSubdocument = async () => {
        if (!selectedStation) {
            Alert.alert('Error', 'Please select a station first.');
            return;
        }

        try {
            const stationRef = doc(firestore, 'station_realair', selectedStation); // อ้างอิง document ที่เลือก
            const statusRef = collection(stationRef, 'status'); // อ้างอิง subcollection ที่ชื่อว่า 'status'

            await addDoc(statusRef, {
                status_pm: parseFloat(statusPm), // แปลงค่าเป็น number
                status_datestamp: Timestamp.now(), // ใช้เวลาปัจจุบันเป็น timestamp
            });

            Alert.alert('Success', 'Subdocument added to station with ID: ');
        } catch (error) {
            console.error('Error adding subdocument:', error);
            Alert.alert('Error', 'Failed to add subdocument: ' + error.message);
        }
    };

    // ฟังก์ชันที่ใช้เมื่อเปลี่ยนวันที่
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios'); // ซ่อน picker หลังเลือกวันที่ใน Android
        setDate(currentDate); // ตั้งค่าของวันที่ที่เลือก
    };

    // เรียกใช้ fetchStations เมื่อ component ถูก mount
    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Select Station</Text>
            <RNPickerSelect
                onValueChange={(value) => setSelectedStation(value)}
                items={stations} // ใช้ข้อมูลที่ได้จาก Firestore
                placeholder={{ label: 'Select a station...', value: null }}
            />
            <TextInput
                style={styles.input}
                placeholder="Status PM"
                keyboardType="numeric"
                value={statusPm}
                onChangeText={setStatusPm} // ตั้งค่า status_pm
            />
            {/* ปุ่มเปิด date picker */}
            <Button onPress={() => setShowPicker(true)} title="Select Date and Time" />

            {/* แสดงวันที่ที่เลือก */}
            <Text style={styles.dateText}>
                Selected Date: {date.toLocaleDateString()} {date.toLocaleTimeString()}
            </Text>

            {/* แสดง DateTimePicker เมื่อกดปุ่ม */}
            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="datetime" // ใช้ทั้ง date และ time
                    display="default"
                    onChange={onChange} // เรียกฟังก์ชันเมื่อมีการเปลี่ยนวันที่
                />
            )}
            <Button title="Add Subdocument" onPress={addSubdocument} />
            <View style={styles.selectedStationContainer}>
                <Text style={styles.selectedStationText}>
                    Selected Station ID: {selectedStation}
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default Index2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    selectedStationContainer: {
        marginTop: 20,
    },
    selectedStationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});