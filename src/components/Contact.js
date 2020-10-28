import * as React from "react";
import { View, Text, Image } from "react-native";
import { Badge, Button, TouchableRipple, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      borderVisible: false,
      text: props.Item.description,
      missedMessages: 0,
      loading: true,
      added: false,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("private_messages");
    if (this.props.PrivateMessageContact) {
      firebase
        .database()
        .ref("users")
        .child(firebase.auth().currentUser.uid)
        .child("lastOnline")
        .on("value", (snapshot) => {
          this.db
            .child(this.Item.PM.private_messages_ID)
            .child("messages")
            .orderByChild("time")
            .startAt(snapshot.val())
            .on("value", (snapshotTwo) =>
              this.setState({ missedMessages: snapshotTwo.numChildren() })
            );
        });
    } else {
      if (firebase.auth().currentUser)
        firebase
          .database()
          .ref("users")
          .child(firebase.auth().currentUser.uid)
          .child("private_messages")
          .once("value", (snapshot) => {
            snapshot.forEach((item) => {
              if (item.child("userUID").val() === this.Item.userUID)
                this.setState({ added: true, loading: false });
            });
          })
          .then(() => this.setState({ loading: false }));
      else this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.db.off();
  }

  addPrivateMessageRoom = async () => {
    this.setState({ loading: true });
    let key = this.db.push().key;
    await firebase
      .database()
      .ref("users")
      .child(firebase.auth().currentUser.uid)
      .child("private_messages")
      .push()
      .set({
        userUID: this.Item.userUID,
        private_messages_ID: key,
        muted: false,
      });
    await firebase
      .database()
      .ref("users")
      .child(this.Item.userUID)
      .child("private_messages")
      .push()
      .set({
        userUID: firebase.auth().currentUser.uid,
        private_messages_ID: key,
        muted: false,
      });
    this.setState({ added: true, loading: false });
  };

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

          <Button
            mode="outlined"
            icon={this.state.added ? "check" : "plus"}
            disabled={
              this.state.added ||
              (firebase.auth().currentUser
                ? firebase.auth().currentUser.uid === this.Item.userUID
                : false)
            }
            loading={this.state.loading}
            onPress={() => this.addPrivateMessageRoom()}
            style={{
              marginLeft: "auto",
              display: !this.props.PrivateMessageContact ? "flex" : "none",
            }}>
            {this.state.added ? "Added" : "Add"}
          </Button>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(Contact);
