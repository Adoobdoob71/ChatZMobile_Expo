import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  StyleSheet,
} from "react-native";
import {
  withTheme,
  Card,
  TouchableRipple,
  Menu,
  IconButton,
} from "react-native-paper";
import * as firebase from "firebase";
import { TextInput } from "react-native-gesture-handler";

class ChatMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      menuVisible: false,
      editing: false,
      edited: props.Item.edited,
      editingText: props.Item.text,
    };
    this.Item = props.Item;
    this.type = props.type;
    this.furtherData = props.furtherData;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.on("value", (snapshot) => this.setState({ user: snapshot.val() }));
  }

  componentWillUnmount() {
    this.db.off();
  }

  edit = async () => {
    if (this.type === "private") {
      await firebase
        .database()
        .ref("private_messages")
        .child(this.furtherData.PM.private_messages_ID)
        .child(this.Item.key)
        .update({
          text: this.state.editingText,
          edited: true,
        });
      this.setState({ editing: false, edited: true });
    }
  };

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      image: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 12,
      },
      imageCover: {
        height: 200,
        marginVertical: 4,
        flex: 1,
        borderRadius: 12,
      },
      textInput: {
        color: colors.text,
        fontSize: 14,
        flex: 1,
        backgroundColor: colors.backdrop,
        borderRadius: 8,
        marginRight: 12,
        paddingHorizontal: 8,
      },
    });
    return (
      <Menu
        anchor={
          <TouchableRipple
            onPress={() => {}}
            onLongPress={() => this.setState({ menuVisible: true })}>
            <View
              style={{
                flexDirection: "row",
                padding: 8,
              }}>
              <Image
                source={{
                  uri:
                    this.state.user == null
                      ? "empty"
                      : this.state.user.profilePictureUrl,
                }}
                style={styles.image}
              />
              <View style={{ flex: 1 }}>
                {this.state.user != null && (
                  <Text style={{ fontSize: 12, color: colors.placeholder }}>
                    {this.state.user.username}
                  </Text>
                )}
                {this.Item.imageUrl != undefined && (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("ImageScreen", {
                        imageUrl: this.Item.imageUrl,
                        title: this.Item.text,
                      })
                    }>
                    <Card.Cover
                      source={{ uri: this.Item.imageUrl }}
                      style={styles.imageCover}
                    />
                  </TouchableOpacity>
                )}
                {this.state.editing ? (
                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      value={this.state.editingText}
                      onChangeText={(value) =>
                        this.setState({ editingText: value })
                      }
                      style={styles.textInput}
                      multiline={true}
                    />
                    <IconButton
                      icon="check"
                      color={colors.text}
                      size={16}
                      onPress={() => this.edit()}
                    />
                  </View>
                ) : (
                  <Text style={{ fontSize: 14, color: colors.text }}>
                    {this.state.editingText}
                  </Text>
                )}
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.placeholder,
                    display: this.state.edited ? "flex" : "none",
                  }}>
                  (edited)
                </Text>
              </View>
            </View>
          </TouchableRipple>
        }
        visible={this.state.menuVisible}
        onDismiss={() => this.setState({ menuVisible: false })}>
        {firebase.auth().currentUser.uid === this.Item.userUID && (
          <Menu.Item
            title="Edit Message"
            icon="pencil"
            onPress={() => this.setState({ menuVisible: false, editing: true })}
          />
        )}
        <Menu.Item
          title="Remove Message"
          icon="close"
          onPress={() => this.setState({ menuVisible: false })}
        />
        <Menu.Item
          title="View Profile"
          icon="account"
          onPress={() => {
            this.setState({ menuVisible: false });
            this.props.navigation.navigate("Profile", {
              userUID: this.Item.userUID,
            });
          }}
        />
      </Menu>
    );
  }
}

export default withTheme(ChatMessage);
