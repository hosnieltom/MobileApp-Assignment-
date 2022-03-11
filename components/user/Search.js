import React, { Component } from "react";
import { Text, Button, View, StyleSheet, FlatList, ActivityIndicator, TextInput, StatusBar } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

class SearchForFriend extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            isLoading: true,
            search_results:[],
            search:'',
            error: ''
        }
    }

    getData = async () => {
      let data = await AsyncStorage.getItem( '@spacebook_details' );
      let session_data = JSON.parse( data )
     
      fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}`,{
          method: 'GET',
          headers: {
              'x-authorization': session_data.token
          },
      })
      
      .then( (response) => {

        if( !response.ok ){
                
          if ( response.status  === 400 ) 
            throw Error( 'Bad Request' )

          else if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )
              
          else if ( response.status  === 404 ) 
            throw Error( 'Page not found' ) 

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else
            throw Error( 'Check server connection' )
      }
        return response.json()
      } )

      .then( ( responseJson ) => {
          this.setState( {
          isLoading: false,
          search_results: responseJson  } )
      })
      .catch( ( error ) => {
          this.setState( { error: error.message } )
      })
   }
  
    componentDidMount() {
        this.getData()
    }

    render() {

      if(this.state.isLoading){
        return(
            <View style = { styles.container }>
                <Text>Loading...</Text>
                <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                <ActivityIndicator
                  size = "large"
                  color = "#00ff00"/>
            </View>
        )
      }
      else {
        const nav = this.props.navigation;
        const getProfile = ( user_id ) => {
        nav.navigate( "Profile", { "user_id": user_id })
        }

        return(

          <View style = { styles.container }>
            <View style = { styles.searchContainer }>
              <View style = { styles.searchBar }>
                <TextInput
                  placeholder="Search"
                  style = { styles.search }
                  onChangeText = { ( text ) => this.setState( { "search": text } ) }
                  value = { this.state.search }
                  />
              </View>
              <View style = { styles.searchButton }> 
                <Button onPress = { () => this.getData() } 
                  color = "#DCDCDC"
                  title = 'Search'>
                  <Text>Search!</Text>
                </Button>
              </View>
              <View style = { styles.button }>
                <Button  
                title = "Back" 
                color = "#DCDCDC"
                onPress = { () => this.props.navigation.navigate( "Profile" ) }/>
            </View> 
            </View>
              <ScrollView style = { styles.scrollcontainer }>
                <View style = { styles.listContainer }>
                  <FlatList
                    data = { this.state.search_results }
                    renderItem = { ( {item} ) => (
                    <View>
                      <TouchableOpacity onPress = { () => getProfile( item.user_id ) }>
                        <Text style = { styles.text }>{ item.user_givenname } { item.user_familyname }</Text>
                      </TouchableOpacity>
                    </View>
                    )}
                    keyExtractor = { ( item,index) => item.user_id.toString() }
                    />
                </View>
              </ScrollView>
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
    searchContainer: {
      flexDirection: 'row',
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
    },
    scrollcontainer: {
      flex:1,
      paddingTop: StatusBar.currentHeight,
    },
    text: {
      fontSize: 16,
      fontFamily: "Cochin",
      marginTop: 10,
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
  searchButton:{
      elevation: 8,
      borderRadius: 5,
      marginTop: 15,
      width: 80,
      height: 35,
      borderWidth: 1,
      borderColor: '#fff',      
  },
   button:{
    elevation: 8,
    borderRadius: 5,
    margin: 10,
    width: 75,
    height: 35,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop:15     
  },
  search:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 180,
    height: 37, 
    padding: 10,
    backgroundColor:'#fff', 
    fontSize: 18,
    fontFamily: "Cochin",   
  },
  searchBar:{
    paddingTop: 5  
  },
});

export default SearchForFriend