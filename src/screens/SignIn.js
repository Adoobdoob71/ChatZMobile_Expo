import * as React from "react";
import {
  SafeAreaView,
  View,
  InteractionManager,
  TextInput,
  StyleSheet,
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
        firebase
          .database()
          .ref("users")
          .child(firebase.auth().currentUser.uid)
          .update({
            online: true,
          });
        this.setState({ loading: false });
        this.props.navigation.pop();
      })
      .catch((error) => this.setState({ error: error, loading: false }));
  };

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      textInput: {
        borderRadius: 8,
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderColor: colors.primary,
        color: colors.text,
        marginVertical: 12,
      },
    });
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{ marginHorizontal: 32, marginBottom: 32, marginTop: 64 }}>
            <TextInput
              value={this.state.email}
              onChangeText={(value) => this.setState({ email: value })}
              textContentType="emailAddress"
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
            <TextInput
              value={this.state.password}
              onChangeText={(value) => this.setState({ password: value })}
              textContentType="password"
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
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
            style={{
              marginHorizontal: 32,
              alignSelf: "flex-end",
            }}>
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
