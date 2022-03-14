import React, { Component } from "react";
import { Text, Button, View, StyleSheet, FlatList,ActivityIndicator,Image, StatusBar} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight,ScrollView, TouchableOpacity } from "react-native-gesture-handler";

class Profile extends Component {

    constructor( props ) {
        super( props )

        this.state = {
          isLoading: true,
          user_inf: [],
          friend_requests:[],
          user_information : [],
          friendsList : false,
          photo: null,
          postText: '',
          post_information: [],
          profile_id: null,
          error: null
        }
    }

    componentDidMount(){

      this.unsubscribe = this.props.navigation.addListener('focus', async () => {
      await this.getData()
      await this.uploadPhpto()
      await this.getPost()
      });
    
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }

    getData = async () => {

      let data = await AsyncStorage.getItem('@spacebook_details')
      let session_data = JSON.parse(data)
     
      let user_id = null;
      if(typeof this.props.route.params === 'undefined'){
        user_id = session_data.id
      }
      else 
        user_id = this.props.route.params.user_id;
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}`, {
          method: 'Get',
          headers: {
              'x-authorization': session_data.token
          }
      })
      .then(( response ) => { 

        if( !response.ok ){
                
          if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )
              
          else if ( response.status  === 404 ) 
            throw Error( 'Page not found' ) 

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else
            throw Error( 'Check server connection' )
      }
      return response.json();

       })
      .then((responseJson) => {
          this.setState({
              isLoading : false,
              user_information : responseJson
          })
      })
      .catch(( error ) => {
          this.setState( { error: error.message } )
      })
    
    }

    getPost = async () => {

      let getData = await AsyncStorage.getItem( '@spacebook_details' )
      let session_data = JSON.parse( getData )

      let user_id = null;
      if( typeof this.props.route.params === 'undefined' ){
        user_id = session_data.id
      }
      else 
        user_id = this.props.route.params.user_id;
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post`, {
        method: 'GET',
        headers: {
            'x-authorization': session_data.token
        },

      })

      .then(( response ) => {
        if( !response.ok ) {

          if ( response.status  === 400 ) 
            throw Error( 'Bad Request' ) 

          else if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )

          else if( response.status === 403 ){
            //throw Error( 'You are forbidden to view posts' )
            const nav = this.props.navigation;
            nav.navigate( "AddFriend", { "user_id": user_id } ) 
          }

          else if( response.status === 404 )
              throw Error( 'Page not found' )

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else 
            throw Error( 'Check your connection' )
        }

        return response.json();
      })

      .then((responseJson) => {
        this.setState( {
            isLoading : false,
            post_information: responseJson
        })
      })

        .catch( ( error ) => {
            this.setState( { error: error.message } )
        });
    }
    
    deletePost = async ( user_id, post_id ) => {
      let getData = await AsyncStorage.getItem( '@spacebook_details' ) 
      let session_data = JSON.parse( getData )
      
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
        method: 'DELETE',
        headers: {
            'x-authorization': session_data.token
        },

      })

      .then( ( response ) => {
        
        if( !response.ok ) {
                    
          if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )

          else if ( response.status  === 403 ) 
            throw Error( 'Forbidden - you can only delete your own posts' )
              
          else if ( response.status  === 404 ) 
            throw Error( 'Page not found' ) 

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else
            throw Error( 'Check server connection' )
         }
           alert( "Post deleted" ),
          this.getPost()
      })

      .catch(( error ) => {
          this.setState( { error: error.message } )
      });
    }

    likePost = async (post_id,user_id) => {
        let getData = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( getData )
        
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
          method: 'POST',
          headers: {
              'x-authorization': session_data.token,
              'Content-Type':'application/json'
          }
        })

        .then( ( response ) => {
          
          if( !response.ok ) {

            if ( response.status  === 400 ) 
              throw Error( 'Forbidden - You have already liked this post' )
                    
            else if ( response.status  === 401 ) 
              throw Error( 'You are Unauthorized' )
  
            else if ( response.status  === 403 ) 
              throw Error( 'You can not like your post' )
              
            else if ( response.status  === 404 ) 
              throw Error( 'Page not found' ) 
  
            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 
  
            else
              throw Error( 'Check server connection' )
           }
          this.getPost()
        })

        .catch( ( error ) => {
            this.setState( { error: error.message } )
        })
    }
  
    removeLikePost = async ( post_id, user_id ) => {

      let getData = await AsyncStorage.getItem( '@spacebook_details' )
      let session_data = JSON.parse(getData)
     
      fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}/like`, {
        method: 'DELETE',
        headers: {
            'x-authorization': session_data.token
        } 
      })
      .then(( response ) => {
          
        if( !response.ok ) {
                  
          if ( response.status  === 401 ) 
            throw Error( 'You are Unauthorized' )

          else if ( response.status  === 403 ) 
            throw Error( 'Forbidden - you have not liked this post' )
              
          else if ( response.status  === 404 ) 
            throw Error( 'Page not found' ) 

          else if ( response.status  === 500 ) 
            throw Error( 'Server Error' ) 

          else
            throw Error( 'Check server connection' )
         }
         this.getPost()
      })

      .catch( ( error ) => {
          this.setState( { error: error.message } )
      })
    }
      
    uploadPhpto = async () => {

        let getData = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse(getData)

        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ) {
          user_id = session_data.id
        }
        else 
          user_id = this.props.route.params.user_id;
  
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
            method: "GET",
            headers: {
                "X-Authorization": session_data.token
            },
        })

        .then((response ) => {
          
          if( !response.ok ) {

            if ( response.status  === 400 ) 
              throw Error( 'Bad Request' ) 

            else if ( response.status  === 401 ) 
              throw Error( 'You are Unauthorized to upload photo' )

            else if( response.status === 404 )
                throw Error( 'Data not found' )

            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 

            else 
                throw Error( 'Check your connection' )
          }
            return response.blob();
        })
        .then(( resBlob ) => {
          let data = URL.createObjectURL( resBlob );
          this.setState({
            photo: data,
            isLoading: false
          });
        })
        .catch(( error ) => {
          this.setState( { error: error.message } )
        });
    }
    
    render(){

      const nav = this.props.navigation;
      const getInfo = ( user_id ) => {
      nav.navigate( "User_info", { "user_id": user_id } ) }

      const getFriends = ( user_id ) => {
      nav.navigate( "Friends", { "user_id": user_id } ) }
        
      const getUpdatePost = ( user_id, post_id ) => {
      nav.navigate( "UpdatePost", { "user_id": user_id,"post_id": post_id } ) }
    
          
      const getSinglePost = ( user_id, post_id ) => {
      nav.navigate( "SinglePost", { "user_id": user_id,"post_id": post_id } ) }

      const getRequests = ( user_id ) => {
        nav.navigate( "FriendRequests", { "user_id": user_id } ) }
  
      if( this.state.isLoading ) {

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
        
        return (
          
          <View style = { styles.container }> 
            <View style = { styles.headerContainer }>
                <Image
                  source = {{
                  uri: this.state.photo,
                  }}
                  style = {{
                  width: 70,
                  height: 50,
                  borderWidth: 2,
                  margin: 10
                  }}
                  />
                <View style = { styles.userContainer }>
                  <Text style = { styles.userText }>{ this.state.user_information.first_name }</Text>
                  <Text style = { styles.userText }>{ this.state.user_information.last_name }</Text>
                  <Text style = { styles.userText }>friends: { this.state.user_information.friend_count }</Text>
                </View>
                <View style = { styles.updateContainer }>
                  <Button 
                      style = { styles.updateButton }
                       title = "Edit Info"
                       color = "#87CEFA"
                      onPress = { () => getInfo( this.state.user_information.user_id ) }/>
                </View>
            </View>
            <View style = { styles.friendContainer }>
                <View>
                  <View style = { styles.listContainer }>
                      <View style = { styles.updateContainer }>
                      <Button 
                          style = { styles.friendButton }
                          title = "Friends"
                          color = "#87CEFA"
                          onPress = { () => {
                            getFriends( this.state.user_information.user_id )   
                      }}/> 
                      </View>    
                  </View>
                  <View style = { styles.updateContainer }>
                    <Button 
                        style = { styles.updateButton }
                        title = "addPost"
                        color = "#87CEFA" 
                        onPress = { ()=> nav.navigate("Post" ) }/>
                  </View>
                </View>
            <View style = { styles.postsContainer }>
                <View style = { styles.textContainer }>
                  <Text style = { styles.titelText }>Posts</Text>
                  <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                </View>
              
                <ScrollView style = { styles.scrollcontainer }> 
                  <View style = { styles.listContainer }>
                    <FlatList
                        data = { this.state.post_information }
                        renderItem = { ( { item } ) => (
                        <View  style = { styles.postContainer }>
                            <TouchableOpacity onPress = { () => getSinglePost( item.author.user_id,item.post_id ) }>
                              <Text style = { styles.text }>{ item.author.first_name } { item.author.last_name }</Text>
                              <Text style = { styles.text }>{ item.text }</Text>
                              <Text style = { styles.text }>{ item.timestamp }</Text>
                            </TouchableOpacity>
                        <View style = { styles.buttonContainer }>
                        <View>
                            <View style = { styles.removeButton }> 
                                <TouchableHighlight onPress = { () => this.likePost( item.post_id,this.state.user_information.user_id ) } 
                                style = { styles.removeButton }>
                                <Text style = { styles.buttonText }>Like { item.numLikes }</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={ styles.removeButton }> 
                                <TouchableHighlight onPress = { () => this.removeLikePost( item.post_id,this.state.user_information.user_id ) } 
                                style = { styles.removeButton }>
                                <Text style = { styles.buttonText }>DisLike</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                            <View style = { styles.removeButton }> 
                              <TouchableHighlight onPress={ () => getUpdatePost( item.author.user_id,item.post_id ) } 
                              style = { styles.removeButton }>
                              <Text style = { styles.buttonText }>Update</Text>
                              </TouchableHighlight>
                            </View>
                            <View style = { styles.removeButton }> 
                              <TouchableHighlight onPress = { () => this.deletePost( this.state.user_information.user_id,item.post_id ) }
                              style={ styles.removeButton }>
                              <Text style = { styles.buttonText }>Delete</Text>
                              </TouchableHighlight>
                            </View>
                          </View>
                      </View>  
                      )}
                        keyExtractor = { ( item,index) => item.post_id.toString() }/>
                    </View>          
                </ScrollView>  
                </View>
                    <View style = { styles.leftButtonsContainer }>
                      <View style = { styles.leftButtonContainer }>
                        <Button 
                            style = { styles.updateButton } 
                            title = "Requests"
                            color = "#87CEFA"
                            onPress={ () => getRequests( this.state.user_information.user_id ) }/>
                      </View> 
                      <View style = { styles.updateContainer }>
                      <Button 
                          style = { styles.updateButton }
                          title = "Search"
                          color = "#87CEFA"
                          onPress = { () => nav.navigate( "Search" ) }/>
                      </View> 
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
  scrollcontainer: {
    flex:1,
    paddingTop: StatusBar.currentHeight,
  },
  headerContainer: {
    width:'100%',
    height:'12%',
    flexDirection: 'row',
    backgroundColor:'#DCDCDC',
    justifyContent:'space-between',
  },
  postsContainer: {
    width:'54%',
    flexDirection: 'column',
    backgroundColor:'#87CEFA',        
    alignItems:'center',
    justifyContent:'space-between',
    marginRight:0
  },
  postContainer: {
    flexDirection: 'column',
    backgroundColor:'#DCDCDC',
    marginTop: 10,
    justifyContent:'space-between',
  },
  requestContainer: {         
    alignItems:'center',
    justifyContent:'space-between',
    paddingLeft:5
  },
  updateContainer: {
    alignItems:'center',
    justifyContent:'center',
    padding: 14,
    borderRadius:10,
    borderColor: '#fff',
    paddingLeft: 0
  },

  friendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  userContainer: {
    width:'50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  userText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: "Cochin",
    marginTop: 12,
  },
  listContainer: {
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  textContainer: {
    justifyContent: 'space-between'
  },
  text: {
    fontSize: 16,
    fontFamily: "Cochin",
    marginTop: 10,
    
  },
  titelText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: "Cochin",
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontFamily: "Cochin", 
    fontSize: 14,
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
  },
  leftButtonsContainer:{
    paddingLeft:0,
    marginLeft:0,
    padding:18,
    paddingLeft:5,
  },
  leftButtonContainer:{
   marginBottom:13,
  },
    button:{
    elevation: 8,
    borderRadius: 10,
    margin: 10,
    width: 80,
    height: 30,
    },
    updateButton:{
    elevation: 8,
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff',
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

});

export default Profile