import React, {Component} from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View, StyleSheet } from "react-native";
//import 'react-native-gesture-handler';
import Home from "./components/user/Home";
import Login from "./components/user/Login"
import SignUp from "./components/user/SignUp"
import UpdateUser from "./components/user/UpdateUser";
//import CameraImp from "./components/user/CameraImp"

//import { Camera } from "expo-camera";
//<Stack.Screen name="Details" component={DetailsScreen}/>
//<Text style={styles.textHeader}>Enter your Login</Text>
//<Stack.Screen name="Camera" component={Camera}/>
const Stack = createNativeStackNavigator();

class App extends Component {

  render(){
    return(
     
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Login">
             <Stack.Screen name ="Login" component={Login}/>
             <Stack.Screen name="SignUp" component={SignUp}/>
             <Stack.Screen name="UpdateUser" component={UpdateUser}/>
             <Stack.Screen name="Home" component={Home}/>
        </Stack.Navigator>
       </NavigationContainer>
      
    );
  }
}
/*
const styles = StyleSheet.create({
  container: {
      display:1,
      alignItems:'center',
      justifyContent:'center'
  },
  text: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  inputContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#d7d7d7',
  },
  inputField: {
     padding: 14,
    fontSize: 22,
    width: '90%'
  },
  textHeader: {
    fontSize: 22,
    padding: 18,
    fontWeight: 500
  },
});
/*
import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, Alert } from 'react-native';
import Login from "./components/Login"
class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textHeader}>Enter your Login</Text>
        <View style={styles.inputContainer}>
        <Login></Login>
      </View>
      </View>
      
   
    )
  }

}

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EEDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12
  },
  inputContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#d7d7d7',
  },
  inputField: {
     padding: 14,
    fontSize: 22,
    width: '90%'
  },
  textHeader: {
    fontSize: 22,
    padding: 18,
    fontWeight: 500
  }
});
 
*/
export default App