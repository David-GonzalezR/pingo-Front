import React from "react"
import { Text, TouchableOpacity, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient";


interface Props{
    text:string,
    onPress:() => void
    backgroundcolor?: string,
}

const DefaultRoundedButton = ({text, onPress, backgroundcolor }: Props)=> {
return(
  <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
  <LinearGradient 
    colors={["#FF5733", "#C70039"]} // 👈 Colores del degradado (puedes cambiarlos)
    start={{ x: 0, y: 0 }} 
    end={{ x: 1, y: 1 }} 
    style={styles.roundedButton}
  >
    <Text style={styles.textButton}>{text}</Text>
  </LinearGradient>
</TouchableOpacity>
)
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    marginTop: 25,
  },
  roundedButton: {
    width: "100%",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  textButton: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DefaultRoundedButton;