import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';
import styles from './Styles';
import { GoogleMapsApiKey } from "../../../../data/sources/remote/api/googleMapsApiKey";
import debounce from 'lodash/debounce';

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
    const [origin, setOrigin] = useState<{ address: string; lat: string; lng: string } | null>(null);
    const [destination, setDestination] = useState<{ address: string; lat: string; lng: string } | null>(null);
    const [focusedField, setFocusedField] = useState<"origin" | "destination">("origin");
    const [adress, setAdress] = useState<"pass" | "restring">("pass");
    const [pinImage, setPinImage] = useState(require('../../../../assets/person_location.png'));
    


    useEffect(() => {
        if (focusedField === "origin") {
            setPinImage(require('../../../../assets/person_location.png')); // Imagen roja si es origen
        } else {
            setPinImage(require('../../../../assets/alfiler.png')); // Imagen azul si es destino
        }
if(origin!== null && destination !== null){
    console.log("viaje completado")
    console.log( origin)
    console.log( destination)
}
 

    }, [focusedField, origin, destination]);
    
    useEffect(() => {
        (async () => {
                  

            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permiso de ubicación denegado.');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

                const region = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                };

                setLocation(region);           

           
                    fetchAddress(region.latitude, region.longitude, focusedField);
             
                
                
                
            } catch (error) {
                setErrorMsg('No se pudo obtener la ubicación.');
            }
        })();
    }, []); 


    const fetchAddress = async (latitude: number, longitude: number, field: "origin" | "destination") => {
        if(adress==="pass"){
        try {
            const response = await fetch(`${REVERSE_GEOCODE_URL}?latlng=${latitude},${longitude}&key=${API_KEY}`);
            const result = await response.json();
    
            if (result.status === "OK" && result.results.length > 0) {
                let placeName = "Ubicación desconocida"; 
    
                // 1️⃣ Buscar un resultado que tenga un "name"
                const placeWithName = result.results.find((r: any) => r.name);
                if (placeWithName) {
                    placeName = placeWithName.name; // Preferir el nombre del lugar
                } else {
                    // 2️⃣ Si no hay "name", buscar la "formatted_address"
                    const placeWithAddress = result.results.find((r: any) => r.formatted_address);
                    if (placeWithAddress) {
                        placeName = placeWithAddress.formatted_address;
                    }
                }
    
                if (field === "origin") {
                    setInput(`📍 ${placeName}`);
                    setOrigin({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                } else {
                    setDestinationInput(`📍 ${placeName}`);
                    setDestination({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                }
            } else {
                if (field === "origin") setInput("📍 Dirección no disponible");
                else setDestinationInput("📍 Dirección no disponible");
            }
        } catch (error) {
            console.error("⚠️ Error obteniendo dirección:", error);
            if (field === "origin") setInput("📍 Error al obtener la dirección");
            else setDestinationInput("📍 Error al obtener la dirección");
        }
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

    const fetchPlaceDetails = async (placeId: string, isDestination = false, placeName: string) => {

        if (focusedField) {
        try {
            const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${API_KEY}`);
            const result = await response.json();

            if (result.location) {
                const { latitude, longitude } = result.location;


                const newRegion = {
                    latitude,
                    longitude,
                    latitudeDelta: 0.0001,
                    longitudeDelta: LONGITUDE_DELTA,
                };
                const locationData = {
                    address: placeName,
                    lat: latitude.toString(),
                    lng: longitude.toString(),
                };

                if (isDestination) {
                    setDestinationLocation(newRegion);
                    setDestinationSuggestions([]); // Cerrar lista de sugerencias
                    setDestinationInput(placeName);
                    mapRef.current?.animateToRegion(newRegion, 1000); // Guardar el nombre en el input de destino
                    setDestination({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                    setAdress("restring")
                } else {
                    setLocation(newRegion);
                    setSuggestions([]); // Cerrar lista de sugerencias
                    setInput(placeName); // Guardar el nombre en el input de origen
                    mapRef.current?.animateToRegion(newRegion, 1000);
                    setOrigin({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                    setAdress("restring")
                }
               
            }
        } catch (error) {
            console.error("⚠️ Error obteniendo detalles del lugar:", error);
        }
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
                onFocus={() => setFocusedField("origin")}
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
                            <TouchableOpacity
                                onPress={debounce(() => fetchPlaceDetails(
                                    item.placePrediction.placeId,
                                    false,
                                    mainText  || "Ubicación desconocida"
                                ), 200)}
                            >
                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", backgroundColor: "white" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                        {item.placePrediction.structuredFormat?.mainText?.text || "Sin nombre"}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "gray" }}>
                                        {item.placePrediction.structuredFormat?.secondaryText?.text || "Sin ubicación"}
                                    </Text>
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
                onFocus={() => setFocusedField("destination")}
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
                            <TouchableOpacity
                                onPress={debounce(() => fetchPlaceDetails(
                                    item.placePrediction.placeId,
                                    true,
                                    destinationMainText  || "Ubicación desconocida"
                                ), 200)}
                            >
                                <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", backgroundColor: "white" }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                        {item.placePrediction.structuredFormat?.mainText?.text || "Sin nombre"}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: "gray" }}>
                                        {item.placePrediction.structuredFormat?.secondaryText?.text || "Sin ubicación"}
                                    </Text>
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
                        fetchAddress(region.latitude, region.longitude, focusedField);
                        setAdress("pass")
                        
                    
                    }}
                />
                <View style={styles.pinContainer}>
                <Image source={pinImage} style={styles.pin} />

                </View>
            </View>
        </View>
    );
}
