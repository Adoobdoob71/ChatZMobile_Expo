import * as React from "react";
import { SafeAreaView, View, InteractionManager } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ margin: 64 }}>
          <TextInput
            value={this.state.email}
            onChangeText={(value) =>
              this.setState({ email: value, error: null })
            }
            textContentType="emailAddress"
            disabled={this.state.loading}
            error={this.state.error}
            label="Email"
          />
          {this.state.error != null && (
            <HelperText type="error">{this.state.error.message}</HelperText>
          )}
        </View>
        <View style={{ marginHorizontal: 64 }}>
          <TextInput
            value={this.state.password}
            onChangeText={(value) =>
              this.setState({ password: value, error: null })
            }
            textContentType="password"
            error={this.state.error}
            disabled={this.state.loading}
            label="Password"
          />
          {this.state.error != null && (
            <HelperText type="error">{this.state.error.message}</HelperText>
          )}
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
          style={{ marginHorizontal: 64, marginTop: 64 }}
        >
          Sign In
        </Button>
      </SafeAreaView>
    );
  }
}

export default SignIn;
