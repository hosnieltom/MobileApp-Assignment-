import React, {Component} from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,TextInput, Image } from "react-native";
//import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FriendRequests from "./FriendRequests";
import AddFriend from "./AddFriend";
import Search from "./Search";
import Friends from "./Friends";
import DisplayPost from "./DisplayPost";

//import Image from '@assets/profile.png';
//<Image style={{height: 20, width: 20}} source={require('Image')}/>


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
            postText: ''
        }
    }

    
    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.userInfo()
        this.uploadPhpto()
      });
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }


    idValidator(){
        if(this.state.id==="")
        {
          //this.setState({idError:"id field ca not be empty"})
          alert("id field ca not be empty")
        }
        /*
        else{
          this.setState({idError:" "})
           <Text style={{color:'red'}}>{this.state.idError}</Text>
        }
        */
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
         */
        const nav = this.props.navigation;
        const getInfo = (user_id) => {
          nav.navigate("User_info", {"user_id": user_id})
          console.log(user_id)}

          const getFriends = (user_id) => {
            nav.navigate("####", {"user_id": user_id})
            console.log(user_id)}
          const getDisplayPost = (user_id) => {
            nav.navigate("UpdatePost", {"user_id": user_id})
            console.log(user_id)}
          
        //nav.navigate("Profile", item.user_id)}
          //onPress={()=> nav.navigate("User_info")}

        if(this.state.isLoading){
            return(
                <View><Text>Loading...</Text></View>
            )
        }
        else {
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
                                
                                {this.state.friendsList ? <Friends/>: <View><Text>Show friends</Text></View>}
                                <View style={styles.updateContainer}>
                                  <Button style={styles.friendButton} title="Friends"
                                      onPress ={() => {
                                         this.setState({
                                          friendsList : !this.state.friendsList })
                                  }}/> 
                                </View>    
                            </View>
                            <View style={styles.updateContainer}>
                                <Button style={styles.updateButton} title="addPost" 
                                        onPress={()=> nav.navigate("Post")}/>
                               </View>
                        </View>
                        
                        <View style={styles.postsContainer}>
                          <DisplayPost></DisplayPost>
                        </View>
                       
                        <View style={styles.requestContainer}>
                          <FriendRequests></FriendRequests>
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
        //padding: 14,
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
  });
  
  

export default Profile