import React,{ Component } from "react";
import { Text, ActivityIndicator, View, Button, StyleSheet,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SinglePost extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            isLoading : true,
            post_information : [],
            text: '',
            profile_id: null,
            postID: null,
            error: ''
        }
    }
    getPost = async ( user_id, post_id ) => {

        let getData = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( getData )
        
        fetch(`http://localhost:3333/api/1.0.0/user/${user_id}/post/${post_id}`, {
          method: 'GET',
          headers: {
              'x-authorization': session_data.token
          },

        })
        .then( ( response ) => { 

            if( !response.ok ){
                
                if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )
    
                else if ( response.status  === 403 ) 
                  throw Error( 'Can only view the posts of yourself or your friends' ) 
                    
                else if ( response.status  === 404 ) 
                  throw Error( 'Page not found' ) 
    
                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 
    
                else
                  throw Error( 'Check server connection' )
              }
            return response.json() 
        } )

        .then((  responseJson ) => {
          this.setState( {
              isLoading : false,
              post_information: responseJson
          })
      })
        .catch( ( error ) => {
            this.setState( { error: error.message } )
        });
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', async () => {
            let { user_id,post_id } = this.props.route.params; 
            this.setState( { "profile_id": user_id, "postID": post_id } );
            await this.getPost( user_id, post_id )
        });
    }

    componentWillUnmount() {
    this.unsubscribe();
    }
 
    render() {

        if(this.state.isLoading) {
            
            return(
                <View>
                    <Text>Loading...</Text>
                    <View><Text style = {styles.errorText }>{ this.state.error }</Text></View>
                    <ActivityIndicator
                        size = "large"
                        color = "#00ff00"/>
                </View>
            )
        }
      
        else {
            
            return(
                <View style ={ styles.container }>
                    <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                    <View style = { styles.textContainer }>
                        <Text style = { styles.titelText }>Post Details</Text>
                    </View>
                    <View style = { styles.listContainer }>
                    <View  style = { styles.postContainer }>
                        <Text style = { styles.text }>Post ID: { this.state.post_information.post_id }</Text>
                        <Text style = { styles.text }>User ID: { this.state.post_information.author.user_id }</Text>
                        <Text style = { styles.text }>Author: { this.state.post_information.author.first_name } { this.state.post_information.author.last_name }</Text>
                        <Text style = { styles.text }>Email: { this.state.post_information.author.email }</Text>
                        <Text style = { styles.text }>Post: { this.state.post_information.text }</Text>
                        <Text style = { styles.text }>Time: { this.state.post_information.timestamp }</Text>
                        <Text style = { styles.text} >Number of Likes: { this.state.post_information.numLikes }</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        color = "#DCDCDC"
                        title = "Back" 
                        onPress = {() => this.props.navigation.navigate( "Profile",
                            { "user_id": this.state.post_information.author.user_id,
                            "post_id": this.state.post_information.post_id } ) }/>
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
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
      },
      postContainer: {
        flexDirection: 'column',
        backgroundColor:'#DCDCDC',
        marginTop: 10,
        padding: 16,
        justifyContent:'space-between',
      },

      listContainer: {
        justifyContent: 'space-between',
        paddingTop: 5,
      },
      textContainer: {
        padding: 14
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
        marginTop: 12,
      },
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    buttonContainer:{
        height: 35,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
        margin: 10,
        width: 80,
    },
  });

export default SinglePost