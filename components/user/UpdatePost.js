import React, { Component } from "react";
import { Text, Button, TextInput, View, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdatePost extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            post_information : [],
            text: '',
            profile_id: null,
            postID: null
            
        }
    }
    

    updatePost = async (user_id, post_id) => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)
        
        let orig_text = this.state.post_information.text;
        let to_send={}
        
        if( this.state.text != orig_text) {
            to_send['text'] = this.state.text; 
            }

        console.log(JSON.stringify(to_send))

        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
            method: 'PATCH',
            headers: {
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
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
        let { user_id,post_id } = this.props.route.params; 
        console.log("Who am I", user_id, post_id);
        this.setState({"profile_id": user_id, "postID": post_id});
    //this.deletePost
        await this.updatePost(user_id,post_id)
        //await this.likePost()
        });
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
    /*
    let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
    post_id: '',
            text: '',
            timestamp: '',
            user_id: '',
            firsr_name: '',
            last_name: '',
            email: '',
            numLike: '',
            author: ''
    let orig_post_id = this.state.post_information.post_id
    let orig_timestamp = this.state.post_information.timestamp
        let orig_user_id = this.state.post_information.author.user_id
        let orig_first_name = this.state.post_information.author.firsr_name
        let orig_last_name = this.state.post_information.author.author.last_name
        let orig_email = this.state.post_information.email;
        let orig_numLike = this.state.post_information.numLike;
     */
    
    render() {
        
        return(
            <View style={styles.container}> 
                <View style={styles.textContainer}>
                    <Text style={styles.titelText}>Update post</Text>

                    <TextInput
                        placeholder="Enter new first name..."
                        onChangeText={(text) => this.setState({text})}
                        value={this.state.text}/>
                    
                </View>
                    <View style={styles.buttonContainer} >
                        <Button style={styles.button} title="Update post" 
                        onPress={()=> this.updatePost()}/>
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
export default UpdatePost