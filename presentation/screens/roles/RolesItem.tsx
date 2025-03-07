import { View, Text, TouchableOpacity } from "react-native"
import { Role } from "../../../domain/models/Role"
import { Image } from "react-native"
import styles from './Styles'
import { StackNavigationProp } from "@react-navigation/stack"
import { RootStackParamlist } from "../../navigator/MainStackNavigatior"

interface Props {
    navigation: StackNavigationProp<RootStackParamlist, 'RolesScreen', undefined>
    role: Role
}

export default function RolesItem({ navigation, role }: Props) {
    return (


        <TouchableOpacity
            onPress={() => {
                
                
                if (role.id === 'CLIENT') {                    
                    navigation.replace('ClientHomeScreen')
                }
                else if(role.id === 'DELIVERY_PARTHER'){                    
                    navigation.replace('DeliveryDriverHomeScreen')
                }   
                else if(role.id === 'ADMIN'){                    
                    navigation.replace('AdminHomeScreen')
                }
                else if(role.id === 'SuperAdmin'){
                    console.log(role.id)
                    navigation.replace('SuperAdminHomeScreen')}
                
               
                 


            }
            }


        >
            <View>
                <Image
                    style={styles.image}
                    source={{ uri: role.image }}
                />
                <Text style={styles.textItem}>{role.name}</Text>
            </View>
        </TouchableOpacity >

    )


}
