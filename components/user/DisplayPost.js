import React,{ Component } from "react";
import { Text, TextInput, View, Button, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from "react-native-gesture-handler";

class DisplayPost extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            post_information : [],
            text: ''
        }
    }
    getPost = async () => {
        let getData = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(getData)
        let user_id = session_data.id
  
  
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
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

    deletePost = async () => {
        let getData = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(getData)
        let post_id = this.state.post_information[0].post_id
        let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
        
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
          method: 'DELETE',
          headers: {
              'x-authorization': session_data.token
          },

        })
        .then( (response) => {
            console.log('test');
            console.log('Post deleted');
            this.getPost()
        })
        .catch((error) => {
            console.error(error)
        });
    }
    componentDidMount(){
        this.deletePost
        this.getPost()
    }

    

    /*

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.deletePost
          this.getPost()
        });
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }

    <Button
    fontSize={10}
    title="Confirm"
    onPress={()=>this.acceptRequest()}/>
     
     */
    render() {
        const nav = this.props.navigation;
        const getUpdatePost = (user_id) => {
            nav.navigate("UpdatePost", {"user_id": user_id})
            console.log(user_id)}
        return(
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.titelText}>Posts</Text>
                </View>
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
                                <View style={styles.removeButton}> 
                                <TouchableHighlight onPress={()=>getUpdatePost(item.author.user_id)} style={styles.removeButton}>
                                   <Text style={styles.buttonText}>Update</Text>
                                  </TouchableHighlight>
                                </View>
                                <View style={styles.removeButton}> 
                                <TouchableHighlight onPress={()=>this.deletePost()} style={styles.removeButton}>
                                   <Text style={styles.buttonText}>Delete</Text>
                                  </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                        )}
                    keyExtractor={(item,index)=> item.post_id.toString()}/>
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


export default DisplayPost