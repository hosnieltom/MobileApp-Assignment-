import React, { Component } from 'react';
import { Text, ActivityIndicator, View, Button, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddFriend extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            isLoading : true,
            user_information : [],
            error: '',
            photo: null,
            id: ''
          }
       }

    componentDidMount(){

      this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.getData();
      await this.uploadPhpto();
      });
    
    }
  
    componentWillUnmount() {
      this.unsubscribe();
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
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
          method: 'Get',
          headers: {
              'x-authorization': session_data.token
          }
      })

      .then( ( response ) => { 

        if( !response.ok ){
                
          if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )
              
          else if ( response.status  === 404 ) 
            throw Error( 'Page not found' ) 

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else
            throw Error( 'Check server connection' )
      }
      return response.json();

       })

      .then( ( responseJson ) => {
          this.setState( {
              isLoading : false,
              user_information : responseJson
          })
      })
      .catch( ( error ) => {
          this.setState( { error: error.message } )
      })
    
    }

    uploadPhpto = async () => {

      let getData = await AsyncStorage.getItem( '@spacebook_details' )
      let session_data = JSON.parse(getData)

      let user_id = null;
      if( typeof this.props.route.params === 'undefined' ) {
        user_id = session_data.id
      }
      else 
        user_id = this.props.route.params.user_id;

      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
          method: "GET",
          headers: {
              "X-Authorization": session_data.token
          },
      })
      .then((response ) => {
        
        if( !response.ok ) {

          if ( response.status  === 400 ) 
            throw Error( 'Bad Request' ) 

          else if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized to upload photo' )

          else if( response.status === 404 )
              throw Error( 'Data not found' )

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else 
              throw Error( 'Check your connection' )
        }
          return response.blob();
      })

      .then(( resBlob ) => {
        let data = URL.createObjectURL( resBlob );
        this.setState({
          photo: data,
          isLoading: false
        });
      })

      .catch(( error ) => {
        this.setState( { error: error.message } )
      });
    }


    addFriend = async () => {

        let data = await AsyncStorage.getItem( '@spacebook_details' );
        let session_data = JSON.parse( data )

        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ){
          user_id = session_data.id
        }
        else 
          user_id = this.props.route.params.user_id;

        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/friends`,{
            method: 'POST',
            headers: {
                'x-authorization': session_data.token
            },
        })

        .then( (response) => {
          if( !response.ok ) {

            if ( response.status  === 400 ) 
              throw Error( 'Bad Request' ) 
    
            else if ( response.status  === 401 ) 
              throw Error( 'You are Unauthorized to upload photo' )
    
            else if( response.status === 404 )
                throw Error( 'Data not found' )
    
            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 
    
            else 
                throw Error( 'Check your connection' )
          }
            
        })
        .then( () => {

          this.setState( {
              isLoading : false,
          })
          this.props.navigation.navigate( 'Profile' )
        })

        .catch( (error) => {
            this.setState( { error: error.message } )
        })
        
    }

    render() {

      if( this.state.isLoading ) {

        return(
          <View>
            <Text>Loading...</Text>
            <ActivityIndicator
              size="large"
              color="#00ff00"/>
          </View>
        )
      }
      else {
        
        return (
          
          <View style = { styles.container }> 
            <View style = { styles.headerContainer }>
                <Image
                  source = {{
                  uri: this.state.photo,
                  }}
                  style = {{
                  width: 70,
                  height: 50,
                  borderWidth: 2,
                  margin: 10
                  }}
                  />
                <View style = { styles.userContainer }>
                  <Text style = { styles.userText }>{ this.state.user_information.first_name }</Text>
                  <Text style = { styles.userText }>{ this.state.user_information.last_name }</Text>
                  <Text style = { styles.userText }>friends: { this.state.user_information.friend_count }</Text>
                </View>
                <View style = {styles.addButton}> 
                    <Button
                    title = "Add friend"
                    color = "#87CEFA"
                    onPress = { () =>this.addFriend() }/>
                </View>           
             </View> 
             <View style = { styles.button }>
                <Button
                title="Back" 
                color = "#DCDCDC"
                onPress={ () => this.props.navigation.navigate("Profile" ) }/>
            </View> 
          </View>
          )
        }
     }   
}
const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#87CEFA'
    },
    headerContainer: {
      width:'100%',
      height:'12%',
      flexDirection: 'row',
      backgroundColor:'#DCDCDC',
      justifyContent:'space-between',
    },
    
    text: {
      fontSize: 18,
      fontFamily: "Cochin",
      marginTop: 12,
    },
    input: {
      fontSize: 20,
      marginLeft: 10,
      width: "90%",
    },
    titelText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: "Cochin",
      marginTop: 12,
    },
  
    button:{
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width: 100,
      height: 35,
      borderRadius:5,
      borderWidth: 1,
      borderColor: '#fff', 
    },
    addButton:{
      elevation: 8,
      borderRadius: 10,
      marginLeft: 10,
      marginTop:10,
      width: 105,
      height: 35,
      borderRadius:5,
      borderWidth: 1,
      borderColor: '#fff', 
    },
    userContainer: {
      width:'50%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
    },
    userText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 18,
      fontFamily: "Cochin",
      marginTop: 12,
    },
  });
export default AddFriend