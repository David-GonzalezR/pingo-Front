import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import React, { Children } from "react";
import { AuthProvider } from "../context/AuthContext";
import { container } from "../../di/container";

export type RootStackParamlist = {
    LoginScreen: undefined,
    RegisterScreen: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamlist>();

export const MainStackNavigator = () => {
const authUseCases = container.resolve('authUseCases');
    return (
        <AuthProvider authUseCases={authUseCases}>

            <Stack.Navigator>


                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="LoginScreen"
                    component={LoginScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="RegisterScreen"
                    component={RegisterScreen}
                />

            </Stack.Navigator>
        </AuthProvider>
    )
}


