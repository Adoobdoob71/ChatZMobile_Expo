import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TopBarNavigator from "./TopBarNavigator";
import DrawerContent from "../fragments/DrawerContent";

const Drawer = createDrawerNavigator();

function DrawerNavigator(props) {
  return (
    <Drawer.Navigator
      drawerContent={() => <DrawerContent navigation={props.navigation} />}
      initialRouteName="TopBarNavigator"
      drawerType="slide">
      <Drawer.Screen name="TopBarNavigator" component={TopBarNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
