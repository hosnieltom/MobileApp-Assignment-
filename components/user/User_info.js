import React, {Component} from "react";
import { Text, View, Button,TextInput,ToHideAndShowComponent,ActivityIndicator,
     StyleSheet} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class UserInfo extends Component {

    constructor( props ) {

        super( props )
        this.state = {
            isLoading : true,
            user_information : [],
            error: ''
        }
    }
    
    getData = async () => {

        let data = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse( data )
        let user_id = null;
        if( typeof this.props.route.params === 'undefined' ) {
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

        .then( ( responseJson ) => {

            this.setState({
                isLoading : false,
                user_information : responseJson
            })
        })
        .catch((error) => {
            this.setState( { error: error.message } )
        })
      
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.getData()
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render() {

        if(this.state.isLoading){
            return(
                <View>
                    <Text>Loading...</Text>
                    <View><Text style = {styles.errorText }>{ this.state.error }</Text></View>
                    <ActivityIndicator
                        size="large"
                        color="#00ff00"/>
                </View>
            )
        }
        else {
            console.log("here", this.state)
            const nav = this.props.navigation;
            return (
                <View style={styles.container}>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Take photo" 
                            onPress={()=> nav.navigate("CameraImp")}/>
                    </View>
                    <Text style={styles.titelText}>User details</Text>
                    <View>
                        <Text style={styles.text}>User id: {this.state.user_information.user_id}</Text>
                        <Text style={styles.text}>First name: {this.state.user_information.first_name}</Text>
                        <Text style={styles.text}>Last name: {this.state.user_information.last_name}</Text>
                        <Text style={styles.text}>email: {this.state.user_information.email}</Text>
                        <Text style={styles.text}>friend_count: {this.state.user_information.friend_count}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button style={styles.button} title="Edit details" 
                            onPress={()=> nav.navigate("UpdateUser")}/>
                    </View>
                </View> 
            ) } 
        }
    }

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
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
      errorText: {
        color: 'red',
        fontWeight: 'bold',
        fontFamily: "Cochin", 
        fontSize: 18,
      },
    inputField: {
       padding: 14,
      fontSize: 22,
      width: '90%'
    },
    buttonContainer:{
        flex:0.7,
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

export default UserInfo