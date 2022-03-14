import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

class SignUp extends Component {

    constructor( props ){
        super( props )

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            error: '',
            register:''
        }
    }

    addUser = () => {
         let to_send = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password
        };

         fetch('http://localhost:3333/api/1.0.0/user', {

          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(to_send)
        })
        .then(( response ) => {
          if( !response.ok ) {
            if( this.state.first_name === '' )
              throw Error( 'First name is required' )

            else if( this.state.last_name === '' )
              throw Error( 'Last name is required' )

            else if( this.state.email === '' )
              throw Error( 'Email is required' )

            else if( this.state.password === '' )
              throw Error( 'Password is required' )

            else if ( response.status  === 400 ) 
              throw Error( 'Bad Request' ) 

            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 

            else 
              throw Error( 'Check your connection' )
          }
          else {
            this.setState( { register: 'Thank you for creating account on Spacebook!' } )
           this.setState( { first_name: '',last_name: '', email: '', password: '' } )
          }
           
        })
         .catch((error)=>{
           this.setState( { error: error.message } )
         })
      }
    
    render(){
        return(
            <View style = { styles.container }>
               <View>
                  <Text style = { styles.errorText }>{ this.state.error }</Text>
               </View>
               <View>
                  <Text style = { styles.regText }>{ this.state.register }</Text>
               </View>
               <View style = { styles.formContainer }>
                  <Text style = { styles.text }>Sign up</Text>
                  <TextInput style = { styles.inputField }
                      placeholder = "Enter first name..."
                      onChangeText = { ( first_name ) => this.setState( { first_name} )}
                      value = { this.state.first_name }/>
                  <TextInput style = { styles.inputField }
                      placeholder = "Enter last name..."
                      onChangeText = { ( last_name ) => this.setState( { last_name } )}
                      value = { this.state.last_name }
                      />

                  <TextInput style = { styles.inputField }
                      placeholder = "email..."
                      onChangeText = { (email) => this.setState( { email } )}
                      value = { this.state.email }
                      />
                  <TextInput style = { styles.inputField }
                      placeholder = "password..."
                      secureTextEntry = { true }
                      onChangeText = { ( password ) => this.setState( { password } )}
                      value = { this.state.password }
                      />
                  <View style = { styles.buttonContainer }>
                    <View style = { styles.button }>
                        <Button
                        color = "#DCDCDC"
                        title = "Sign up"
                        onPress = { () => this.addUser() }/>
                    </View>
                    <View style = { styles.textButton }><Text>Or</Text></View>
                    <View style = { styles.button }>
                        <Button 
                        color = "#DCDCDC"
                        title = "Login" 
                        onPress = { () => this.props.navigation.navigate( "Login" ) }/>
                    </View>
                  </View>
              </View>
           </View>
        )}
      }
 const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
      },
      formContainer: {
        alignItems:'center',
        justifyContent:'center'
      },
      text: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 24,
        fontFamily: "Cochin",
      },
      textButton: {
        marginRight:5,
        marginLeft:5,
        marginTop:20,
        
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
      regText: {
        color: 'green',
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
      marginRight:8,
      marginLeft:8,
      marginTop:10,
      width: 80,
      borderRadius:5,
      borderWidth: 1,
      borderColor: '#fff',
        
    },
  });
  
export default SignUp