import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamlist } from "../../navigator/MainStackNavigatior";
import { useAuth } from "../../hooks/useAuth";
import { Image, FlatList, View, Text } from "react-native";
import styles from './Styles';
import RolesItem from "./RolesItem";
interface Props extends StackScreenProps<RootStackParamlist, 'RolesScreen'> {};
export default  function RolesScreen({navigation, route}:Props) {
    const {authResponse} = useAuth();
 return (
        <View style={styles.container}>
           <FlatList
           contentContainerStyle={{flexGrow: 1,justifyContent: 'center'}}
           data = {authResponse?.user.roles}
           keyExtractor={(item) => item.id} 
           renderItem={({item}) =><RolesItem role={item} navigation={navigation}/>}

           />
        </View>   

 );
}