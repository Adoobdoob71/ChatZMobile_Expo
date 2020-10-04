import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import PostScreen from "../screens/PostScreen";
import TopBarNavigator from "./TopBarNavigator";
import GroupScreen from "../screens/GroupScreen";
import ChatScreen from "../screens/ChatScreen";
import SignIn from "../screens/SignIn";
import AddPost from "../screens/AddPost";
import MyProfile from "../screens/MyProfile";
import { withTheme } from "react-native-paper";
import SearchScreen from "../screens/SearchScreen";
import PrivateMessageScreen from "../screens/PrivateMessageScreen";
import DrawerNavigator from "./DrawerNavigator";
import Settings from "../screens/Settings";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";

const Stack = createStackNavigator();

function StackNavigator(props) {
  const colors = props.theme.colors;
  return (
    <Stack.Navigator
      initialRouteName="DrawerNavigator"
      screenOptions={{ headerStyle: { backgroundColor: colors.header } }}>
      <Stack.Screen
        component={DrawerNavigator}
        name="DrawerNavigator"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={PostScreen} name="PostScreen" />
      <Stack.Screen component={GroupScreen} name="GroupScreen" />
      <Stack.Screen
        component={ChatScreen}
        name="ChatScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={SignIn} name="SignIn" />
      <Stack.Screen component={AddPost} name="AddPost" />
      <Stack.Screen
        component={MyProfile}
        name="MyProfile"
        options={{
          headerTitle: "My Profile",
        }}
      />
      <Stack.Screen
        component={SearchScreen}
        name="SearchScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        component={PrivateMessageScreen}
        name="PrivateMessageScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen component={Settings} name="Settings" />
      <Stack.Screen
        component={Profile}
        name="Profile"
        options={{ headerTitle: "" }}
      />
      <Stack.Screen
        component={EditProfile}
        name="EditProfile"
        options={{ headerTitle: "Edit Profile" }}
      />
    </Stack.Navigator>
  );
}

export default withTheme(StackNavigator);
