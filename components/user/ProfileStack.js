import React, {Component} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "./UserProfile";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import AddPost from "./AddPost";
import UpdatePost from "./UpdatePost";
import SinglePost from "./SinglePost";
import Search from './Search'
import AddFriend from './AddFriend'

const Stack = createNativeStackNavigator();

class ProfileStack extends Component {

  render(){
    return(
          <Stack.Navigator initialRouteName = "Profile">
             <Stack.Screen name = "Profile" component = {Profile}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "FriendRequests" component = {FriendRequests} 
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "Friends" component = {Friends}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "Post" component = {AddPost}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "UpdatePost" component = {UpdatePost}
             options = {{ headerShown: false}} />
             <Stack.Screen name = "Search" component = {Search}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "SinglePost" component = {SinglePost}
             options = {{ headerShown: false}}/>
             <Stack.Screen name = "AddFriend" component = {AddFriend}
             options = {{ headerShown: false}}/>
        </Stack.Navigator>
      
    );
  }
}

export default ProfileStack