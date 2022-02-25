import React, { Component } from "react";
import { Text, Button, TextInput, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdatePost extends Component {
    render() {
        userInfo = async () => {
            let data = await AsyncStorage.getItem('@spacebook_details')
            let session_data = JSON.parse(data)
            //let user_id = session_data.id
            
            //console.log(this.props.route.params.user_id);
            let user_id = null;
            if(typeof this.props.route.params === 'undefined'){
              user_id = session_data.id
            }else{
              console.log(this.props.route.params)
              user_id = this.props.route.params.user_id;
            }
    
            
            fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
                method: 'PATCH',
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
        return(
            <View style={styles.listContainer}>
                    <FlatList
                        data = {this.state.post_information}
                        renderItem={ ( {item} ) => (
                        <View  style={styles.postContainer}>
                            <Text style={styles.text}>{item.author.first_name} {item.author.last_name}</Text>
                            <Text style={styles.text}>{item.text}</Text>
                            <Text style={styles.text}>{item.timestamp}</Text>
                            <View style={styles.buttonContainer}>
                                <View style={styles.removeButton}> 
                                 <TouchableHighlight onPress={()=>this.deletePost()} style={styles.removeButton}>
                                   <Text style={styles.buttonText}>Like</Text>
                                  </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                        )}
                    keyExtractor={(item,index)=> item.post_id.toString()}/>
              </View>
        )
    }
}
export default UpdatePost