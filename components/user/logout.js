import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*
const getData = async (done) =>{
    try{
        const jsonValue = await AsyncStorage.getItem('@spacebook_details')
        const data = JSON.parse(jsonValue);
        return done(data);
    }
    catch(e){
        console.error(e);
    }

}
*/
class Logout extends Component {

    constructor(props){
        super(props);

        this.state ={
            logout_info:{},
        }
    }

    onLogout = async ()=> {
        // TO DO
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data);
        console.log(data)
        fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'x-authorization': session_data.token
            },
        }) 

        .then(() => {
            this.props.navigation.navigate("Login")
        })
          .catch((error) => {
              console.error(error)
          });
    }
    //nav.navigate("Login")

    render() {
        const nav = this.props.navigation;
        return(
            <View>
                <Text>Log Out</Text>
                <Button title="Log Out"
                onPress={() => this.onLogout()}/>
            </View>
        )
    }
}

export default Logout