import * as React from "react";
import {
  SafeAreaView,
  View,
  InteractionManager,
  TextInput,
} from "react-native";
import { Button, HelperText, Snackbar, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      loading: false,
    };
  }

  SignInFunc = () => {
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ loading: false });
        this.props.navigation.pop();
      })
      .catch((error) => this.setState({ error: error, loading: false }));
  };

  render() {
    const colors = this.props.theme.colors;
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ margin: 32 }}>
            <TextInput
              value={this.state.email}
              onChangeText={(value) => this.setState({ email: value })}
              textContentType="emailAddress"
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              style={{
                borderRadius: 8,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderColor: colors.primary,
                color: colors.text,
                marginVertical: 12,
              }}
            />
            <TextInput
              value={this.state.password}
              onChangeText={(value) => this.setState({ password: value })}
              textContentType="password"
              placeholder="Password"
              placeholderTextColor={colors.placeholder}
              style={{
                borderRadius: 8,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderColor: colors.primary,
                color: colors.text,
                marginVertical: 12,
              }}
            />
          </View>
          <Button
            icon="check"
            mode="contained"
            loading={this.state.loading}
            onPress={() =>
              InteractionManager.runAfterInteractions(() => {
                this.SignInFunc();
              })
            }
            disabled={this.state.loading}
            style={{ marginHorizontal: 64, marginTop: 64 }}>
            Sign In
          </Button>
        </SafeAreaView>
        <Snackbar
          visible={this.state.error}
          onDismiss={() => this.setState({ error: null })}
          action={{
            label: "DISMISS",
            onPress: () => this.setState({ error: null }),
          }}>
          {this.state.error ? this.state.error.message : ""}
        </Snackbar>
      </>
    );
  }
}

export default withTheme(SignIn);
