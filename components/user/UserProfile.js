import React, {Component} from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendRequests from "./FriendRequests";
import AddFriend from "./AddFriend";
import Search from "./Search";
import Friends from "./Friends";
import DisplayPost from "./DisplayPost";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

class Profile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading: true,
            user_inf: [],
            friend_requests:[],
            id: '',
            user_information : [],
            first_name : '',
            last_name : '',
            friendsList : false,
            photo: null,
            postText: '',
            post_information: '',
            profile_id: null,
            error: null
        }
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.userInfo()
      this.uploadPhpto()
      await this.getPost()
      });
    
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }

      getPost = async () => {
        let getData = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(getData)
        // let user_id = session_data.id
        let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
        
    
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
          method: 'GET',
          headers: {
              'x-authorization': session_data.token
          },

        })
        //.then((response) => response.json())
        .then((response) => {
          if( !response.ok ){
            throw Error( 'Could not fetch data from the server' )
          }

          return response.json();
        })
        .then((responseJson) => {
          console.log(responseJson)
          this.setState({
              isLoading : false,
              post_information: responseJson
          })
      })
        .catch((err) => {
            this.setState({error: err})
        });
    }
    
  
    
    deletePost = async (user_id, post_id) => {
      let getData = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(getData)
      
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
  likePost = async (post_id,user_id) => {
      let getData = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(getData)
      
      console.log('Test Post',post_id, user_id);
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
        method: 'POST',
        headers: {
          
            'x-authorization': session_data.token,
            'Content-Type':'application/json'
        }
        
      })
       // I need to check the response and make condition check
      //.then((response) => response.json())
      .then((response) => {
        alert('You liked the post')
      })

        .then( (error) => {
            console.error(error);
        })
  }
  // I need to check the response and make condition check
  removeLikePost = async (post_id, user_id) => {
      let getData = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(getData)
      //let user_id = session_data.id
      // I am trying to get post_id
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
        method: 'DELETE',
        headers: {
            'x-authorization': session_data.token
        }
        
      })
      //.then((response) => response.json())
      .then(() => {
        console.log('Like removed')
        
    })

        .then( (error) => {
            console.error(error);
        })
  }
    
    addFriend = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details');
        let session_data = JSON.parse( data )
        let id = this.state.id
        
        fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`,{
            method: 'POST',
            headers: {
                'x-authorization': session_data.token
            },
        })
        .then( (response) => {
            //console.log(response);
            console.log('User updated');
            this.getData();
        })

        .then( (error) => {
            console.error(error);
        })
        
    }
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
    uploadPhpto = async () => {
        // Get these from AsyncStorage
        let getData = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(getData)
        //let user_id = session_data.id

        let user_id = null;
        if(typeof this.props.route.params === 'undefined'){
          user_id = session_data.id
        }else{
          console.log(this.props.route.params)
          user_id = this.props.route.params.user_id;
        }
  
        //let res = await fetch(data.base64);
        //let blob = await res.blob();
  
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
            method: "GET",
            headers: {
                "X-Authorization": session_data.token
            },
        })
        .then((res) => {
            return res.blob();
          })
          .then((resBlob) => {
            let data = URL.createObjectURL(resBlob);
            this.setState({
              photo: data,
              isLoading: false
            });
          })
          .catch((err) => {
            console.log("error", err)
          });
    }
    render(){
       // const showFriends = this.state.friendsList ? 'Show firends' : 'Hide friends';
        //{ showFriends } 
        // I need this photo
        /**
         <View style={styles.updateContainer}>
                       <Image  
                            source={{uri:'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png'}}
                            style={{height: 30, width: 40, margin: 5,}}
                            />
                        
                        <Button style={styles.button} title="Edit prof" 
                                onPress={()=> nav.navigate("User_info")}/>
                       </View>
              <Button style={styles.friendButton} title="Friends"
                                      onPress ={() => {
                                        getFriends(this.state.user_information.user_id)
                                         this.setState({
                                          friendsList : !this.state.friendsList })
                                  }}/> 

                {this.state.friendsList ? <Friends/>: <View><Text>Show friends</Text></View>}
                <Button style={styles.friendButton} title="Friends"
                                      onPress ={() => {
                                         this.setState({
                                          friendsList : !this.state.friendsList })
                                  }}/> 
         */
        const nav = this.props.navigation;
        const getInfo = (user_id) => {
          nav.navigate("User_info", {"user_id": user_id})
          console.log(user_id)}

          const getFriends = (user_id) => {
            nav.navigate("Friends", {"user_id": user_id})
            console.log(user_id)}

          const getDisplayPost = (user_id) => {
            nav.navigate("D####", {"user_id": user_id})
            console.log(user_id)}
          
           const getRequests = () => {
            nav.navigate("FriendRequests")}
            
           
            // I need to handle error if a user is not owen the post
            const getUpdatePost = (user_id, post_id) => {
              nav.navigate("UpdatePost", {"user_id": user_id,"post_id": post_id})
              console.log(user_id,post_id)}
          
            
            const getSinglePost = (user_id, post_id) => {
            nav.navigate("SinglePost", {"user_id": user_id,"post_id": post_id})
            console.log(user_id)}
        
        
        if(this.state.isLoading){
            return(
                <View>
                  <Text>Loading...</Text>
                  <ActivityIndicator
                        size="large"
                        color="#00ff00"/>
                </View>
            )
        }
        else {
            console.log("ME HERE", this.state.user_information.user_id);
            return(
                <View style={styles.container}> 
                   <View style={styles.headerContainer}>
                       <Image
                            source={{
                            uri: this.state.photo,
                            }}
                            style={{
                            width: 70,
                            height: 50,
                            borderWidth: 2,
                            margin: 10
                            }}
                        />
                      <View style={styles.userContainer}>
                        <Text style={styles.userText}>{this.state.user_information.first_name}</Text>
                        <Text style={styles.userText}>{this.state.user_information.last_name}</Text>
                        <Text style={styles.userText}>friends: {this.state.user_information.friend_count}</Text>
                      </View>
                      <View style={styles.updateContainer}>
                        <Button style={styles.updateButton} title="Edit prof" 
                                onPress={()=> getInfo(this.state.user_information.user_id)}/>
                      </View>
                    </View>
                       <View style={styles.friendContainer}>
                           <View>
                            <View style={styles.listContainer}>
                                <View style={styles.updateContainer}>
                                <Button style={styles.friendButton} title="Friends"
                                      onPress ={() => {
                                        getFriends(this.state.user_information.user_id)   
                                  }}/> 
                                </View>    
                            </View>
                               <View style={styles.updateContainer}>
                                   <Button style={styles.updateButton} title="addPost" 
                                        onPress={()=> nav.navigate("Post")}/>
                               </View>

                               <View style={styles.updateContainer}>
                                   <Button style={styles.updateButton} title="Search" 
                                        onPress={()=> nav.navigate("Search")}/>
                               </View>
                        </View>
                        
                        <View style={styles.postsContainer}>
                          <View style={styles.textContainer}>
                              <Text style={styles.titelText}>Posts</Text>
                              <Text>{this.state.error}</Text>
                          </View>
                        
                         <View style={styles.listContainer}>
                              <FlatList
                                  data = {this.state.post_information}
                                  renderItem={ ( {item} ) => (
                                  <View  style={styles.postContainer}>
                                      <TouchableOpacity onPress={()=>getSinglePost(item.author.user_id,item.post_id)}>
                                        <Text style={styles.text}>{item.author.first_name} {item.author.last_name}</Text>
                                        <Text style={styles.text}>{item.text}</Text>
                                        <Text style={styles.text}>{item.timestamp}</Text>
                                      </TouchableOpacity>
                                  <View style={styles.buttonContainer}>
                                <View>
                                    <View style={styles.removeButton}> 
                                        <TouchableHighlight onPress={()=>this.likePost(item.post_id,this.state.user_information.user_id)} style={styles.removeButton}>
                                        <Text style={styles.buttonText}>Like {item.numLikes}</Text>
                                        </TouchableHighlight>
                                    </View>
                                    <View style={styles.removeButton}> 
                                        <TouchableHighlight onPress={()=>this.removeLikePost(item.post_id,this.state.user_information.user_id)} style={styles.removeButton}>
                                        <Text style={styles.buttonText}>DisLike</Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                               
                                <View style={styles.removeButton}> 
                                <TouchableHighlight onPress={()=>getUpdatePost(item.author.user_id,item.post_id)} style={styles.removeButton}>
                                   <Text style={styles.buttonText}>Update</Text>
                                  </TouchableHighlight>
                                </View>
                                <View style={styles.removeButton}> 
                                <TouchableHighlight onPress={()=>this.deletePost(this.state.user_information.user_id,item.post_id)} style={styles.removeButton}>
                                   <Text style={styles.buttonText}>Delete</Text>
                                  </TouchableHighlight>
                                </View>
                            </View>
                            </View>
                                 
                                  )}
                              keyExtractor={(item,index)=> item.post_id.toString()}/>
                        </View>
                                    
                        </View>

                        <View style={styles.requestContainer}>
                          <Button style={styles.updateButton} title="Requests" 
                                  onPress={()=> getRequests()}/>
                        </View>      
                    </View>  
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
      },
      headerContainer: {
        width:'100%',
        height:'12%',
        flexDirection: 'row',
        backgroundColor:'#DCDCDC',
         //justify-content: flex-end         
        //alignItems:'center',
        justifyContent:'space-between',
      },
      postsContainer: {
        width:'60%',
        //height:'12%',
        flexDirection: 'column',
        backgroundColor:'#87CEFA',
         //justify-content: flex-end         
        alignItems:'center',
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
      requestContainer: {
        //height:'12%',
        //flexDirection: 'column',
        //backgroundColor:'#DCDCDC',
         //justify-content: flex-end         
        alignItems:'center',
        justifyContent:'space-between',
        paddingLeft:5
      },
      updateContainer: {
        alignItems:'center',
        justifyContent:'center',
        
        //flexDirection: 'row',
        //justifyContent: 'space-between',
        padding: 14,
        paddingLeft: 0
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
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 5,
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
        height: 30,
        
    },
    updateButton:{
        backgroundColor: "#009688",
        elevation: 8,
        borderRadius: 10,
        margin: 10,
        width: 40,
        height: 30,
        marginLeft: 10,
        
    },
      friendButton:{
      backgroundColor: "#009688",
      elevation: 8,
      borderRadius: 10,
      margin: 10,
      width:20,
      height:10,
      
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
  searchButton:{
    elevation: 8,
    borderRadius: 10,
    margin: 5,
    padding: 10,
    width: 95,
    height: 15,      
},

addButton:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 85,
    height: 15, 
    backgroundColor:'#eee',     
},
searchContainer: {
  //alignItems:'center',
  flexDirection: 'row',
  //justifyContent: 'space-between'
},
search:{
  elevation: 8,
  borderRadius: 10,
  margin: 10,
  width: 120,
  height: 40, 
  padding: 10,
  backgroundColor:'#DCDCDC', 
  fontSize: 14,
  fontFamily: "Cochin",   
},
  });
  
  

export default Profile