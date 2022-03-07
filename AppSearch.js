
import React, { Component } from 'react';
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput, Image } from "react-native";
import { SearchBar } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";

class App extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading: true,
            search_results:[],
            search:'',
            foundUser: [],
            user_givenname: '',
            setFilterData: [],
        }
    }

    getData = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details');
        let session_data = JSON.parse( data )
       
        fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.search}`,{
            method: 'GET',
            headers: {
                'x-authorization': session_data.token
            },
        })
        // I need to check the response and make condition check
        .then( (response) => response.json() )
        .then( (responseJson) => {
            
            this.setState({
            isLoading: false,
            search_results: responseJson  })
        })
        .catch( (error) =>{
            console.error(error)
        })
    }
    
    componentDidMount(){
        
        this.getData()
    }

    render() {
        

        const itemView = (item)=> {

            return (
                 <Text style={styles.text}>{item.user_givenname} {item.user_familyname}</Text>  
            )
        }
       
        return(

          <View style={styles.container}>
            <View>
                <View>
                <TextInput
                        placeholder="Search"
                        onChangeText={(text) => this.setState({"search": text})}
                        value={this.state.search}
                        />
                </View>
            
                <View style={styles.button}> 
                <Button onPress={() => this.getData()} style={styles.addButton}>
                    <Text>Search!</Text>
                </Button>
                </View>
                
            </View>
            <View style={styles.listContainer}>
                
               <FlatList
                  data = {this.state.search_results}
                  renderItem={ ( {item} ) => (
                    <View>
                        
                         <Text style={styles.text}>{item.user_givenname} {item.user_familyname}</Text>
                     
                    </View>
                    )}
                  
                  keyExtractor={(item,index)=> item.user_id.toString()}
                  />
             </View>
          </View>
            

        )
    }
}
const styles = StyleSheet.create({
  container: {
      flex:1,
    },
    textContainer: {
      //flex:0.5,
      //alignItems:'center',
      //justifyContent:'center'
      justifyContent: 'space-between'
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
    },
    text: {
      fontSize: 16,
      fontFamily: "Cochin",
      marginTop: 10,
    },
    titelText: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 24,
      fontFamily: "Cochin",
      marginTop: 12,
    },
  inputField: {
     padding: 14,
    fontSize: 22,
    width: '90%'
  },
  buttonContainer:{
      flexDirection: 'row',
      //justifyContent: 'center',
      //justifyContent: 'space-between',
      //marginTop: 20,
      
  },
  button:{
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width: 85,
      height: 20,      
  },
  addButton:{
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width: 85,
      height: 40, 
      backgroundColor:'#eee',     
  },
  searchButton:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 120,
    height: 30, 
    backgroundColor:'#eee',     
},
});


export default App