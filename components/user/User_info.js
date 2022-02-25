import React, {Component} from "react";
import { Text, View, Button,TextInput,ToHideAndShowComponent, StyleSheet} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


class UserInfo extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            isLoading : true,
            //showEdit : false,
            user_information : [],

            // I need to check if I wanna use these fields
            first_name : '',
            last_name : '',
            email : '',
            friend_count : '',
        }
    }
    
    

    getData = async () => {
        let data = await AsyncStorage.getItem('@spacebook_details')
        let session_data = JSON.parse(data)

        //let user_id = session_data.id
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

    
    /*
    updateItem = (id)=>{

    let to_send={}
    if(this.state.item_name != this.state.orig_item_name){
       to_send['item_name'] = this.state.item_name; 
      }
    if(this.state.description != this.state.orig_description){
      to_send['discription'] = this.state.discription;
    }
    if(this.state.unit_price != this.state.orig_unit_price){
      to_send['unit_price'] = parseInt(this.state.unit_price);
    }
    if(this.state.quantity != this.state.orig_quantity){
      to_send['quantity'] = parseInt(this.state.quantity);
    }

    console.log(JSON.stringify(to_send))

    return fetch("http://localhost:3333/list/2", {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(to_send)
    })
    .then((response) => {
      console.log("Item updated");
      console.log(response)
    })
    .catch((error) => {
      console.log(error);
    })
  }
     */

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
                <View><Text>Loading...</Text></View>
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
                </View> ) }

        
   }
    
    /*
if(this.state.isLoading){
        return(
            <View><Text>Loading...</Text></View>
        )
    }
    else{
      console.log("here", this.state)
      const nav = this.props.navigation;
      return(
        <View style={styles.container}>
          <Text style={styles.text}>Home Screen</Text>
          <View>
              <Text>Login id: {this.state.login_info.id}</Text>
              <Text>Login token: {this.state.login_info.token}</Text>
          </View>
          <Button style={styles.button} title="Home" 
             onPress={()=> nav.navigate("Home")}/>
        </View>
      );
    }
 */
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
      },
      textContainer: {
        flex:0.5,
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

export default UserInfo