import React, { Component } from 'react';
import { Text, TextInput, View, Button, StyleSheet } from 'react-native';

class SignUp extends Component {

    constructor( props ){
        super( props )
        this.state = {
            //isLoading: true,
            //userListData: [],
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        }
    }

    //componentDidMount(){
        //this.getData()
      //}
    /*
      getData = ()=>  {
         fetch('http://localhost:3333/api/1.0.0/user')
        .then((response) => response.json())
        .then((responseJson) =>{
          console.log(responseJson)
          this.setState({
            isLoading: false,
            userListData: responseJson
          });
        })
        .catch((error) =>{
          console.log(error)
        })
      }
*/
    addUser = () => {
         let to_send = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password
        };
         fetch('http://localhost:3333/api/1.0.0/user', {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(to_send)
        })
        .then((response) => {
          alert('User added')
          //this.getData()
        })
         
         .catch((error)=>{
           console.log(error)
         })
      }
    
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.formContainer}>
                <Text style={styles.text}>Sign up</Text>
                <TextInput style={styles.inputField}
                    placeholder="Enter first name..."
                    //onBlur={()=>this.idValidator()}
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}/>
                <TextInput style={styles.inputField}
                    placeholder="Enter last name..."
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    />

                <TextInput style={styles.inputField}
                   placeholder="email..."
                   onChangeText={(email) => this.setState({email})}
                   value={this.state.email}
                   />
                <TextInput style={styles.inputField}
                    placeholder="password..."
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    />

                    <View>
                    <Button
                    title="Sign up"
                    onPress={() => this.addUser()}/>
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
        justifyContent:'center'
      },
      formContainer: {
        alignItems:'center',
        justifyContent:'center'
      },
      text: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
      },
    inputField: {
       padding: 14,
      fontSize: 22,
      width: '90%'
    },
    buttonContainer:{
        justifyContent: 'center',
        
    },
    button:{
        backgroundColor: "#009688",
        elevation: 8,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12
        
    },
  });
export default SignUp