import React, { Component } from 'react';
import { Text, TextInput, View, ActivityIndicator, StyleSheet,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";

class Friends extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            friends_info : [],
            error: ''
        }
    }

    getFriends = async () => {

        let data = await AsyncStorage.getItem( '@spacebook_details' );
        let session_data = JSON.parse( data )
       
        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ){
          user_id = session_data.id
        }
        else 
          user_id = this.props.route.params.user_id;
      
        fetch(`http://localhost:3333/api/1.0.0/user/${ user_id }/friends`,{

            method: 'GET',
            headers: {
                'x-authorization': session_data.token
            }
        })
        
        .then( ( response ) => {

          if( !response.ok ){
                
            if ( response.status  === 401 ) 
              throw Error( 'You are Unauthorized' )

            else if ( response.status  === 403 ) 
              throw Error( 'Can only view the friends of yourself or your friends' ) 
                
            else if ( response.status  === 404 ) 
              throw Error( 'Page not found' ) 

            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 

            else
              throw Error( 'Check server connection' )
          }
          return response.json()
        })

        .then( ( responseJson ) => {
            this.setState({
                isLoading: false,
                friends_info: responseJson,
               })
        })
        .catch( ( error ) =>{
            this.setState( { error: error.message } )
        })
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getFriends()
      });
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }
  
    render() {

      if( this.state.isLoading ) {

        return(
          <View>
              <Text>Loading...</Text>
              <View><Text style = {styles.errorText }>{ this.state.error }</Text></View>
              <ActivityIndicator
                size="large"
                color="#00ff00"/>
          </View>
        )
      }
      else {

        const nav = this.props.navigation;
        const getProfile = ( user_id ) => {
        nav.navigate( "Profile", {"user_id": user_id } )}

        return(
          <View>
              <View>
                  <Text style={ styles.titelText }>Friends</Text>
              </View>
              <View style = { styles.listContainer }>
                  <FlatList
                      data = { this.state.friends_info }
                      renderItem = { ( { item } ) => (
                      <View>
                          <TouchableOpacity onPress = { () => getProfile( item.user_id ) }>
                            <Text style = { styles.text }>{ item.user_givenname } { item.user_familyname }</Text>
                          </TouchableOpacity>
                      </View>
                      )}
                    keyExtractor = { ( item, index ) => item.user_id.toString() }/>
              </View>
          </View>
        )
      }
    }
}

const styles = StyleSheet.create( {
    container: {
        flex:1,
      },
      listContainer: {
        justifyContent: 'space-between',
        paddingTop: 5,
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
      text: {
        fontSize: 16,
        fontFamily: "Cochin",
        marginTop: 10,
        marginBottom: 10
      },
      titelText: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: "Cochin",
        marginTop: 12,
      }
  });

export default Friends


  