import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ImageBackground: {
        width: '100%',
        height: '100%',
        opacity: 0.7
    },
    form: {
        width: '87%',
        height: '75%',
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 40,
        justifyContent: 'center',
        paddingHorizontal: 25

    },
    imageusu: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 15
    },
    textlogin: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    containerTextDontHaveAccount: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    textDontHaveAccount: {
        color: 'white',
        fontSize: 16

    },




    divider: {
        height: 1,
        width: 75,
        backgroundColor: 'white',
        marginHorizontal: 6
    }



});

export default styles