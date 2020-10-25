import * as React from "react";
import { SafeAreaView, TextInput, View, Alert } from "react-native";
import * as firebase from "firebase";
import {
  withTheme,
  ProgressBar,
  IconButton,
  Divider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

class AddPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      submitting: false,
      progress: 0,
      image: null,
    };
    this.Item = this.props.route.params.Item;
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

  submitPost = async () => {
    this.setState({ submitting: true });
    let databaseRef = firebase.database().ref("posts");
    let key = databaseRef.push().key;
    this.storageRef = firebase
      .storage()
      .ref("images/groups")
      .child(this.Item.key)
      .child("posts")
      .child(key);
    this.storageRef.put(this.state.image.blob).on(
      "state_changed",
      (snapshot) => {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
        this.setState({ progress: progress })
      },
      (error) => Alert.alert(error.message),
      () => {
        this.storageRef.getDownloadURL().then((url) => {
          databaseRef
            .child(key)
            .set({
              title: this.state.title,
              body: this.state.body,
              userUID: firebase.auth().currentUser.uid,
              groupName: this.Item.key,
              groupImage: this.Item.imageUrl,
              user: firebase.auth().currentUser.email,
              imageUrl: url,
              time: firebase.database.ServerValue.TIMESTAMP,
            })
            .then(() => {
              this.props.navigation.pop();
              this.setState({ submitting: false });
            })
            .catch((error) => Alert.alert(error.message));
        });
      }
    );
  };

  render() {
    const colors = this.props.theme.colors;
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="attachment"
            color={colors.text}
            onPress={() => this.pickImage()}
          />
          <IconButton
            icon="send"
            color={colors.text}
            disabled={
              this.state.title.trim().length == 0 ||
              this.state.body.trim().length == 0 ||
              this.state.image == null
            }
            onPress={() => this.submitPost()}
          />
        </View>
      ),
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.submitting && (
          <ProgressBar progress={this.state.progress} color={colors.accent} />
        )}
        <TextInput
          value={this.state.title}
          placeholder="Title"
          style={{
            color: colors.text,
            padding: 12,
            fontSize: 14,
          }}
          multiline={true}
          onChangeText={(value) => this.setState({ title: value })}
        />
        <TextInput
          value={this.state.body}
          style={{
            flex: 1,
            color: colors.text,
            padding: 12,
            fontSize: 14,
            textAlignVertical: "top",
          }}
          multiline={true}
          placeholder="Body"
          onChangeText={(value) => this.setState({ body: value })}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(AddPost);
