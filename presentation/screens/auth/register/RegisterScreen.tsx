import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import DefaultTextInput from "../../../componets/DefaultTextInput";
import DefaultRoundedButton from "../../../componets/DefaultRoundedButton";
import { RootStackParamlist } from "../../../navigator/MainStackNavigatior";
import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import EmailValidator from "../../../Utils/EmailValidator";
import { container } from "../../../../di/container";
import { RegisterViewModel } from "./RegisterViewModel";


interface Props extends StackScreenProps<RootStackParamlist, 'RegisterScreen'> { };


export default function RegisterScreen({ navigation, route }: Props) {

    const [name, setName] = useState('');
    const [lastname, SetLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerViewModel: RegisterViewModel = container.resolve('registerViewModel')



    const handleRegister = async () => {
        if (name === '') {
            Alert.alert("Error", "El nombre no puede estar vacio")
            return;
        }
        if (lastname === '') {
            Alert.alert("Error", "El Apellido no puede estar vacio")
            return;
        }
        if (email === '') {
            Alert.alert("Error", "El Email no puede estar vacio")
            return;
        }
        if (phone === '') {
            Alert.alert("Error", "El Teléfono no puede estar vacio")
            return;
        }
        if (password === '') {
            Alert.alert("Error", "La Contraseña no puede estar vacio")
            return;
        }
        if (confirmPassword === '') {
            Alert.alert("Error", "La confirmación de  Contraseña  no puede estar vacio")
            return;
        }
        if (!EmailValidator(email)) {
            Alert.alert("Error", "El Email no es valido")
            return;
        }
        if (confirmPassword !== password) {
            Alert.alert("Error", "Las Contraseñas no Coinciden")
            return;

        }

        const response = await registerViewModel.register({
            name: name,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password
        })

        console.log('REsponseee', response)
    }


    return (

        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps='handled'
            >
                <View style={styles.container}>
                    <Image
                        source={require('../../../../assets/city.jpg')}
                        style={styles.background}
                    />
                    <View style={styles.Form}>

                        <Image
                            source={require('../../../../assets/user.png')}
                            style={styles.UserImage}
                        />
                        <Text style={styles.TextRegister}>REGISTRO</Text>

                        <DefaultTextInput
                            placeholder="Nombre"
                            value={name}
                            onChangeText={setName}
                            icon={require('../../../../assets/user.png')}
                        />

                        <DefaultTextInput
                            placeholder="Apellidos"
                            value={lastname}
                            onChangeText={SetLastname}
                            icon={require('../../../../assets/user_image.png')}
                        />

                        <DefaultTextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            KeyboarType="email-address"
                            icon={require('../../../../assets/email.png')}
                        />

                        <DefaultTextInput
                            placeholder="Teléfono"
                            value={phone}
                            onChangeText={setPhone}
                            KeyboarType="numeric"
                            icon={require('../../../../assets/phone.png')}
                        />

                        <DefaultTextInput
                            placeholder="Contraseña"
                            value={password}
                            onChangeText={setPassword}
                            icon={require('../../../../assets/password.png')}
                            secureTextEntry={true}
                        />
                        <DefaultTextInput
                            placeholder="Confirmar Contraseña"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            icon={require('../../../../assets/password.png')}
                            secureTextEntry={true}
                        />

                        <DefaultRoundedButton
                            text="REGISTRARSE"
                            backgroundcolor="black"
                            onPress={() => handleRegister()}

                        />

                        <TouchableOpacity
                            onPress={() => navigation.pop()}
                        >
                            <Image
                                source={require('../../../../assets/left_arrow.png')}
                                style={styles.back}
                            />
                        </TouchableOpacity>

                    </View >





                </View >


            </ScrollView>




        </KeyboardAvoidingView >



    );
}