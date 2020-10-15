import * as React from "react";
import { View, Text, Image } from "react-native";
import { Badge, TouchableRipple, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      borderVisible: false,
      text: props.Item.description,
      missedMessages: 0,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("private_messages")
      .child(this.Item.PM.private_messages_ID);
    firebase
      .database()
      .ref("users")
      .child(firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        this.db
          .orderByChild("time")
          .startAt(snapshot.val().lastOnline)
          .on("value", (snapshotTwo) =>
            this.setState({ missedMessages: snapshotTwo.numChildren() })
          );
      });
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableRipple
        style={{
          flex: 1,
          paddingHorizontal: 8,
          paddingVertical: 10,
        }}
        ref={(ref) => (this.TR = ref)}
        onPress={() => {
          this.setState({ borderVisible: false });
          this.props.onPress();
        }}
        onLongPress={() =>
          this.props.navigation.navigate("Profile", {
            userUID: this.Item.userUID,
          })
        }>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <Image
            source={{ uri: this.Item.profilePictureUrl }}
            style={{ width: 42, height: 42, borderRadius: 21 }}
          />
          <View style={{ flexDirection: "column", flex: 1, marginStart: 12 }}>
            <Text style={{ fontSize: 14, color: colors.text }}>
              {this.Item.username}
            </Text>
            <Text style={{ fontSize: 12, color: colors.placeholder }}>
              {this.state.text}
            </Text>
          </View>
          <Badge
            visible={this.state.missedMessages != 0}
            selectionColor={colors.text}
            style={{
              backgroundColor: colors.card,
              alignSelf: "center",
              borderWidth: 1,
              borderColor: colors.primary,
            }}>
            {this.state.missedMessages}
          </Badge>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(Contact);
