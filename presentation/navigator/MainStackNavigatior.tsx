import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import React, { Children } from "react";
import { AuthProvider } from "../context/AuthContext";

export type RootStackParamlist = {
    LoginScreen: undefined,
    RegisterScreen: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamlist>();

export const MainStackNavigator = () => {

    return (
        <AuthState>

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
        </AuthState>
    )
}


const AuthState = ({ children }: any) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}