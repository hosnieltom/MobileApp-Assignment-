import React, { Component } from 'react';
//import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
//import { createDrawerNavigator } from 'react-navigation-drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Logout from "./logout";
import About from "./About";
import User_info from "./User_info";
import CameraImp from "./CameraImp"
import Profile from './UserProfile';
import Search from './Search'
import Post from './Post';

const Drawer = createDrawerNavigator();



class Home extends Component{
    render(){
        return(
            <Drawer.Navigator initialRouteName="About">
                <Drawer.Screen name="About" component={About} />
                <Drawer.Screen name="Logout" component={Logout} />
                <Drawer.Screen name="User_info" component={User_info}/>
                <Drawer.Screen name="CameraImp" component={CameraImp}/>
                <Drawer.Screen name="Profile" component={Profile}/>
                <Drawer.Screen name="Search" component={Search}/>
                <Drawer.Screen name="Post" component={Post}/>
            </Drawer.Navigator>
        )
    }
}
/**
 "dependencies": {
    "@react-native-async-storage/async-storage": "~1.15.0",
    "@react-navigation/drawer": "^6.3.1",
    "@react-navigation/native": "^6.0.8",
    "@react-navigation/native-stack": "^6.5.0",
    "expo": "~44.0.0",
    "expo-status-bar": "~1.2.0",
    "react": "17.0.1",
    "react-dom": "17.0.1",
    "react-native": "0.64.3",
    "react-native-gesture-handler": "~2.1.0",
    "react-native-reanimated": "^1.13.3",
    "react-native-safe-area-context": "3.3.2",
    "react-native-screens": "~3.10.1",
    "react-native-web": "0.17.1",
    "expo-camera": "~12.1.2"
  },

  

 */

export default Home