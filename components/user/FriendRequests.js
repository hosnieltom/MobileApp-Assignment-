import React, {Component} from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import AcceptFriend from "./Friends";

class FriendRequests extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            //showEdit : false,
            friend_requests : [],

            // I need to check if I wanna use these fields
            first_name : '',
            user_id : '',
        }
    }
    

    getData = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        
        fetch('http://localhost:3333/api/1.0.0/friendrequests', {
            method: 'Get',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then(( response ) => response.json())
        .then((responseJson) => {
            this.setState({
                isLoading : false,
                friend_requests : responseJson
            })
        })
        .catch((error) => {
            console.log(error)
        })
      
    }

    acceptRequest= async() =>{

        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        //let user_id = session_data.id
        //let id = this.state.friend_requests[0].user_id
        let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
        //the ID is the your firend request id
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${user_id}`, {
            method: 'POST',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then( (response) => {
            console.log('test');
            console.log('Request accepted');
            this.getData()
        })
    
        .then( (error) => {
            console.error(error);
        })
    }

    componentDidMount(){
        this.getData()
    }

    removeFriend = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        let user_id = session_data.id
        let id = this.state.friend_requests[0].user_id
        console.log('hello'+this.state.friend_requests.user_id)
        //the ID is the your firend request id
        fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
            method: 'DELETE',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then( (response) => {
            console.log('test');
            console.log('Request accepted');
            this.getData()
        })
    
        .then( (error) => {
            console.error(error);
        })

    }

    render(){
        //const nav = this.props.navigation;
        console.log(this.state.friend_requests)
        return(

            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <Text style={styles.titelText}>Requests</Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data = {this.state.friend_requests}
                        renderItem={ ( {item} ) => (
                        <View>
                            <Text style={styles.text}>{item.first_name} {item.last_name}</Text>
                            
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
        alignItems:'center',
        justifyContent:'center'
      },
      textContainer: {
        //flex:0.5,
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between'
      },
      listContainer: {
        //flex:0.7,
        //alignItems:'center',
        //justifyContent:'center'
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
        fontSize: 16,
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
        justifyContent: 'space-between',
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

export default FriendRequests

