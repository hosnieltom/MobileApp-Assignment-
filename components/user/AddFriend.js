import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddFriend extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            user_information : [],
            id: ''
        }
    }


    addFriend = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details');
        let session_data = JSON.parse( data )
        let id = this.state.id
        //the ID is the your firend i want to sent request
        fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`,{
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

    render() {
        return(
            <View>
                <Text>Add friend</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Enter ID..."
                    onChangeText={(id) => this.setState({id})}
                    value={this.state.id}
                    />
                
                <View style={styles.button}> 
                    <Button
                    title="Confirm"
                    onPress={()=>this.addFriend()}/>
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
      headerContainer: {
        //flex:0.2,
        flexdirection: 'row-reverse',
         //justify-content: flex-end         
        //alignItems:'center',
        justifyContent:'flex-end',
        //justifyContent: 'space-between',
        marginTop: 30,
        padding: 2,
      },
      textContainer: {
        flex:0.5,
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between'
      },
      listContainer: {
        flex:0.7,
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between',
        padding: 14,
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
        //backgroundColor: "#009688",
        elevation: 8,
        borderRadius: 10,
        //paddingVertical: 10,
        //paddingHorizontal: 12,
        margin: 10,
        width: 80,
        height: 30,
        
    },
    searchBar: {
        fontSize: 24,
        margin: 10,
        width: 120,
        height: 30,
        backgroundColor: 'white',
      },
  });
export default AddFriend