import * as React from "react";
import { View, Text, SafeAreaView, Switch, AsyncStorage } from "react-native";
import { List, withTheme } from "react-native-paper";
import { store } from "../redux/ThemeState";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
    };
  }

  componentDidMount() {
    store.subscribe(() => this.setState({ dark: store.getState() === "dark" }));
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <List.Item
          left={() => <List.Icon icon="palette" color={colors.text} />}
          title="Appearance"
          description="Change the app's theme"
          right={() => (
            <Switch
              onValueChange={(value) => {
                store.dispatch({ type: value ? "dark" : "light" });
                AsyncStorage.setItem("dark", value ? "dark" : "light");
              }}
              thumbColor={colors.primary}
              trackColor={{
                false: colors.placeholder,
                true: colors.placeholder,
              }}
              value={this.state.dark}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Settings);
