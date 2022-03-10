import React, {Component} from "react";
import { Text, View, StyleSheet,TouchableOpacity } from "react-native";
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AppCamera extends Component {

    constructor( props ){
        super( props );
    
        this.state = {
          hasPermission: null,
          type: Camera.Constants.Type.back,
          error: '',
        }
    }

    async componentDidMount() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      this.setState( { hasPermission: status === 'granted' } );
    }
  
    sendToServer = async ( data ) => {
  
        let getData = await AsyncStorage.getItem( '@spacebook_details' )
        let session_data = JSON.parse(getData )
        let user_id = session_data.id
  
        let res = await fetch( data.base64 );
        let blob = await res.blob();
  
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/photo", {
            method: "POST",
            headers: {
                "Content-Type": "image/png",
                "X-Authorization": session_data.token
            },
            body: blob
        })
        .then(( response ) => {

          if( !response.ok ) {

            if ( response.status  === 400 ) 
              throw Error( 'Bad Request' ) 

            else if ( response.status  === 401 ) 
              throw Error( 'You are Unauthorized' )

            else if( response.status === 404 )
                throw Error( 'Data not found' )

            else if ( response.status  === 500 ) 
              throw Error( 'Server Error' ) 

            else 
                throw Error( 'Check your connection' )
          }
        })
        .catch(( error ) => {
            this.setState( { error: error.message } )
        })
    }
  
      takePicture = async () => {
          if(this.camera){
              const options = {
                  quality: 0.5, 
                  base64: true,
                  onPictureSaved: ( data)  => this.sendToServer( data )
              };
              await this.camera.takePictureAsync( options ); 
              this.props.navigation.navigate( 'Profile' )
          } 
      }

    render() {
        if(this.state.hasPermission){
            return(
              <View style={ styles.container} >
                <Camera 
                  style={ styles.camera } 
                  type={ this.state.type }
                  ref={ref => this.camera = ref }>
                  <View style={ styles.buttonContainer }>
                    <TouchableOpacity
                      style={ styles.button }
                      onPress={ () => {
                        this.takePicture();
                      }}>
                      <View><Text style={ styles.text }> Press here to take Photo </Text></View>
                    </TouchableOpacity>
                    <View><Text style = {styles.errorText }>{ this.state.error }</Text></View>
                  </View>
                </Camera>
              </View>
            );
          }
          else {
            return(
              <View>
                <Text>No access to camera</Text>
              </View>
            );
          }
    }
}

export default AppCamera;
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'green',
    },
    errorText: {
      color: 'red',
      fontWeight: 'bold',
      fontFamily: "Cochin", 
      fontSize: 18,
    },
  });