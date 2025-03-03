import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'black',
    },

background:{
    width:'100%',
    height:'100%',
    opacity:0.6,
},

Form:{
    width:'87%',
    height:'75%',
    position:"absolute",
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius:40,
    justifyContent:'center',
    paddingHorizontal:25,
},
UserImage:{
    width:150,
    height:150,
    alignSelf:'center'
},


TextRegister:{
    color:'white',
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center'
},
back:{
    position:'absolute',
    width:35,
    height:35,
    top: -600,
    left:0,
    


}


});

export default styles;