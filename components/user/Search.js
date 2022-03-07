import React, {Component} from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from "react-native-gesture-handler";

class SearchForFriend extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading: true,
            search_results:[],
            search:'',

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
      const nav = this.props.navigation;
      const getProfile = (user_id) => {
        nav.navigate("Profile", {"user_id": user_id})
        console.log(user_id)
        //nav.navigate("Profile", item.user_id)
       }

        return(

          <View style={styles.container}>
            <View style={styles.searchContainer}>
              <View style={styles.searchField}>
                <TextInput
                      placeholder="Search"
                      style={styles.search}
                      onChangeText={(text) => this.setState({"search": text})}
                      value={this.state.search}
                        />
              </View>
              <View style={styles.searchButton}> 
                  <Button onPress={() => this.getData()} 
                    style={styles.addButton}
                    title='Search'>
                      <Text>Search!</Text>
                  </Button>
              </View>
            </View>
            <View style={styles.listContainer}>
                
               <FlatList
                  data = {this.state.search_results}
                  renderItem={ ( {item} ) => (
                  <View>
                      <TouchableOpacity onPress={() => getProfile(item.user_id)}>
                         <Text style={styles.text}>{item.user_givenname} {item.user_familyname}</Text>
                        </TouchableOpacity>
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
    searchContainer: {
      //alignItems:'center',
      flexDirection: 'row',
      //justifyContent: 'space-between'
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
  searchButton:{
      elevation: 8,
      borderRadius: 10,
      margin: 5,
      padding: 10,
      width: 100,
      height: 15,      
  },
   button:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 100,
    height: 15,      
},
  addButton:{
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width: 85,
      height: 15, 
      backgroundColor:'#eee',     
  },
  search:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 180,
    height: 40, 
    padding: 10,
    backgroundColor:'#8ec3eb', 
    fontSize: 20,
    fontFamily: "Cochin",   
},
  searchField:{
    //elevation: 8,
    //borderRadius: 10,
    //margin: 10,
    //width: 180,
    //height: 30,      
},
});


export default SearchForFriend