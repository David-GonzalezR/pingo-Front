import { Text, View } from "react-native";
import styles from './Styles';
import { useEffect, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';

export default function ClientSearchMapScreen() {
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permiso de ubicación denegado.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest, // Mayor precisión posible
                });

                setLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005, // Zoom más cercano
                    longitudeDelta: 0.005,
                });
            } catch (error) {
                setErrorMsg('No se pudo obtener la ubicación.');
                console.error(error);
            }
        })();
    }, []);

    if (errorMsg) {
        return (
            <View style={styles.container}>
                <Text>{errorMsg}</Text>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.container}>
                <Text>Cargando ubicación...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={location}>
                <Marker coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }} title="Mi ubicación" />
            </MapView>
        </View>
    );
}
