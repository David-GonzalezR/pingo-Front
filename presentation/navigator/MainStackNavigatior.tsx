import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import React, { Children } from "react";
import { AuthProvider } from "../context/AuthContext";
import { container } from "../../di/container";
import RolesScreen from "../screens/roles/RolesScreen";
import ClientHomeScreen from "../screens/client/home/ClientHomeScreen";
import DeliveryDriverHomeScreen from "../screens/delivery-driver/home/DeliveryDriverHomeScreen";
import AdminHomeScreen from "../screens/admin/home/AdminHomeScreen";
import SuperAdminHomeScreen from "../screens/merchant/home/SuperAdminHomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientSearchMapScreen from "../screens/client/searchMap/ClientSearchMapScreen";


export type RootStackParamlist = {
    LoginScreen: undefined,
    RegisterScreen: undefined,
    RolesScreen: undefined,
    ClientHomeScreen: undefined,
    DeliveryDriverHomeScreen: undefined,
    AdminHomeScreen: undefined,
    SuperAdminHomeScreen: undefined,
    ClientSearchMapScreen: undefined,

}

const Stack = createNativeStackNavigator<RootStackParamlist>();
const Drawer = createDrawerNavigator<RootStackParamlist>();
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

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="RolesScreen"
                    component={RolesScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="ClientHomeScreen"
                    component={ClientDrawerNavigator}
                />

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="DeliveryDriverHomeScreen"
                    component={DeliveryDriverHomeScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="AdminHomeScreen"
                    component={AdminHomeScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                    name="SuperAdminHomeScreen"
                    component={SuperAdminHomeScreen}
                />

            </Stack.Navigator>
        </AuthProvider>
    )
}

const ClientDrawerNavigator = () => {
    return (
        <Drawer.Navigator initialRouteName="ClientSearchMapScreen">
            <Drawer.Screen name="ClientSearchMapScreen" component={ClientSearchMapScreen} />
        </Drawer.Navigator>
    );
}
