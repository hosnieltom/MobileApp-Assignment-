import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddPost extends Component {

    constructor( props ) {
        super( props );

        this.state = {
          text: '',
          isLoading: '',
          error: ''
        };
    }

    postPost = async () => {
      let getData = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(getData)
      let user_id = session_data.id


      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
        method: 'POST',
        headers: {
            'x-authorization': session_data.token,
            'Content-Type':'application/json'
        },
        body: JSON.stringify( {
          text: this.state.text } ) 
          })

          .then((response) => { 

            if( !response.ok ) {
              if ( this.state.text === '' )
                throw Error( 'You can not send empty post' )
                    
              else if ( response.status  === 401 ) 
                throw Error( 'You are Unauthorized' )
                  
              else if ( response.status  === 404 ) 
                throw Error( 'Page not found' ) 

              else if ( response.status  === 500 ) 
                throw Error( 'Server Error' ) 

              else
                throw Error( 'Check server connection' )
             }
          } )

          .then( () => {

            this.setState( {
                isLoading : false,
            })
            this.props.navigation.navigate( 'Profile' )
          })
          .catch((error) => {
              this.setState( { error: error.message } )
          });
      }
      render() {
        
        if( this.state.isLoading ) {

          return(
            <View>
              <Text>Loading...</Text>
              <ActivityIndicator
                size = "large"
                color = "#00ff00"/>
            </View>
          )
        }
        else {
          return (
            <View style = { styles.container }>
              <View><Text style = {styles.errorText }>{ this.state.error }</Text></View>
              <Text style = { styles.titelText }>Add Post</Text>
              <View style = { styles.inputContainer }>
                <TextInput
                  multiline
                  style={ styles.inputField } 
                  placeholder = "Type here..."
                  onChangeText = { ( text ) => this.setState( { text } ) }
                  value = { this.state.text }/>
              </View>
              
              <View style = {styles.buttonContainer}>
                <View style = { styles.singleButtonContainer }> 
                  <Button 
                   title = "Post"
                   color = "#DCDCDC"
                   onPress = { () =>this.postPost() }/>
                </View>
                <View style = {styles.singleButtonContainer}>
                  <Button  
                  title = "Back" 
                  color = "#DCDCDC"
                  onPress = {()=> this.props.navigation.navigate("Profile")}/>
              </View> 
              </View>
            </View>
            )
          }
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
        flex:0.4,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        height: 50,
        justifyContent: 'space-between',
      },
      text: {
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
      },
      titelText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: "Cochin",
      marginTop: 12,
      paddingBottom: 10
      },
      errorText: {
      color: 'red',
      fontWeight: 'bold',
      fontFamily: "Cochin", 
      fontSize: 18,
      marginBottom: 20
      },
    inputField: {
      fontSize: 16,
      height: '100%',
      backgroundColor: '#ffffff',
      paddingLeft: 15,
      paddingRight: 15
    },
    buttonContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
  },
  singleButtonContainer:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 80,
    height: 35,
    borderRadius:5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  });
  export default AddPost