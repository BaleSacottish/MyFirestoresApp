import React, { useState, KeyboardAvoidingView, Platform } from 'react';
import { SafeAreaView, TextInput, Button, Alert, View, StyleSheet, Text } from 'react-native';
import { collection, addDoc, GeoPoint } from 'firebase/firestore';
import { firestore } from '../data/firebaseConfig';


const Index1 = () => {

    const [stationName, setStationName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    const addDocument = async () => {
        try {
            const geoPoint = new GeoPoint(parseFloat(latitude), parseFloat(longitude));

            await addDoc(collection(firestore, 'station_realair'), {
                station_name: stationName,
                station_codinates: geoPoint,
            });

            Alert.alert('Success', 'Document added to station_realair!');
        } catch (error) {
            console.error('Error adding document:', error.message);
            Alert.alert('Error', 'Failed to add document: ' + error.message);
        }
    };


    return (
        <SafeAreaView style={styles.container}>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Station Name"
                    value={stationName}
                    onChangeText={setStationName}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    keyboardType="numeric"
                    value={latitude}
                    onChangeText={setLatitude}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    keyboardType="numeric"
                    value={longitude}
                    onChangeText={setLongitude}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                <Button title="Add Document" onPress={addDocument} />
            </View>


        </SafeAreaView>
    )
}

export default Index1

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});