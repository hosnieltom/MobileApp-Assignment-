
import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { AsyncStorage } from 'react-native';

const storeData = async (value) => {
    try{
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem('@spacebook_details', jsonValue)
    }
    catch(e) {
        console.error(error)
    }
}
class LoginScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            // I need to leave the email and password value empty after finishing the app test
            // test3@mmu.co.uk hello123
            email: 'test3@mmu.ac.uk',
            password: 'hello123'
            //d
        };
    }
    /*
    handleEmailInput = (emai => {
        // I may do some validation leter on
        this.setState( {email: emai} )
    })

    handlePasswordInput = (pass => {
        // I may do some validation leter on
        this.setState( {password: pass} )
    })
    */
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
          .then((response) => response.json())
          .then((json) => {
              console.log(json);
              storeData(json);
              this.props.navigation.navigate("Home")
          })
          .catch((error) => {
              console.error(error)
          });
      }
    render(){
        const nav = this.props.navigation;
        return(
            <View style={styles.container}>
                <View>
                <TextInput
                    style={styles.inputField}
                    placeholder="email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    />

                <TextInput 
                    style={styles.inputField}
                    placeholder="password..."
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    />
            </View>
            <View  style={styles.buttonContainer}>
            <View style={styles.button}>
                <Button
                 title='Login'
                 // I need to bind an object may be
                 onPress={() => this.onLogin()}
                 />
                </View>
            <View style={styles.button}>
                <Button title="Sign up for Spacebook" 
                onPress={() => nav.navigate("SignUp")}/>
            </View>
            </View>
         </View>
            /*value={this.state.email} */

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      text: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
      },
    inputField: {
       padding: 14,
      fontSize: 22,
      width: '90%'
    },
    buttonContainer:{
        justifyContent: 'center',
        
    },
    button:{
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
    },
  });
export default LoginScreen