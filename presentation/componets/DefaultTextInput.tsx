import { Image, KeyboardType, StyleSheet, TextInput, View } from "react-native"

interface Props {
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void;
    KeyboarType?: KeyboardType
    icon: any
    secureTextEntry?:boolean,
}


const DefaultTextInput = ({
    placeholder,
    value,
    onChangeText,
    KeyboarType,
    icon,
    secureTextEntry= false  //ak o en el return se le puede pasar el valor por defecto

}: Props) => {
    return (
        <View style={styles.containerTextInput} >
            <Image
                style={styles.TextInputIcon}
                source={icon}
            />
            <TextInput
                style={styles.textInput}
                placeholder={placeholder}
                placeholderTextColor='white'
                value={value}
                onChangeText={text => onChangeText(text)}
                keyboardType={KeyboarType || 'default'}
                secureTextEntry={secureTextEntry}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    containerTextInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    TextInputIcon: {
        width: 25,
        height: 25,
        marginRight: 15,


    },
    textInput: {
        width: '88%',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        color: 'white',
        fontSize: 18
    },

})

export default DefaultTextInput;