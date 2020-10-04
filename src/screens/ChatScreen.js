import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
  InteractionManager,
  RefreshControl,
} from "react-native";
import * as firebase from "firebase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  withTheme,
  TouchableRipple,
  IconButton,
  ProgressBar,
} from "react-native-paper";
import ChatMessage from "../components/ChatMessage";
import * as ImagePicker from "expo-image-picker";
import BackButton from "../components/BackButton";

class ChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      messageText: "",
      image: null,
      progress: 0,
      submitting: false,
    };
    this.Item = this.props.route.params.Item;
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("groups")
      .child(this.Item.key)
      .child("chat");
    this.db.on("child_added", (snapshot) => {
      this.state.data.push({ ...snapshot.val(), key: snapshot.key });
    });
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
    if (this.state.image != null) {
      this.setState({ submitting: true });
      let databaseRef = firebase
        .database()
        .ref("groups")
        .child(this.Item.key)
        .child("chat");
      let key = databaseRef.push().key;
      if (this.state.image != null) {
        this.storageRef = firebase
          .storage()
          .ref("images/groups")
          .child(this.Item.key)
          .child("chat")
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
                  user: firebase.auth().currentUser.email,
                  imageUrl: url,
                })
                .then(() => {
                  this.setState({ submitting: false });
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
              user: firebase.auth().currentUser.email,
            })
            .then(() => {
              this.setState({ submitting: false });
            })
            .catch((error) => Alert.alert(error.message));
        }
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
            paddingHorizontal: 12,
            flexDirection: "row",
            alignItems: "center",
            elevation: 4,
            backgroundColor: colors.header,
          }}>
          <BackButton
            imageUrl={this.Item.imageUrl}
            navigation={this.props.navigation}
          />
          <View style={{ marginLeft: 16 }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
              }}>
              Chat Room
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: colors.placeholder,
              }}>
              {this.Item.key}
            </Text>
          </View>
          <IconButton
            icon="chevron-down"
            color={colors.primary}
            style={{ marginLeft: "auto" }}
            onPress={() =>
              this.FlatList.scrollToEnd({
                animated: true,
              })
            }
          />
        </View>
        <FlatList
          data={this.state.data}
          ref={(ref) => (this.FlatList = ref)}
          style={{ flex: 1 }}
          onContentSizeChange={() =>
            this.FlatList.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => (
            <ChatMessage Item={item} navigation={this.props.navigation} />
          )}
        />
        <View
          style={{
            flexDirection: "column",
            padding: 4,
            backgroundColor: colors.header,
          }}>
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

export default withTheme(ChatScreen);
