import React, { Component } from "react";
import { Text, Button, TextInput, View, StyleSheet} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UpdatePost extends Component {

    constructor( props ) {
        super( props )
        
        this.state = {
            post_information : [],
            text: '',
            profile_id: null,
            postID: null,
            error:''
        }
    }
    
    updatePost = async () => {
        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
        
        let orig_text = this.state.post_information.text;
        let to_send = {}
        
        if( this.state.text != orig_text ) {
            to_send['text'] = this.state.text; 
            }

        fetch(`http://localhost:3333/api/1.0.0/user/${this.state.profile_id}/post/${this.state.postID}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'x-authorization': session_data.token
            },
            body : JSON.stringify( to_send )
        })
        .then( (response) => {
            if( !response.ok ) {
                  
                if ( response.status  === 400 ) 
                  throw Error( 'Bad Request' ) 

                else if ( response.status  === 401 ) 
                  throw Error( 'You are Unauthorized' )

                else if( response.status === 403 )
                  throw Error( 'You are forbidden to make change' )

                else if( response.status === 404 )
                   throw Error( 'Page not found' )

                else if ( response.status  === 500 ) 
                  throw Error( 'Server Error' ) 

                else 
                  throw Error( 'Check your connection' )
            }   
        })

        .then( () => {

            this.setState( {
                isLoading : false,
            })
            this.props.navigation.navigate( 'Profile' )
          })

        .catch( ( error ) => {
            this.setState( { error: error.message } )
        })
      
    }
    componentDidMount() {

        this.unsubscribe = this.props.navigation.addListener( 'focus', async () => {
        let { user_id,post_id } = this.props.route.params; 
        this.setState( { "profile_id": user_id, "postID": post_id } );
        });
    }

    componentWillUnmount() {
    this.unsubscribe();
    }
    
    render() {


        return (
            
            <View style = { styles.container }> 
                <View><Text style = { styles.errorText }>{ this.state.error }</Text></View>
                <Text style = { styles.titelText }>Update post</Text>
                <View style = { styles.inputContainer }>
                    <TextInput
                        multiline
                        style = { styles.inputField } 
                        placeholder = "Type here..."
                        onChangeText = { ( text ) => this.setState( { text } ) }
                        value = { this.state.text }/>
                </View>
                <View style = { styles.buttonContainer }>
                    <View style = { styles.updateButtonContainer }>
                        <Button 
                        title = "Update post" 
                        color = "#DCDCDC" 
                        onPress = { () => this.updatePost() }/>
                    </View>
                    <View style = { styles.backButtonContainer }>
                        <Button 
                        title = "Back" 
                        color = "#DCDCDC"
                        onPress = { () => this.props.navigation.navigate( "Profile" ) }/>
                    </View>
                </View>   
            </View>
         )
     }
}
const styles = StyleSheet.create({
    
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#87CEFA'
    },
    inputContainer: {
        flex:0.4,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        height: 50,
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
    },
    titelText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: "Cochin",
        marginTop: 12,
        paddingBottom: 10
    },
    errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
        marginBottom: 20
    },
    inputField: {
        fontSize: 16,
        height: '100%',
        backgroundColor: '#ffffff',
        paddingLeft: 15,
        paddingRight: 15,
    },
    button:{
        elevation: 8,
        borderRadius: 10,
        margin: 10,
        width: 80,
        height: 30, 
    },
    buttonContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    backButtonContainer:{
        elevation: 8,
        borderRadius: 10,
        margin: 10,
        width: 80,
        height: 35,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
    },
    updateButtonContainer:{
        elevation: 8,
        borderRadius: 10,
        margin: 10,
        width: 120,
        height: 35,
        borderRadius:5,
        borderWidth: 1,
        borderColor: '#fff',
    },
});
export default UpdatePost