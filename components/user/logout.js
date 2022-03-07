import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component {

    constructor( props ){
        super( props );

        this.state ={
            logout_info:{},
            error: ''
        }
    }

    onLogout = async ()=> {
    
        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data );
       
        fetch('http://localhost:3333/api/1.0.0/logout', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
              'x-authorization': session_data.token
            },
        }) 

        .then( ( response ) => {
            if( !response.ok ){
                throw Error( 'Something went wrong, check your authorisation' )
            }
            this.props.navigation.navigate( "Login" )
        })
          .catch((error) => {
              this.setState( { error: error.message } )
          });
    }

    render() {
        const nav = this.props.navigation;
        return(
            <View style = { styles.container }>
                <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                <View><Text style = { styles.text }>Log out of spacebook</Text></View>
                <View style = { styles.buttonContainer }>
                    <Button title="Log Out"
                    onPress={ () => this.onLogout() }/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create( {
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      text: {
        color: 'blue',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 20,
        padding: 10,
        margin: 10,
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    buttonContainer:{
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        
    },
    button:{
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
    },
  });

export default Logout