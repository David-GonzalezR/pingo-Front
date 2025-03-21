import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
   
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mapContainer: {
        flex: 1, // El mapa ocupa la parte superior
    },
    map: {
        width: "100%",
        height: "100%",
    },
    controlsContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,       
        padding: 10,
        borderTopLeftRadius: 30,
        backgroundColor:"white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    
    input: {
        width: "100%",
        height: 40,          
        paddingLeft: 15,         
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderColor: "#D6D6D6",  
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#D6D6D6",    
        backgroundColor:"white"   
        
    },
    suggestionTextBold: {
        fontSize: 16,
        fontWeight: "bold",
        
    },
    suggestionText: {        fontSize: 14,
        
        fontWeight: "bold"
        
    },
    pinContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -25 }, { translateY: -52 }], // Centra el pin correctamente
        width: 50, // Asegurar el mismo tamaño que el pin
        height: 50, // Asegurar el mismo tamaño que el pin
        alignItems: "center",
        justifyContent: "center",
    },
    pin: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    circleMarker:{

    },
    squareMarker:{

    },
    containerTargetas: {
        flexDirection: "row", // Alinear en fila
        justifyContent: "space-between", // Espaciado uniforme
        padding: 10,
      },
      card: {
        flex: 1, // Para que ocupen el mismo espacio
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Sombra en Android
        marginHorizontal: 5, // Espaciado entre tarjetas
      },
      icon: {
        fontSize: 24, // Tamaño grande del icono
        marginBottom: 5,
      },
      label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#555", // Gris oscuro
        marginBottom: 3,
      },
      value: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000", // Negro
      },
      price:{
        fontSize: 22,
        fontWeight: "bold",
        color: "green", // Negro
      }
});
