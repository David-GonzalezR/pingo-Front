import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface DetailsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onDetailsSubmit: (details: string) => void;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isVisible, onClose, onDetailsSubmit }) => {
    const [details, setDetails] = useState<string>("");

    const handleSubmit = () => {
        if (details.trim().length > 0) {
            onDetailsSubmit(details); // Enviar el texto directamente
            onClose();
        }
    };

    return (
        <Modal transparent={true} visible={isVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Ingresa todos los detalles del servicio</Text>

                    {/* Campo para ingresar detalles */}
                    <TextInput
                        style={styles.input}
                        keyboardType="default"
                        placeholder="Ingrese los detalles del servicio..."
                        value={details}
                        onChangeText={setDetails}
                        multiline={true} // Permite múltiples líneas
                        numberOfLines={6} // Muestra 6 líneas de texto
                    />

                    {/* Botones */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Aceptar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "90%", // Más ancho
        minHeight: "50%", // Más alto
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        textAlignVertical: "top", // Alinea el texto arriba
        minHeight: 120, // Ajuste del tamaño
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    confirmButton: {
        backgroundColor: "green",
        marginRight: 5,
    },
    cancelButton: {
        backgroundColor: "red",
        marginLeft: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DetailsModal;
