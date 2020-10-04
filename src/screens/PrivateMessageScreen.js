import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  InteractionManager,
  ImageBackground,
  TextInput,
  Alert,
  RefreshControl,
  Dimensions,
} from "react-native";
import * as firebase from "firebase";
import { IconButton, ProgressBar, withTheme } from "react-native-paper";
import BackButton from "../components/BackButton";
import ChatMessage from "../components/ChatMessage";
import * as ImagePicker from "expo-image-picker";

class PrivateMessageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      image: null,
      messageText: "",
      submitting: false,
    };
    this.Item = this.props.route.params.Item;
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("private_messages")
      .child(this.Item.PM.private_messages_ID);
    this.db.on("child_added", (snapshot) => {
      this.setState({
        data: [...this.state.data, { ...snapshot.val(), key: snapshot.key }],
      });
    });
  }

  componentWillUnmount() {
    this.db.off();
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

  submitMessage = () => {
    let databaseRef = firebase
      .database()
      .ref("private_messages")
      .child(this.Item.PM.private_messages_ID);
    this.setState({ submitting: true });
    let key = databaseRef.push().key;
    if (this.state.image != null) {
      this.storageRef = firebase
        .storage()
        .ref("images/private_messages")
        .child(this.Item.PM.private_messages_ID)
        .child(key);
      this.storageRef.put(this.state.image.blob).on(
        "state_changed",
        (snapshot) => {
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => Alert.alert(error.message),
        () => {
          this.storageRef.getDownloadURL().then((url) => {
            databaseRef
              .child(key)
              .set({
                text: this.state.messageText.trim(),
                userUID: firebase.auth().currentUser.uid,
                imageUrl: url,
              })
              .then(() => {
                this.setState({
                  submitting: false,
                  messageText: "",
                  image: null,
                });
              })
              .catch((error) => Alert.alert(error.message));
          });
        }
      );
    } else {
      if (this.state.messageText.trim().length != 0) {
        databaseRef
          .child(key)
          .set({
            text: this.state.messageText.trim(),
            userUID: firebase.auth().currentUser.uid,
          })
          .then(() => {
            this.setState({ submitting: false, messageText: "", image: null });
          })
          .catch((error) => Alert.alert(error.message));
      }
    }
  };

  render() {
    const colors = this.props.theme.colors;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            height: 56,
            flexDirection: "row",
            paddingHorizontal: 8,
            alignItems: "center",
            backgroundColor: colors.header,
            elevation: 4,
          }}>
          <BackButton
            imageUrl={this.Item.profilePictureUrl}
            navigation={this.props.navigation}
          />
          <Text style={{ color: colors.text, fontSize: 18, marginStart: 12 }}>
            {this.Item.username}
          </Text>
        </View>
        <FlatList
          data={this.state.data}
          ref={(ref) => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({ animated: true })
          }
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <ChatMessage Item={item} navigation={this.props.navigation} />
          )}
        />
        <View
          style={{
            flexDirection: "column",
            padding: 4,
            backgroundColor: colors.header,
          }}
          ref={(ref) => (this.view = ref)}>
          {this.state.submitting && (
            <ProgressBar
              progress={this.state.progress}
              style={{ width: "100%", marginBottom: 4 }}
              color={colors.accent}
            />
          )}
          {this.state.image != null && (
            <ImageBackground
              source={{ uri: this.state.image.uri }}
              style={{
                height: 150,
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}>
              <IconButton
                icon="close"
                onPress={() => this.setState({ image: null })}
                color={colors.text}
                style={{
                  backgroundColor: colors.backgroundColor,
                  opacity: 0.7,
                }}
              />
            </ImageBackground>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
            }}>
            <IconButton
              icon="attachment"
              color={colors.text}
              disabled={this.state.submitting}
              onPress={() => this.pickImage()}
            />
            <TextInput
              value={this.state.messageText}
              onChangeText={(value) => this.setState({ messageText: value })}
              placeholder="Say something nice"
              editable={this.state.submitting == false}
              style={{ flex: 1, alignSelf: "center", color: colors.text }}
              multiline={true}
            />
            <IconButton
              icon="send"
              color={colors.text}
              onPress={() =>
                InteractionManager.runAfterInteractions(() =>
                  this.submitMessage()
                )
              }
              disabled={this.state.submitting}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(PrivateMessageScreen);
