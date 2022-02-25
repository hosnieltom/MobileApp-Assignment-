import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Friends extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            friends_info : [],
        }
    }

    getFriends = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details');
        let session_data = JSON.parse( data )
        let user_id = session_data.id

        /*
        let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
         */
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/friends`,{
            method: 'GET',
            headers: {
                'x-authorization': session_data.token
            }
        })
        .then( (response) => response.json() )
        .then( (responseJson) => {
           // console.log(responseJson)
            this.setState({
                isLoading: false,
                friends_info: responseJson,
                
                })
        })
        .catch( (error) =>{
            console.error(error)
        })

    }
    componentDidMount(){
        this.getFriends()
    }
  
    

    render() {
        return(

           <View>
                <View>
                    <Text style={styles.titelText}>Friends</Text>
                </View>
                <View style={styles.listContainer}>
                    <FlatList
                        data = {this.state.friends_info}
                        renderItem={ ( {item} ) => (
                        <View>
                            <Text style={styles.text}>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                        )}
                    keyExtractor={(item,index)=> item.user_id.toString()}/>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
      },
      headerContainer: {
        width:'100%',
        height:'10%',
        flexDirection: 'row',
        backgroundColor:'#DCDCDC',
         //justify-content: flex-end         
        //alignItems:'center',
        justifyContent:'space-between',
      },
      friendContainer: {
        //alignItems:'center',
        //justifyContent:'center'
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
      },
      userContainer: {
        //alignItems:'center',
        //justifyContent:'center'
        width:'50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
      },
      userText: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
      },
      listContainer: {
       
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between',
        paddingTop: 5,
      },
      textContainer: {
        flex:0.5,
        //alignItems:'center',
        //justifyContent:'center'
        justifyContent: 'space-between'
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
        //flexDirection: 'row-reverse',
        //justifyContent: 'center',
        //justifyContent: 'space-between',
        //marginTop: 20,
        
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
  });

export default Friends


  