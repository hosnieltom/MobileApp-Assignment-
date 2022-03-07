import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddPost extends Component {

    constructor( props ) {
        super( props );

        this.state = {
          text: ''
        };
    }
    componentDidMount(){
      //this.addPost()
    }

    postPost = async () => {
      let getData = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(getData)
      let user_id = session_data.id


      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
        method: 'POST',
        headers: {
            'x-authorization': session_data.token,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
          text:this.state.text })

      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('test',responseJson)
        this.setState({
            isLoading : false,
            post_information: responseJson
        })
      })
      .catch((error) => {
          console.error(error)
      });
  }
    render() {
        return(
            <View>
                <Text>Add Post</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="Type here..."
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}/>
                
                <View style={styles.button}> 
                    <Button
                    title="Post"
                    onPress={()=>this.postPost()}/>
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
  export default AddPost