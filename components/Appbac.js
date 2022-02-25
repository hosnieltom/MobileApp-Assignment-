import React, {Component} from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class App extends Component {
    
    constructor( props ) {
        super( props )
        this.state = {
            isLoading: true,
            friend_requests:[],
        }
    }

    getData = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details');
        let session_data = JSON.parse( data )

        fetch('http://localhost:3333/api/1.0.0/friendrequests',{
            method: 'GET',
            headers: {
                'x-authorization': session_data.token
            },
        })

        .then( (response) => response.json() )
        .then( (responseJson) => {
            console.log(responseJson)
            this.setState({
                isLoading: false,
                friend_requests: responseJson,
                })
        })
        .catch( (error) =>{
            console.error(error)
        })

    }
    componentDidMount(){
        this.getData()
    }

    render(){
        return(

            <View>
                <View>
                    <Text>Outstanding friends requests</Text>
                </View>
                <View>
                    <FlatList
                        data = {this.state.friend_requests}
                        renderItem={ ( {item} ) => (
                        <View>
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                        )}
                        keyExtractor={(item,index)=> item.user_id.toString()}
                        />
                </View>
            </View>
            
        )
    }
}

export default App

