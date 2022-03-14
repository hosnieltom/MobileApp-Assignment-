import React, {Component} from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

import Home from "./components/user/Home";
import Login from "./components/user/Login"
import SignUp from "./components/user/SignUp"
import UpdateUser from "./components/user/UpdateUser";

const Stack = createNativeStackNavigator();

class App extends Component {

  render(){
    return(
     
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Login">
             <Stack.Screen name = "Login" component = {Login}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "SignUp" component = {SignUp}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "UpdateUser" component = {UpdateUser}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "Home" component = {Home}
             options = {{ headerShown: false}}/>
        </Stack.Navigator>
       </NavigationContainer>
      
    );
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
  },
});

export default App