import React, { useEffect, useState } from "react";
import { Text, View, TextInput, FlatList, TouchableOpacity, Image, Dimensions, Keyboard } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';
import { styles } from './Styles';
import { GoogleMapsApiKey } from "../../../../data/sources/remote/api/googleMapsApiKey";
import debounce from 'lodash/debounce';
import { Polyline } from "react-native-maps";
import DefaultRoundedButton from "../../../componets/DefaultRoundedButton";
import { LinearGradient } from "expo-linear-gradient";
import { green } from "react-native-reanimated/lib/typescript/Colors";
const polyline = require("@mapbox/polyline");

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
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
    const [ocultarData, setOcultarData] = useState<"ok" | "none">("none");
    const [pinImage, setPinImage] = useState(require('../../../../assets/person_location.png'));
    const [routeData, setRouteData] = useState<{ polyline: number[][], distance: number, duration: string } | null>(null);


    useEffect(() => {



        console.log("focus:", focusedField)

        if (focusedField === "origin") {
            setPinImage(require('../../../../assets/person_location.png')); // Imagen roja si es origen
        } else {
            setPinImage(require('../../../../assets/alfiler.png')); // Imagen azul si es destino
        }
        if (origin !== null && destination !== null) {
            console.log("viaje completado")
            console.log(origin)
            console.log(destination)
            setAdress("restring")
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

    const calcularPrecio = (distancia: number, duracion: string): string => {
        if (!distancia || !duracion) return "0";

        // Convertir duración de "527s" a número
        const segundos = Number(duracion.slice(0, -1));

        // Cálculo del precio
        const precio = (distancia * 1.8) + (segundos * 2.5);

        // Redondear al múltiplo de 100 más cercano
        const precioRedondeado = Math.round(precio / 100) * 100;

        // Formatear como moneda (7.000 en lugar de 7000)
        return precioRedondeado.toLocaleString("es-CO");
    };

    const fetchAddress = async (latitude: number, longitude: number, field: "origin" | "destination") => {
        if (adress === "pass") {
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
                            // 🔹 Dividir la dirección y quitar departamento y país
                            const addressParts = placeWithAddress.formatted_address.split(",");
                            if (addressParts.length >= 2) {
                                placeName = `${addressParts[0]}, ${addressParts[1]}`.trim(); // Solo dirección y ciudad
                            } else {
                                placeName = placeWithAddress.formatted_address; // En caso de que no se pueda dividir bien
                            }
                        }
                    }

                    if (field === "origin") {
                        setInput(placeName);
                        setOrigin({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                        setOcultarData("none")

                    } else {
                        setDestinationInput(placeName);
                        setDestination({ address: placeName, lat: latitude.toString(), lng: longitude.toString() });
                        setOcultarData("none")
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




    const fetchAutocompleteSuggestions = async (text: string, isDestination = false) => {
        setOcultarData("ok")
        console.log("en autocomplete: ", focusedField)

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
                        latitudeDelta: LATITUDE_DELTA,
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


    //implementacion dibujar ruta
    const fetchRoute = async () => {
        if (!origin || !destination) {
            console.log("⚠️ Debes seleccionar un origen y un destino.");
            return;
        }

        try {
            const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": API_KEY,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline",
                },
                body: JSON.stringify({
                    origin: {
                        location: {
                            latLng: {
                                latitude: parseFloat(origin.lat), // Se usa la variable origin
                                longitude: parseFloat(origin.lng)
                            }
                        }
                    },
                    destination: {
                        location: {
                            latLng: {
                                latitude: parseFloat(destination.lat), // Se usa la variable destination
                                longitude: parseFloat(destination.lng)
                            }
                        }
                    },
                    travelMode: "DRIVE"
                })
            });

            const result = await response.json();
            console.log("Ruta calculada:", result);

            if (result.routes && result.routes.length > 0) {
                const route = result.routes[0];

                console.log("Duración:", route.duration);
                console.log("Distancia:", route.distanceMeters, "metros");

                // Decodificar la polyline y almacenarla en el estado
                const decodedPolyline = polyline.decode(route.polyline.encodedPolyline);
                setRouteData({ polyline: decodedPolyline, distance: route.distanceMeters, duration: route.duration });

                if (mapRef.current && decodedPolyline.length > 0) {
                    mapRef.current.fitToCoordinates(decodedPolyline, {
                        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // Espacio alrededor de la ruta
                        animated: true, // Suaviza la animación
                    });
                }


                <Polyline
                    coordinates={decodedPolyline}
                    strokeColor="blue" // Cambia el color a uno más visible
                    strokeWidth={6} // Aumenta el grosor de la línea
                />

                mapRef.current?.fitToCoordinates(decodedPolyline, {
                    edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                    animated: true,
                });


            } else {
                console.log("⚠️ No se pudo calcular la ruta.");
            }
        } catch (error) {
            console.error("⚠️ Error obteniendo la ruta:", error);
        }
    };




    if (!location) {
        return (
            <View style={styles.container}>
                <Text>Cargando ubicación...</Text>
            </View>
        );
    }

    return (

        <View style={styles.container}>
            {/* Mapa en la parte superior */}
            <View style={styles.mapContainer}>
                <MapView
               
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={location}
                    onRegionChangeComplete={(region) => {
                        setLocation(region);
                        fetchAddress(region.latitude, region.longitude, focusedField);
                        setAdress("pass");
                    }}
                >
                    {origin && (
                        <Marker
                            coordinate={{ latitude: parseFloat(origin.lat), longitude: parseFloat(origin.lng) }}
                            title="Origen"
                        >
                            <View style={styles.circleMarker} />
                        </Marker>
                    )}
                    {destination && (
                        <Marker
                            coordinate={{ latitude: parseFloat(destination.lat), longitude: parseFloat(destination.lng) }}
                            title="Destino"
                        >
                            <View style={styles.squareMarker} />
                        </Marker>
                    )}
                    {routeData && (
                        <Polyline
                            coordinates={routeData.polyline.map(([latitude, longitude]) => ({ latitude, longitude }))}
                            strokeWidth={5}
                            strokeColor="blue"
                        />
                    )}
                </MapView>
                <View style={styles.pinContainer}>
                    <Image source={pinImage} style={styles.pin} />
                </View>
            </View>

            {/* Contenedor de elementos en la parte inferior */}
            <LinearGradient
  colors={['#000000', '#333333', '#666666', '#000000']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{width:"100%", borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
  >
            <View style={styles.controlsContainer}>
                {/* Campo para la dirección de origen */}


                <View style={styles.containersuggestion}>

                    <View style={[styles.rutaContainer, ocultarData=== "ok" && {display:"none"}]}>
                        <Image source={require('../../../../assets/image-ruta.png')} style={styles.imgRuta} />
                    </View>
                    <View style={styles.containersuggestion_inputs}>
                        <TextInput
                            style={[styles.input_O ]}
                            placeholder="Recoger en..."
                             placeholderTextColor="#FFFFFF"
                            value={input}
                            onFocus={() => setFocusedField("origin")}
                            onChangeText={(text) => {
                                setInput(text);

                                fetchAutocompleteSuggestions(text);
                                setFocusedField("origin")
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
                                            onPress={debounce(() => {
                                                Keyboard.dismiss(); // Oculta el teclado
                                                setOcultarData("none");
                                                fetchPlaceDetails(
                                                    item.placePrediction.placeId,
                                                    false,
                                                    mainText || "Ubicación desconocida"
                                                );
                                            }, 200)}
                                        >
                                            <View style={styles.suggestionItem}>
                                                <Text style={styles.suggestionTextBold}>{mainText}</Text>
                                                <Text style={styles.suggestionText}>{secondaryText}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}

                        {/* Campo para la dirección de destino */}
                        <TextInput
                            style={styles.input_D}
                            placeholder="Destino..."
                            placeholderTextColor="#FFFFFF"
                            value={destinationInput}

                            onChangeText={(text) => {
                                setDestinationInput(text);
                                fetchAutocompleteSuggestions(text, true);
                                setFocusedField("destination")
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
                                            onPress={debounce(() => {
                                                Keyboard.dismiss();   //oculta tecaldo
                                                setOcultarData("none");
                                                fetchPlaceDetails(
                                                    item.placePrediction.placeId,
                                                    true,
                                                    destinationMainText || "Ubicación desconocida"
                                                )
                                            }, 200)}
                                        >
                                            <View style={styles.suggestionItem}>
                                                <Text style={styles.suggestionTextBold}>{destinationMainText}</Text>
                                                <Text style={styles.suggestionText}>{destinationSecondaryText}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        )}
                    </View>
                </View>



                <View style={[styles.containerTargetas, ocultarData === "ok" && { display: "none" }]}>
                    {/* Tarjeta de duración */}
                    <View style={styles.card}>
                    <Image source={require('../../../../assets/duracion.png')} style={styles.Img_card} />
                        <Text style={styles.label}>Duración</Text>
                        <Text style={styles.value}>
                            {routeData?.duration ? (Number(routeData.duration.slice(0, -1)) / 60).toFixed(1) : "0"} min
                        </Text>
                    </View>

                    {/* Tarjeta de distancia */}
                    <View style={styles.card}>
                        <Text style={styles.icon}>📏</Text>
                        <Text style={styles.label}>Distancia</Text>
                        <Text style={styles.value}>{routeData?.distance ?? "0 km"}</Text>
                    </View>

                    {/* Tarjeta de precio */}
                    <View style={styles.card}>
                    <Image source={require('../../../../assets/pesos.png')} style={styles.Img_card} />
                        <Text style={styles.label}>Tarifa</Text>
                        <Text style={styles.price}>
                            {calcularPrecio(routeData?.distance ?? 0, routeData?.duration ?? "0s")}
                        </Text>
                    </View>
                </View>
                <DefaultRoundedButton text="Buscar conductor" onPress={fetchRoute} />
            </View>
            </LinearGradient>
        </View>
    );
}    