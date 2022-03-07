import React, {Component} from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from "./UserProfile";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import AddPost from "./AddPost";
//import DisplayPostStack from "./DisplayPostStack";
import UpdatePost from "./UpdatePost";
import DisplayPost from "./DisplayPost";
import SinglePost from "./SinglePost";
import Search from './Search'
//import CameraImp from './CameraImp'
//  <Stack.Screen name="CameraImp" component={CameraImp}/>

const Stack = createNativeStackNavigator();

class ProfileStack extends Component {

  render(){
    return(
          <Stack.Navigator initialRouteName = "Profile">
             <Stack.Screen name ="Profile" component={Profile}/>
             <Stack.Screen name="FriendRequests" component={FriendRequests} />
             <Stack.Screen name="Friends" component={Friends}/>
             <Stack.Screen name="Post" component={AddPost}
             options={{ headerShown: false}} />
             <Stack.Screen name="DisplayPost" component={DisplayPost}/>
             <Stack.Screen name="UpdatePost" component={UpdatePost}
             options={{ headerShown: false}} />
             <Stack.Screen name="Search" component={Search}
             options={{ headerShown: false}}/>
             <Stack.Screen name="SinglePost" component={SinglePost}/>
        </Stack.Navigator>
      
    );
  }
}


export default ProfileStack