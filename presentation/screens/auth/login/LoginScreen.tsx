
import { Alert, Button, Image, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DefaultTextInput from '../../../componets/DefaultTextInput';
import DefaultRoundedButton from '../../../componets/DefaultRoundedButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamlist } from '../../../navigator/MainStackNavigatior';
import styles from './styles'
import { useEffect, useState } from 'react';
import EmailValidator from '../../../Utils/EmailValidator';
import { ApiRequestHandler } from '../../../../data/sources/remote/api/ApiRequestHandler';
import { AuthResponse } from '../../../../domain/models/AuthResponse';
import { defaultErrorResponse, ErrorResponse } from '../../../../domain/models/ErrorResponse';
import { LoginViewModel } from './LoginViewModel';
import { AuthService } from '../../../../data/sources/remote/services/AuthService';
import { AuthRepositoryImpl } from '../../../../data/repository/AuthRepositoryImpl';
import { LoginUseCase } from '../../../../domain/useCase/auth/LoginUseCase';
import { container } from '../../../../di/container';
import { useAuth } from '../../../hooks/useAuth';



interface Props extends StackScreenProps<RootStackParamlist, 'LoginScreen'> { };
export default function LoginScreen({ navigation, route }: Props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const loginViewModel = container.resolve('loginViewModel');
    const { authResponse, saveAuthSession } = useAuth();

    useEffect(() => {
        if (authResponse !== null && authResponse !== undefined) {
                if(authResponse.user.roles!.length > 1){ 
            navigation.replace('RolesScreen');
           
           }else{
            navigation.replace('ClientHomeScreen');
            
           } 
        }
   

    }, [authResponse])

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Error', 'El email y el pasword no pueden estar vacios')
            return;
        }
        if (!EmailValidator(email)) {
            Alert.alert('Error', 'El email no es valido')
            return;
        }
        const response = await loginViewModel.login(email, password)
        if ('token' in response) {//login exitoso
            saveAuthSession(response);      
        }
        console.log('RESPONSE: ', response)
    }




    return (
        <View style={styles.container}>
            <Image
                style={styles.ImageBackground}
                source={require('../../../../assets/city.jpg')}
            />
            <View style={styles.form}>
                <Image
                    source={require('../../../../assets/user.png')}
                    style={styles.imageusu}
                />
                <Text style={styles.textlogin}>LOGIN</Text>

                <DefaultTextInput
                    icon={require('../../../../assets/email.png')}
                    placeholder='Correo electronico'
                    onChangeText={setEmail}
                    value={email}
                    KeyboarType='email-address'

                />

                <DefaultTextInput
                    icon={require('../../../../assets/password.png')}
                    placeholder='Contraseña'
                    onChangeText={setPassword}
                    value={password}
                    KeyboarType='default'
                    secureTextEntry={true}

                />





                <DefaultRoundedButton
                    text='INICIAR SESION'
                    onPress={() => {
                        handleLogin();
                    }}
                />

                <DefaultRoundedButton
                    text='REGISTRATE'
                    onPress={() => navigation.navigate('RegisterScreen')}
                    backgroundcolor='black'
                />


                <View style={styles.containerTextDontHaveAccount}>
                    <View style={styles.divider} ></View>
                    <Text style={styles.textDontHaveAccount}>¿No Tienes Cuenta?</Text>
                    <View style={styles.divider} ></View>


                </View>



            </View>




        </View>
    )
}

