import React from "react";
import { SafeAreaView, View, Image, TextInput, StyleSheet } from "react-native";
import {
  IconButton,
  ProgressBar,
  Button,
  SnackBar,
  withTheme,
} from "react-native-paper";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      image: { uri: null, blob: null },
      loading: false,
      progress: 0,
      error: null,
    };
  }

  pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const res = await fetch(result.uri);
        let blob = await res.blob();
        this.setState({ image: { uri: result.uri, blob: blob } });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  register = async () => {
    this.setState({ loading: true });
    try {
      let user = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          this.state.email.trim(),
          this.state.password
        );
      let storageRef = firebase
        .storage()
        .ref("images/users")
        .child(user.user.uid);
      let uploadTask = storageRef.put(this.state.image.blob);
      uploadTask.on("state_changed", (snapshot) =>
        this.setState({
          progress: snapshot.bytesTransferred / snapshot.totalBytes,
        })
      );
      uploadTask.then(() => {
        storageRef.getDownloadURL().then(async (url) => {
          await firebase.database().ref("users").child(user.user.uid).set({
            email: this.state.email.trim(),
            username: this.state.username.trim(),
            profilePictureUrl: url,
            description: "default description",
            userUID: user.user.uid,
          });
          this.props.navigation.pop();
        });
      });
    } catch (error) {
      this.setState({ error: error });
    }
  };

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      body: {
        flex: 1,
      },
      imageView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      },
      image: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.backdp,
        marginRight: 12,
      },
      textInputView: {
        paddingHorizontal: 32,
        paddingVertical: 64,
      },
      textInput: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 12,
        marginVertical: 12,
      },
    });
    return (
      <>
        <SafeAreaView>
          {this.state.loading && (
            <ProgressBar
              progress={this.state.progress}
              visible={this.state.loading}
              style={{ width: "100%" }}
              color={colors.primary}
            />
          )}
          <View style={styles.imageView}>
            <Image
              source={this.state.image.uri && { uri: this.state.image.uri }}
              style={styles.image}
            />
            <IconButton
              icon="camera"
              color={colors.primary}
              onPress={() => this.pickimage()}
            />
          </View>
          <View>
            <TextInput
              value={this.state.email}
              onChangeText={(value) => this.setState({ email: value })}
              placeholder="Email"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
            <TextInput
              value={this.state.username}
              onChangeText={(value) => this.setState({ username: value })}
              placeholder="Username"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
            <TextInput
              value={this.state.password}
              onChangeText={(value) => this.setState({ password: value })}
              placeholder="Password"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
          </View>
          <Button
            color={colors.primary}
            mode="outlined"
            style={{ alignSelf: "flex-end" }}
            onPress={() => this.register()}
            loading={this.state.loading}
            disabled={this.state.loading}>
            Submit
          </Button>
        </SafeAreaView>
        <SnackBar
          visible={this.state.error}
          onDismiss={() => this.setState({ error: null })}
          action={{
            label: "DISMISS",
            onPress: () => this.setState({ error: null }),
          }}>
          {this.state.error ? this.state.error.message : ""}
        </SnackBar>
      </>
    );
  }
}

export default withTheme(Register);
