import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
    const styles = StyleSheet.create({
      body: {
        padding: 12,
        flex: 1,
        margin: 4,
        flexDirection: "row",
        backgroundColor: colors.card,
        borderRadius: 4,
      },
      text: {
        color: colors.text,
        fontSize: 14,
        marginTop: 4,
      },
      username: {
        color: colors.text,
        fontSize: 12,
      },
      placeholder: {
        fontSize: 10,
        color: colors.placeholder,
      },
    });
    if (this.state.userDetails == null) return null;
    else
      return (
        <View style={styles.body}>
          <Avatar.Image
            source={{ uri: this.state.userDetails.profilePictureUrl }}
            size={28}
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
              <Text style={styles.username}>
                {this.state.userDetails.username}
              </Text>
              <Text style={styles.placeholder}>{this.props.Item.email}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{this.props.Item.text}</Text>
          </View>
        </View>
      );
  }
}

export default withTheme(Comment);
