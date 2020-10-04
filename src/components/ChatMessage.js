import * as React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { withTheme, Card, TouchableRipple } from "react-native-paper";
import * as firebase from "firebase";

class ChatMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.on("value", (snapshot) => this.setState({ user: snapshot.val() }));
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;

    return (
      <TouchableRipple
        onPress={() =>
          this.props.navigation.navigate("Profile", {
            userUID: this.Item.userUID,
          })
        }>
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
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            {this.state.user != null && (
              <Text style={{ fontSize: 12, color: colors.placeholder }}>
                {this.state.user.username}
              </Text>
            )}
            {this.Item.imageUrl != undefined && (
              <TouchableOpacity onPress={() => {}}>
                <Card.Cover
                  source={{ uri: this.Item.imageUrl }}
                  style={{
                    height: 200,
                    marginVertical: 4,
                    flex: 1,
                    borderRadius: 12,
                  }}
                />
              </TouchableOpacity>
            )}
            <Text style={{ fontSize: 14, color: colors.text }}>
              {this.Item.text}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(ChatMessage);
