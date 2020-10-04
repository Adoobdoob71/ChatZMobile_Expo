import * as React from "react";
import {
  ImageBackground,
  SafeAreaView,
  Text,
  View,
  Image,
  Alert,
} from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import * as firebase from "firebase";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      username: "",
      description: "",
    };
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("users")
      .child(firebase.auth().currentUser.uid);
    this.db.on("value", (snapshot) => {
      this.setState({
        userDetails: snapshot.val(),
        username: snapshot.val().username,
        description: snapshot.val().description,
      });
    });
  }

  updateImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
      if (!result.cancelled) {
        const res = await fetch(result.uri);
        let blob = await res.blob();
        this.storageRef = firebase
          .storage()
          .ref("images/users/")
          .child(firebase.auth().currentUser.uid);
        this.storageRef.put(blob).then(() => {
          this.storageRef.getDownloadURL().then((url) => {
            this.db.update({
              profilePictureUrl: url,
            });
          });
        });
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  updateUsername = () => {
    this.db
      .update({
        username: this.state.username,
      })
      .then(() => Alert.alert("Updated"));
  };

  updateDescription = () => {
    this.db
      .update({
        description: this.state.description,
      })
      .then(() => Alert.alert("Updated"));
  };

  render() {
    const colors = this.props.theme.colors;
    if (this.state.userDetails)
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ padding: 16, flexDirection: "row" }}>
            <ImageBackground
              style={{
                width: 64,
                height: 64,
                marginTop: 6,
                justifyContent: "center",
                alignItems: "center",
              }}
              source={{ uri: this.state.userDetails.profilePictureUrl }}>
              <IconButton
                icon="camera"
                color={colors.primary}
                size={18}
                onPress={() => this.updateImage()}
              />
            </ImageBackground>
            <View style={{ height: 81, marginLeft: 24, flex: 1 }}>
              <TextInput
                value={this.state.username}
                style={{
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                }}
                onChangeText={(value) => this.setState({ username: value })}
                maxLength={24}
              />
              <TextInput
                value={this.state.description}
                style={{
                  fontSize: 14,
                  color: colors.text,
                  marginBottom: 8,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  paddingHorizontal: 8,
                  borderRadius: 6,
                }}
                onChangeText={(value) => this.setState({ description: value })}
                maxLength={75}
              />
            </View>
            <View style={{ marginStart: 8 }}>
              <TouchableOpacity
                onPress={() => this.updateUsername()}
                style={{ marginBottom: 18 }}
                disabled={
                  this.state.userDetails.username === this.state.username
                }>
                <MaterialIcons
                  name="check"
                  color={
                    this.state.userDetails.username === this.state.username
                      ? colors.placeholder
                      : colors.primary
                  }
                  size={24}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.updateDescription()}
                disabled={
                  this.state.userDetails.description === this.state.description
                }>
                <MaterialIcons
                  name="check"
                  color={
                    this.state.userDetails.description ===
                    this.state.description
                      ? colors.placeholder
                      : colors.primary
                  }
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      );
    else return null;
  }
}

export default withTheme(EditProfile);
