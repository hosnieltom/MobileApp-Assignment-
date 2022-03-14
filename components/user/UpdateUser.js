import React, { Component, } from "react";
import { Text, Button, TextInput, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdateUser extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            user_information : [],
            first_name : '',
            last_name : '',
            email : '',
            password : '',
            error: ''
        }
    }

    getData = async () => {

        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )

        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ) {
          user_id = session_data.id
        }
        else
          user_id = this.props.route.params.user_id;
        
        fetch(`http://localhost:3333/api/1.0.0/user/${ user_id }`, {
            method: 'Get',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then(( response ) => response.json() )
        .then(( responseJson ) => {
            this.setState({
                isLoading : false,
                user_information : responseJson
            })
        })
        .catch((error) => {
            this.setState( { error: error.message } )
        })
    }

    updateUser = async() => {

        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
       
        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ) {
          user_id = session_data.id
        }
        else 
          user_id = this.props.route.params.user_id;
        
        let to_send={}
        let orig_first_name = this.state.user_information.first_name;
        let orig_last_name = this.state.user_information.last_name;
        let orig_email = this.state.user_information.email;
        let orig_password = this.state.user_information.password;

        if( this.state.first_name != orig_first_name ) {
        to_send['first_name'] = this.state.first_name; 
        }

        if( this.state.last_name != orig_last_name ) {
            to_send['last_name'] = this.state.last_name;
        }
        
        if( this.state.email != orig_email ) {
            to_send['email'] = this.state.email
        }

        if( this.state.password != orig_password ) {
            to_send['password'] = this.state.password
        }

        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
            method : 'PATCH',
            headers : {
                'content-type': 'application/json',
                'x-authorization': session_data.token
            },
            body : JSON.stringify( to_send )
        })

        .then( ( response ) => {
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

                else if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )

                else if( response.status === 403 )
                  throw Error( 'You are forbidden to make change' )

                else if( response.status === 404 )
                   throw Error( 'Page not found' )

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else 
                  throw Error( 'Check your connection' )
            }
            this.setState( { first_name: '',last_name: '', email: '', password: '' } )
        })

        .catch( (error) => {
             this.setState( { error: error.message } )
        })

    }
    componentDidMount(){
        this.getData()
    }

    render(){
        return (
            <View style = { styles.container }> 
               <View>
                  <Text style = { styles.errorText }>{ this.state.error }</Text>
               </View>
                <View style = { styles.titleContainer }>
                    <View style = { styles.textContainer }>
                      <Text style = { styles.titelText }>Update a User</Text>
                    </View>

                    <TextInput
                        style = { styles.textInput }
                        placeholder = "Enter new first name..."
                        onChangeText = { ( first_name ) => this.setState( { first_name } ) } 
                        value = { this.state.first_name }/>

                    <TextInput
                        style = { styles.textInput }
                        placeholder = "Enter new last name..."
                        onChangeText = { ( last_name ) => this.setState( { last_name } ) }
                        value = { this.state.last_name }/>

                    <TextInput
                        style = { styles.textInput }
                        placeholder = "Enter new email.."
                        onChangeText = { ( email ) => this.setState( { email } ) }
                        value = { this.state.email }/>

                    <TextInput
                        style = { styles.textInput }
                        placeholder = "Enter new password..."
                        secureTextEntry = {true}
                        onChangeText = { ( password ) => this.setState( { password } ) }
                        value = { this.state.password }/>
                </View>
                    <View style = { styles.buttonsContainer }>
                        <View style = { styles.buttonContainer }>
                            <Button  
                            title = "Update user"
                            color = "#DCDCDC"
                            onPress = { () => this.updateUser() }/>
                        </View> 
                        <View style = { styles.buttonContainer }>
                                <Button 
                                title = "Back" 
                                color = "#DCDCDC"
                                onPress = { () => this.props.navigation.navigate( "Profile") }/>
                        </View>
                    </View>
             </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
      },
      textContainer: {
        justifyContent:'center',
        justifyContent: 'space-between'
      },
      titleContainer: {
        justifyContent:'center',
        alignItems:'center',
      },
      text: {
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
      },
      textInput: {
        borderWidth:1,
        borderRadius:10,
        backgroundColor: '#eee',
        padding: 8,
        margin: 8,
        fontSize: 18,
        width: 200
      },
      titelText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: "Cochin",
        marginBottom: 20,
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    buttonContainer:{
        justifyContent: 'space-between',
        marginTop: 20,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
        marginLeft:5,
        height:35
    },
    buttonsContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
  });

  export default UpdateUser