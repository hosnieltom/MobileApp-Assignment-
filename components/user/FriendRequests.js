import React, { Component } from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequests extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            isLoading : true,
            friend_requests : [],
            error: '',
        }
    }
    

    getData = async () => {
        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
        
        fetch('http://localhost:3333/api/1.0.0/friendrequests', {
            method: 'Get',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then(( response ) => { 

            if( !response.ok ) {
                
                if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else
                  throw Error( 'Check server connection' )
            }

            return response.json() 
        })

        .then( ( responseJson ) => {
            this.setState( {
                isLoading : false,
                friend_requests : responseJson
            })
        })
        .catch( ( error ) => {
            this.setState( { error: error.message } )
        })
    }

    acceptRequest= async( user_id ) => {

        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
      
        //the ID is the your firend request id
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
            method: 'POST',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then( ( response ) => {

            if( !response.ok ) {
                
                if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )
                    
                else if ( response.status  === 404 ) 
                  throw Error( 'Page not found' ) 

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else
                  throw Error( 'Check server connection' )
            }
            this.getData()
        })
    
        .catch( (error ) => {
            this.setState( { error: error.message } )
        })
    }

    componentDidMount(){
        this.getData()
    }

    removeFriend = async ( user_id ) => {

        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
        
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
            method: 'DELETE',
            headers: {
                'x-authorization': session_data.token
            }
        })

        .then( (response) => {

            if( !response.ok ) {

                if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )
                    
                else if ( response.status  === 404 ) 
                  throw Error( 'Page not found' ) 

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else
                  throw Error( 'Check server connection' )
            }
           this.getData()
        })
    
        .catch( ( error ) => {
            this.setState( { error: error.message } )
        })
    }

    render(){

        if( this.state.isLoading ) {
            return(
                <View>
                    <Text>Loading...</Text>
                    <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                    <ActivityIndicator
                        size = "large"
                        color = "#00ff00"/>
                </View>
            )
        }
        else {

            return(
                <View style = { styles.container }>
                    <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                    <View style = { styles.textContainer }>
                        <Text style = { styles.titelText }>Requests</Text>
                    </View>
                    <View style={styles.button}>
                            <Button 
                            title = "Back" 
                            color = "#DCDCDC"
                            onPress={ () => this.props.navigation.navigate( "Profile" ) }/>
                    </View>
                    <View style = { styles.listContainer }>
                        <FlatList
                            data = { this.state.friend_requests }
                            renderItem = { ( { item } ) => (
                            <View>
                                <Text style = { styles.text }>{ item.first_name } { item.last_name }</Text>
                                <View style = { styles.buttonContainer }>
                                    <View style = { styles.button }> 
                                        <Button
                                        color = "#DCDCDC"
                                        title = "Accept"
                                        onPress = { () => this.acceptRequest( item.user_id ) }/>
                                    </View>
                                    < View style = {styles.button}> 
                                        <Button
                                        title = "Reject"
                                        color = "#DCDCDC"
                                        onPress = { () => this.removeFriend( item.user_id )}/>
                                    </View>
                                </View>
                            </View>
                        )}
                        keyExtractor = { ( item, index) => item.user_id.toString()} />
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
    textContainer: {
        justifyContent: 'space-between',
      },
    listContainer: {
        justifyContent: 'space-between',
        padding: 14,
      },
    text: {
        fontSize: 16,
        fontFamily: "Cochin",
        marginTop: 10,
        paddingLeft:20
      },
    titelText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
      },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between', 
    },
    button:{
        elevation: 8,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
        margin: 15,
        width: 85,
        height: 35,      
    },
  });

export default FriendRequests

