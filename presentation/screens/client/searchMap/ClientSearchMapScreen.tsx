import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';
import styles from './Styles';
import { GoogleMapsApiKey } from "../../../../data/sources/remote/api/googleMapsApiKey";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const API_URL = "https://places.googleapis.com/v1/places:autocomplete";
const REVERSE_GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = GoogleMapsApiKey; 

export default function ClientSearchMapScreen() {
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [input, setInput] = useState(""); 
    const [suggestions, setSuggestions] = useState<any[]>([]); 
    const [destinationInput, setDestinationInput] = useState(""); // NUEVO
    const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]); // NUEVO
    const [destinationLocation, setDestinationLocation] = useState<Region | undefined>(undefined); // NUEVO
    const mapRef = React.useRef<MapView>(null);

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permiso de ubicación denegado.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
                console.log(`📍 Ubicación inicial: Latitud ${location.coords.latitude}, Longitud ${location.coords.longitude}`);

                const region = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };

                setLocation(region);
                fetchAddress(region.latitude, region.longitude);
            } catch (error) {
                setErrorMsg('No se pudo obtener la ubicación.');
                console.error(error);
            }
        })();
    }, []);

    const fetchAddress = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(`${REVERSE_GEOCODE_URL}?latlng=${latitude},${longitude}&key=${API_KEY}`);
            const result = await response.json();

            if (result.status === "OK" && result.results.length > 0) {
                const formattedAddress = result.results[0].formatted_address;
                setInput(`📍 ${formattedAddress}`); 
                console.log(`📍 Ubicación obtenida: Latitud ${latitude}, Longitud ${longitude}`);
            } else {
                setInput("📍 Dirección no disponible");
            }
        } catch (error) {
            console.error("⚠️ Error obteniendo dirección:", error);
            setInput("📍 Error al obtener la dirección");
        }
    };

    const fetchAutocompleteSuggestions = async (text: string, isDestination = false) => { // MODIFICADO
        if (text.length < 3) {
            isDestination ? setDestinationSuggestions([]) : setSuggestions([]);
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": API_KEY,
                    "X-Goog-FieldMask": "suggestions.placePrediction"
                },
                body: JSON.stringify({
                    input: text,
                    languageCode: "es",
                    locationBias: {
                        circle: {
                            center: {
                                latitude: location?.latitude,
                                longitude: location?.longitude
                            },
                            radius: 10000.0 
                        }
                    }
                })
            });

            const result = await response.json();
            isDestination ? setDestinationSuggestions(result.suggestions || []) : setSuggestions(result.suggestions || []);
        } catch (error) {
            console.error("⚠️ Error en Autocomplete:", error);
        }
    };

    const fetchPlaceDetails = async (placeId: string, isDestination = false) => { // MODIFICADO
        try {
            const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${API_KEY}`);
            const result = await response.json();

            if (result.location) {
                const { latitude, longitude } = result.location;
                console.log(`📍 Ubicación seleccionada: Latitud ${latitude}, Longitud ${longitude}`);

                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0001,
                    longitudeDelta: LONGITUDE_DELTA,
                };

                if (isDestination) {
                    setDestinationLocation(newRegion);
                    setDestinationSuggestions([]); 
                } else {
                    setLocation(newRegion);
                    setSuggestions([]); 
                    mapRef.current?.animateToRegion(newRegion, 1000);
                    fetchAddress(latitude, longitude);
                }
            }
        } catch (error) {
            console.error("⚠️ Error obteniendo detalles del lugar:", error);
        }
    };

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
                                          /*  Campo para la dirección de origen */
        
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Recoger en..."
                value={input}
                onChangeText={(text) => {
                    setInput(text);
                    fetchAutocompleteSuggestions(text);
                }}
            />

            {suggestions.length > 0 && (
                <FlatList
                    data={suggestions}
                    keyExtractor={(item) => item.placePrediction.placeId}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => {
                        const mainText = item.placePrediction.structuredFormat?.mainText?.text || "Sin nombre";
                        const secondaryText = item.placePrediction.structuredFormat?.secondaryText?.text || "Sin ubicación";

                        return (
                            <TouchableOpacity onPress={() => fetchPlaceDetails(item.placePrediction.placeId)}>
                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", backgroundColor: "white" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{mainText}</Text>
                                    <Text style={{ fontSize: 14, color: "gray" }}>{secondaryText}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

            {/*  Campo para la dirección de destino */}
            <TextInput
                style={styles.input}
                placeholder="Destino..."
                value={destinationInput}
                onChangeText={(text) => {
                    setDestinationInput(text);
                    fetchAutocompleteSuggestions(text, true);
                }}
            />

            {destinationSuggestions.length > 0 && (
                <FlatList
                    data={destinationSuggestions}
                    keyExtractor={(item) => item.placePrediction.placeId}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => {
                        const destinationMainText = item.placePrediction.structuredFormat?.mainText?.text || "Sin nombre";
                        const destinationSecondaryText = item.placePrediction.structuredFormat?.secondaryText?.text || "Sin ubicación";

                        return (
                            <TouchableOpacity onPress={() => fetchPlaceDetails(item.placePrediction.placeId)}>
                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", backgroundColor: "white" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>{destinationMainText}</Text>
                                    <Text style={{ fontSize: 14, color: "gray" }}>{destinationSecondaryText}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}

<View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={location}
                    onRegionChangeComplete={(region) => {
                        setLocation(region);
                        fetchAddress(region.latitude, region.longitude);
                    }}
                />
                <View style={styles.pinContainer}>
                    <Image source={require('../../../../assets/pin_red.png')} style={styles.pin} />
                </View>
            </View>
        </View>
    );
}
