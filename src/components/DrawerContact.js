import * as React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { withTheme } from "react-native-paper";
import * as firebase from "firebase";

class DrawerContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newStory: false,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("users")
      .child(this.Item.userUID)
      .child("stories");
    this.db.on("child_added", (snapshot) => this.setState({ newStory: true }));
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          borderRadius: 6,
          backgroundColor: colors.header,
          marginBottom: 12,
          borderWidth: this.state.newStory ? 1 : 0,
          borderColor: colors.primary,
        }}
        onPress={() => {
          this.setState({ newStory: false });
          this.props.navigation.navigate("StoryScreen", {
            Item: this.Item,
          });
        }}
        onLongPress={() =>
          this.props.navigation.navigate("Profile", {
            userUID: this.Item.userUID,
          })
        }>
        <Image
          source={{ uri: this.Item.profilePictureUrl }}
          style={{
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
            height: 56,
            width: 56,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 12,
            paddingEnd: 16,
          }}>
          <Text
            style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>
            {this.Item.username}
          </Text>
          <Text style={{ color: colors.placeholder, fontSize: 12 }}>
            {this.Item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(DrawerContact);
