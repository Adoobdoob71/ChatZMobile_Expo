import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as React from "react";
import Groups from "../screens/Groups";
import Home from "../screens/Home";
import ContactsScreen from "../screens/ContactsScreen";

import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  InteractionManager,
} from "react-native";
import { IconButton, withTheme, Menu } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { State } from "react-native-gesture-handler";
import * as firebase from "firebase";

const Tab = createMaterialTopTabNavigator();

function TopBarNavigator(props) {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) setAuthenticated(true);
      else setAuthenticated(false);
    });
  }, []);

  const { colors } = props.theme;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: colors.header,
          elevation: 4,
          height: 56,
          flexDirection: "row",
          alignItems: "center",
        }}>
        <IconButton
          icon="menu"
          color={colors.text}
          onPress={() => props.navigation.toggleDrawer()}
          style={{ marginHorizontal: 12 }}
        />
        <TouchableOpacity
          style={{ flex: 1, marginRight: 12 }}
          onPress={() => props.navigation.navigate("SearchScreen")}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 8,
              padding: 8,
              alignItems: "center",
              flexDirection: "row",
            }}>
            <MaterialIcons
              name="search"
              color={colors.placeholder}
              size={18}
              style={{ marginRight: 12 }}
            />
            <Text style={{ color: colors.placeholder, fontSize: 14 }}>
              Search
            </Text>
          </View>
        </TouchableOpacity>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() =>
                InteractionManager.runAfterInteractions(() =>
                  setMenuVisible(true)
                )
              }
              color={colors.text}
            />
          }>
          <Menu.Item
            title="My Profile"
            disabled={authenticated == false}
            onPress={() => {
              if (authenticated) {
                setMenuVisible(false);
                props.navigation.navigate("MyProfile");
              }
            }}
          />
          <Menu.Item
            title="Sign In"
            onPress={() => {
              setMenuVisible(false);
              props.navigation.navigate("SignIn");
            }}
          />
          <Menu.Item
            title="Register"
            onPress={() => {
              setMenuVisible(false);
              props.navigation.navigate("Register");
            }}
          />
          <Menu.Item
            title="Sign Out"
            disabled={!authenticated}
            onPress={() => {
              setMenuVisible(false);
              firebase
                .database()
                .ref("users")
                .child(firebase.auth().currentUser.uid)
                .update({
                  online: false,
                  lastOnline: firebase.database.ServerValue.TIMESTAMP,
                });
              firebase.auth().signOut();
            }}
          />
        </Menu>
      </View>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          style: { backgroundColor: colors.header },
          activeTintColor: colors.primary,
          labelStyle: { fontWeight: "bold" },
          inactiveTintColor: colors.placeholder,
        }}
        style={{ flex: 1, elevation: 4 }}>
        <Tab.Screen component={Home} name="Home" />
        <Tab.Screen component={Groups} name="Groups" />
        <Tab.Screen component={ContactsScreen} name="Contacts" />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default withTheme(TopBarNavigator);
