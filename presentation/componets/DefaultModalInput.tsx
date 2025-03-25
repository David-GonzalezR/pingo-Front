import React, { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";

interface OfferModalProps {
    isVisible: boolean;
    onClose: () => void;
    onOfferSubmit: (value: number) => void;
}

const OfferModal: React.FC<OfferModalProps> = ({ isVisible, onClose, onOfferSubmit }) => {
    const [offer, setOffer] = useState<string>("");

    const handleSubmit = () => {
        const offerValue = parseFloat(offer);
        if (!isNaN(offerValue)) {
            onOfferSubmit(offerValue);
            onClose();
        }
    };

    return (
        <Modal transparent={true} visible={isVisible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>💰 Ingresa tu oferta</Text>
                    
                    {/* Campo para ingresar la oferta */}
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Ingrese su oferta"
                        value={offer}
                        onChangeText={setOffer}
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
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        flex: 1,
        paddingVertical: 10,
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

export default OfferModal;
