import React,{ Component } from "react";
import { Text, TextInput, View, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from "react-native-gesture-handler";
import UserProfile from './UserProfile'

class SinglePost extends Component {

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
    getPost = async (user_id, post_id) => {
        let getData = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(getData)
        //let user_id = session_data.id
        
    
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
          method: 'GET',
          headers: {
              'x-authorization': session_data.token
          },

        })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
              isLoading : false,
              post_information: responseJson
          })
      })
        .catch((error) => {
            console.error(error)
        });
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            let { user_id,post_id } = this.props.route.params; 
            console.log("Who am I", user_id, post_id);
            this.setState({"profile_id": user_id, "postID": post_id});
    //this.deletePost
        await this.getPost(user_id, post_id)
        //await this.likePost()
        });
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
 
    render() {
      
        return(
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.titelText}>Post Details</Text>
                </View>
                <View style={styles.listContainer}>
                        <View  style={styles.postContainer}>
                            <Text style={styles.text}>Post ID: {this.state.post_information.post_id}</Text>
                            <Text style={styles.text}>Post: {this.state.post_information.text}</Text>
                            <Text style={styles.text}>Time: {this.state.post_information.timestamp}</Text>
                            <Text style={styles.text}>Number of Likes: {this.state.post_information.numLikes}</Text>
                        </View>
                       
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
      postContainer: {
        //width:'100%',
        //height:'30%',
        flexDirection: 'column',
        backgroundColor:'#DCDCDC',
         //justify-content: flex-end         
        //alignItems:'center',
        marginTop: 10,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        //width:'60%',
    },
    button:{
        //backgroundColor: "#009688",
        elevation: 8,
        borderRadius: 10,
        //paddingVertical: 10,
        //paddingHorizontal: 12,
        margin: 10,
        width: 80,
        height: 30 
    },
    removeButton:{
        elevation: 8,
        borderRadius: 10,
        alignItems:'center',
        width: 50,
        height: 20, 
        backgroundColor:'#eee', 
           
    },
    buttonText: {
        fontSize: 12,
        fontFamily: "Cochin",
      },
  });


export default SinglePost