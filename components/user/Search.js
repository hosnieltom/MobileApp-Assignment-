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
       
        fetch(`http://localhost:3333/api/1.0.0/search`,{
            method: 'GET',
            headers: {
                'x-authorization': session_data.token
            },
        })
    
        .then( (response) => response.json() )
        .then( (responseJson) => {
            this.setState({
                isLoading: false,
                search_results: responseJson,
                })
        })
        .catch( (error) =>{
            console.error(error)
        })
        //http://localhost:3333/api/1.0.0/search?limit=5`
        //`http://localhost:3333/api/1.0.0/search?q=${this.state.search}`

    }
    componentDidMount(){
        this.getData()
    }

    addFriend = async () => {
      let data = await AsyncStorage.getItem('@spacebook_details');
      let session_data = JSON.parse( data )
      //let id = this.state.id
      //the ID is the your firend i want to sent request
      fetch(`http://localhost:3333/api/1.0.0/user/20/friends`,{
          method: 'POST',
          headers: {
              'x-authorization': session_data.token
          },
      })
      .then( (response) => {
          //console.log(response);
          console.log('User updated');
          //this.getData();
      })

      .then( (error) => {
          console.error(error);
      })
      
  }
    
    
   /*
    searchFunction = (text) => {
        const updatedData = this.arrayholder.filter((item) => {
          const item_data = `${item.user_givenname.toUpperCase()})`;
          const text_data = text.toUpperCase();
          return item_data.indexOf(text_data) > -1;
        });
        this.setState({ search_results: updatedData, searchValue: text });
      };


      filterList example
      <View>
               <View>
               <TextInput
                    onChangeText={(search) => this.setState({search})}
                    style={styles.searchBar}
                    />
                    {this.filterList(names).map((listItem, index) => (
                    <Text style={styles.text} key={index}>{ listItem.user_givenname } { listItem.user_familyname }</Text>
                    ))}
               </View>

            </View>
            <View style={styles.button}> 
                    <Button
                    title="AddFriend"
                    onPress={()=>this.addFriend()}/>
                </View>
      */
      //filterList(names) {
        //return names.filter(listItem => listItem.user_givenname.toLowerCase().includes(this.state.search.toLowerCase()));
     // }

    render() {
      const nav = this.props.navigation;
      const getProfile = (user_id) => {
        nav.navigate("Profile", {"user_id": user_id})
        console.log(user_id)
        //nav.navigate("Profile", item.user_id)
       }

        return(

          <View style={styles.container}>
            <View>
              <TextInput
                     //value={query}
                     placeholder="Search"
                      onChangeText={(search) => this.setState({search})}
                      //style={styles.searchBar}
                      />
            </View>
            <View style={styles.listContainer}>
                
               <FlatList
                  data = {this.state.search_results}
                  renderItem={ ( {item} ) => (
                  <View>
                      <TouchableOpacity onPress={() => getProfile(item.user_id)}>
                         <Text style={styles.text}>{item.user_givenname} {item.user_familyname}</Text>
                        </TouchableOpacity>
                      
                      <View style={styles.buttonContainer}>
                        
                          <View style={styles.button}> 
                              <Button
                              title="Confirm"
                              onPress={()=>this.acceptRequest()}/>
                          </View>
                          < View style={styles.removeButton}> 
                              <Button
                              title="Remove"
                              onPress={()=>this.removeFriend()}/>
                          </View>
                      </View>
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
  removeButton:{
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width: 85,
      height: 20, 
      backgroundColor:'#eee',     
  },
});


export default SearchForFriend