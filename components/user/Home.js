import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Logout from "./logout";
import User_info from "./User_info";
import CameraImp from "./CameraImp"
import ProfileStack from './ProfileStack';

const Drawer = createDrawerNavigator();

class Home extends Component{
    
    render() {
        
        return (
            
            <Drawer.Navigator initialRouteName = "Profile">
                <Drawer.Screen name = "Logout" component = { Logout }/>
                <Drawer.Screen name = "User_info" component = { User_info }/>
                <Drawer.Screen name = "CameraImp" component = { CameraImp }/>
                <Drawer.Screen name = "Profile" component = { ProfileStack }/>
            </Drawer.Navigator>
        )
    }
}

export default Home