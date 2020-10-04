import * as React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigators/StackNavigator";
import { Provider, DefaultTheme, DarkTheme, Colors } from "react-native-paper";
import * as firebase from "firebase";
import { StatusBar } from "expo-status-bar";
import { store } from "./src/redux/ThemeState";

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

export default function App() {
  const [theme, setTheme] = React.useState(Dark_Theme);

  React.useEffect(() => {
    store.subscribe(() =>
      store.getState() === "dark" ? setTheme(Dark_Theme) : setTheme(Light_Theme)
    );
  }, []);

  return (
    <Provider theme={theme}>
      <NavigationContainer theme={theme}>
        <StatusBar
          style={theme.dark ? "light" : "dark"}
          backgroundColor={theme.colors.header}
          translucent={false}
          animated
        />
        <StackNavigator />
      </NavigationContainer>
    </Provider>
  );
}
