import React from "react";
import { SafeAreaView } from "react-native";
import { IconButton, Snackbar, withTheme } from "react-native-paper";
import * as firebase from "firebase";
import { TextInput } from "react-native-gesture-handler";

class AddComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      error: null,
      loading: false,
    };
    this.Item = this.props.route.params.Item;
  }

  submitComment = () => {
    this.setState({ loading: true });
    firebase
      .database()
      .ref("posts")
      .child(this.Item.key)
      .child("comments")
      .push()
      .set({
        text: this.state.text.trim(),
        userUID: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
      })
      .catch((error) => this.setState({ error: error, loading: false }))
      .then(() => this.props.navigation.pop());
  };

  render() {
    const colors = this.props.theme.colors;
    this.props.navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="send"
          color={colors.text}
          onPress={() => this.submitComment()}
          disabled={this.state.text.trim().length == 0 || this.state.loading}
        />
      ),
    });
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <TextInput
            value={this.state.text}
            onChangeText={(value) => this.setState({ text: value })}
            placeholder="Comment something..."
            placeholderTextColor={colors.placeholder}
            multiline={true}
            style={{
              flex: 1,
              textAlignVertical: "top",
              color: colors.text,
              padding: 12,
            }}
          />
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

export default withTheme(AddComment);
