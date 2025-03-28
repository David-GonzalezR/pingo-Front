import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Negro elegante con un toque moderno

  },
  mapContainer: {
    flex: 1,
    borderColor: "#FF3B3B", // Borde rojo vibrante
    
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -40 }],
  },
  pin: {
    width: 40,
    height: 40,
  },
  controlsContainer: {
    padding: 5,

    backgroundColor: "transparent",
    borderRadius: 15,
    width: "100%"
  },
  containersuggestion: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#FF3B3B",
  },
  rutaContainer: {
    width: "15%",
    alignItems: "center",
  },
  imgRuta: {
    width: "100%",
    height: 70,
    resizeMode: "contain",
  },
  containersuggestion_inputs: {

    width: "90%",
  },
  input_O: {
    width: "100%",
    fontSize: 18,
    color: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#666666",

  },
  input_D: {
    width: "100%",
    fontSize: 18,
    color: "#FFF",

  },
  suggestionItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  suggestionTextBold: {
    
    fontSize: 18,
    color: "white",
  },
  suggestionText: {
    fontSize: 16,
    color: "#DDD",
  },
  containerTargetas: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
  },
  card: {
    marginTop: 8,
    alignItems: "center",
    width: "30%",      
    
    shadowColor: "white",
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  icon: {
    fontSize: 28,
    color: "#FF3B3B",
  },
  label: {
    fontSize: 1,
    color: "#EEE",
    marginTop: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",

  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginTop: 1,
  },
  Img_card: {
    width: "100%",
    height: 50,
    resizeMode: "contain",
  },

  circleMarker: {
    width: 15,
    height: 15,
    borderRadius: 10, // Hace que sea un círculo
    backgroundColor: 'green', // Color del marcador de origen
    borderWidth: 2,
    borderColor: 'white',
  },
  squareMarker: {
    width: 15,
    height: 15,
    backgroundColor: 'red', // Color del marcador de destino
    borderWidth: 2,
    borderColor: 'white',
  },
  controlsContainerA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 0,
    borderRadius: 50,
  },
  button: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 15,
    alignItems: 'center'
  }

});
