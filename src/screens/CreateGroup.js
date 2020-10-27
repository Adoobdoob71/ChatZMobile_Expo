import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { withTheme, ProgressBar, IconButton, Button } from "react-native-paper";

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: null,
      description: "",
      taken: false,
      loading: false,
      progress: 0,
    };
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      let res = await fetch(result.uri);
      let blob = await res.blob();
      this.setState({ image: { uri: result.uri, blob: blob } });
    }
  };

  addGroup = async () => {
    this.setState({ loading: true });
    firebase
      .database()
      .ref("groups")
      .child(this.state.name)
      .once("value", (snapshot) => {
        this.setState({ taken: snapshot.exists() });
      });
    if (
      !this.state.taken &&
      this.state.image &&
      this.state.name.trim().length != 0 &&
      this.state.description.trim().length != 0
    ) {
      this.storageRef = firebase
        .storage()
        .ref("images")
        .child("groups")
        .child(this.state.name);
      let uploadTask = this.storageRef.put(this.state.image.blob);
      uploadTask.on("state_changed", (snapshot) =>
        this.setState({
          progress: snapshot.bytesTransferred / snapshot.totalBytes,
        })
      );
      uploadTask
        .then(async () => {
          await this.storageRef.getDownloadURL().then(async (url) => {
            await firebase.database().ref("groups").child(this.state.name).set({
              description: this.state.description,
              imageUrl: url,
            });
          });
          this.props.navigation.pop();
        })
        .catch((error) => this.setState({ loading: false }));
    }
  };

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      body: {
        flex: 1,
        padding: 32,
        paddingTop: 56,
      },
      pickImageView: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 32,
        justifyContent: "center",
      },
      image: {
        width: 84,
        height: 84,
        borderRadius: 42,
        backgroundColor: colors.card,
        marginRight: 12,
      },
      inputView: {
        marginBottom: 12,
      },
      textInput: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.primary,
        color: colors.text,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginVertical: 12,
      },
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ProgressBar
          progress={this.state.progress}
          visible={this.state.loading}
        />
        <ScrollView style={styles.body}>
          <View style={styles.pickImageView}>
            <Image
              style={styles.image}
              source={this.state.image && { uri: this.state.image.uri }}
            />
            <IconButton
              icon="camera"
              color={colors.primary}
              onPress={this.pickImage}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              value={this.state.name}
              onChangeText={(value) => this.setState({ name: value })}
              placeholder="What's the group's name?"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
            <TextInput
              value={this.state.description}
              onChangeText={(value) => this.setState({ description: value })}
              placeholder="What's the group's description?"
              placeholderTextColor={colors.placeholder}
              style={styles.textInput}
            />
          </View>
          <Button
            mode="contained"
            color={colors.primary}
            icon="chevron-right"
            style={{ alignSelf: "flex-end" }}
            onPress={this.addGroup}
            loading={this.state.loading}
            disabled={
              this.state.loading ||
              this.state.name.trim().length == 0 ||
              this.state.description.trim().length == 0 ||
              !this.state.image
            }>
            Submit
          </Button>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default withTheme(CreateGroup);
