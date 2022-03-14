import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Logout extends Component {

    constructor( props ){
        super( props );

        this.state ={
            logout_info:{},
            error: ''
        }
    }

    onLogout = async () => {
    
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

                if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' ) 

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' )
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
                    <Button 
                    title = "Log Out"
                    color = "#DCDCDC"
                    onPress = { () => this.onLogout() }/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create( {
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
      },
      text: {
        color: 'black',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
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
        height: 35,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
        
    },

  });

export default Logout