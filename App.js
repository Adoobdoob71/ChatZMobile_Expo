import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigators/StackNavigator";
import { Provider, DefaultTheme, DarkTheme, Colors } from "react-native-paper";
import * as firebase from "firebase";
import { StatusBar } from "expo-status-bar";
import { store } from "./src/redux/ThemeState";
import { AsyncStorage, Platform } from "react-native";
import { Permissions, Notifications } from "expo";

const firebaseConfig = {
  apiKey: "AIzaSyBy8QvALSQgp6OIuGsQhInsvbV5uElLHTc",
  authDomain: "chatz-41da6.firebaseapp.com",
  databaseURL: "https://chatz-41da6.firebaseio.com",
  projectId: "chatz-41da6",
  storageBucket: "chatz-41da6.appspot.com",
  messagingSenderId: "841428548056",
  appId: "1:841428548056:web:7976d41ac3a716d2d6daad",
  measurementId: "G-TXE8PTLHMT",
};
firebase.initializeApp(firebaseConfig);

let theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.purple200,
    header: "rgb(35,35,35)",
    card: "rgb(30,30,30)",
  },
};

const Dark_Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.purple200,
    header: "rgb(35,35,35)",
    card: "rgb(30,30,30)",
  },
};

const Light_Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.purple200,
    header: "#FFFFFF",
    card: "rgb(220,220,220)",
  },
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: Dark_Theme,
    };
  }

  componentDidMount() {
    store.subscribe(() =>
      store.getState() === "dark"
        ? this.setState({ theme: Dark_Theme })
        : this.setState({ theme: Light_Theme })
    );
    AsyncStorage.getItem("dark").then((result) => {
      store.dispatch({ type: result });
    });
  }

  render() {
    return (
      <Provider theme={this.state.theme}>
        <NavigationContainer theme={this.state.theme}>
          <StatusBar
            style={this.state.theme.dark ? "light" : "dark"}
            backgroundColor={this.state.theme.colors.header}
            translucent={false}
            animated
          />
          <StackNavigator />
        </NavigationContainer>
      </Provider>
    );
  }
}
