import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    input: {
        width: "90%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    map: {
        flex: 1,
    },
    pinContainer: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -15 }, { translateY: -30 }],
        width: 30,
        height: 30,
    },
    pin: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    circleMarker: {
        width: 15,
        height: 15,
        backgroundColor: "green",
        borderRadius: 10, // Hace que sea un círculo
        borderWidth: 2,
        borderColor: "white",
    },
    squareMarker: {
        width: 15,
        height: 15,
        backgroundColor: "red",
        borderWidth: 2,
        borderColor: "white",
    },
});
