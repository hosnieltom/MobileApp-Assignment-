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
            friend_count : '',
        }
    }

    getData = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        let user_id = session_data.id
        console.log(user_id)
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
            method: 'Get',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then(( response ) => response.json())
        .then((responseJson) => {
            this.setState({
                isLoading : false,
                user_information : responseJson
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    updateUser = async() => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        let user_id = session_data.id
        let to_send={}
        let orig_first_name = this.state.user_information.first_name;
        let orig_last_name = this.state.user_information.last_name;
        let orig_email = this.state.user_information.email;
        let orig_friend_count = this.state.user_information.friend_count;

        if( this.state.first_name != orig_first_name ) {
        to_send['first_name'] = this.state.first_name; 
        }

        if( this.state.last_name != orig_last_name ) {
            to_send['last_name'] = this.state.last_name;
        }
        
        if( this.state.email != orig_email ) {
            to_send['email'] = this.state.email
        }

        if( this.state.friend_count != orig_friend_count ) {
            to_send['friend_count'] = parseInt(this.state.friend_count)
        }

        console.log(JSON.stringify(to_send))

        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
            method : 'PATCH',
            headers : {
                'content-type': 'application/json',
                'x-authorization': session_data.token
            },
            body : JSON.stringify(to_send)
        })

        .then( (response) => {
            console.log(response);
            console.log('User updated');
        })

        .then( (error) => {
            console.error(error);
        })

    }
    componentDidMount(){
        this.getData()
    }

    render(){
        return (
            /*
            <TextInput
                    placeholder="Enter user ID..."
                    onChangeText={(user_id) => this.setState({user_id})}
                    value={this.state.user_id}/>
             */

            <View style={styles.container}> 
                <View style={styles.textContainer}>
                    <Text style={styles.titelText}>Update a User</Text>

                    <TextInput
                        placeholder="Enter new first name..."
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}/>

                    <TextInput
                        placeholder="Enter new last name..."
                        onChangeText={(last_name)=> this.setState({last_name})}
                        value={this.state.last_name}/>

                    <TextInput
                        placeholder="Enter new email.."
                        onChangeText={(email)=> this.setState({email})}
                        value={this.state.email}/>

                    <TextInput
                        placeholder="Enter new friend count..."
                        onChangeText={(friend_count)=> this.setState({friend_count})}
                        value={this.state.friend_count}/>
                </View>
                    <View style={styles.buttonContainer} >
                        <Button style={styles.button} title="Update user" 
                        onPress={()=> this.updateUser()}/>
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
        flex:0.4,
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between'
      },
      text: {
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
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
        flex:0.7,
        //flexDirection: 'row-reverse',
        //justifyContent: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        
    },
    button:{
        backgroundColor: "#009688",
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
    },
  });

  export default UpdateUser