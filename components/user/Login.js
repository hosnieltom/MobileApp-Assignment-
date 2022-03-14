
import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeToken = async ( value ) => {
    try{
        const jsonValue = JSON.stringify( value )
        await AsyncStorage.setItem( '@spacebook_details', jsonValue )
    }
    catch(e) {
        console.error( error )
    }
}
class LoginScreen extends Component {

    constructor( props ) {
        super( props );
        this.state = {

            email: '',
            password: '',
            error: '',
            confirmPassword:'',
            confirmEmail: ''
        };
    }
    onLogin = () => {
        fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
          })
          .then(( response ) => {
              
            if( !response.ok ){
                
                if ( this.state.email  === '') 
                  throw Error( 'Email is requrired' )

                else if ( this.state.password  === '') 
                  throw Error( 'Password is requrired' ) 

                else if ( response.status  === 400 ) 
                  throw Error( 'Invalid email or password ' ) 

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else
                  throw Error( 'Check your connection' )
            } 
            return response.json();
          })
        
          .then((json) => {
                storeToken( json );
                this.setState( { email: '', password: '' } )
                this.props.navigation.navigate( "Home" )
          })
          
          .catch((error) => {
            this.setState( { error: error.message } )
          });
      }
    render(){
        return(
            <View style = { styles.container }>
                <View>
                   <Text  style = { styles.errorText}>{this.state.error }</Text>
                </View>
                
                <View style = { styles.inputContainer }>
                    <Text style = { styles.text }>Enter email</Text>
                    <TextInput
                        style = { styles.inputField }
                        placeholder="e.g. hosni@gmail.com"
                        onChangeText = { ( email ) => this.setState( { email } ) }
                        value = { this.state.email }
                        />
                    <Text style = { styles.text }>Enter password</Text>
                    <TextInput 
                        style = { styles.inputField }
                        placeholder = "e.g. password"
                        secureTextEntry = {true}
                        onChangeText = { ( password ) => this.setState( { password } ) }
                        value = { this.state.password }
                        />
                    </View>
                    <View  style = { styles.buttonContainer }>
                        <View style = { styles.button }>
                            <Button
                            color = "#DCDCDC"
                            title = 'Login'
                            onPress = { () => this.onLogin() }
                            />
                        </View>
                        <View style = { styles.button }>
                            <Button 
                            color = "#DCDCDC"
                            title = "Sign up" 
                            onPress = { () => this.props.navigation.navigate( "SignUp" ) }/>
                        </View>
                </View>
            </View>
    
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
      },
      inputContainer: {
        alignItems:'center',
        justifyContent:'center'
      },
      signContainer: {
        flexDirection: 'row',
      },
      text: {
        color: 'black',
        fontSize: 18,
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    inputField: {
        borderWidth:1,
        borderRadius:10,
        backgroundColor: '#eee',
        padding: 8,
        margin: 8,
        fontSize: 18,
        width: 200
    },
    buttonContainer:{
        justifyContent: 'center',
        flexDirection: 'row',
        width: 200,
        
    },
    button:{
        marginRight:20,
        marginLeft:20,
        marginTop:10,
        width: 80,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
    },
  });
export default LoginScreen