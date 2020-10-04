import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
    };
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.props.Item.userUID);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
    });
  }

  render() {
    const colors = this.props.theme.colors;
    if (this.state.userDetails == null) return null;
    else
      return (
        <View
          style={{
            padding: 12,
            flex: 1,
            marginVertical: 8,
            marginHorizontal: 8,
            flexDirection: "row",
            backgroundColor: colors.card,
            borderRadius: 4,
          }}>
          <Avatar.Image
            source={{ uri: this.state.userDetails.profilePictureUrl }}
            size={24}
          />
          <View
            style={{
              marginHorizontal: 8,
              flex: 1,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Profile", {
                  userUID: this.props.Item.userUID,
                })
              }>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.text,
                }}>
                {this.state.userDetails.username}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: colors.placeholder,
                }}>
                {this.props.Item.email}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: colors.text,
                fontSize: 14,
                marginTop: 4,
              }}>
              {this.props.Item.text}
            </Text>
          </View>
        </View>
      );
  }
}

export default withTheme(Comment);
