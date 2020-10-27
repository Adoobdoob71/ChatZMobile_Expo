import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Avatar, IconButton, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      liked: false,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.dbTwo = firebase
      .database()
      .ref("posts")
      .child(this.props.postID)
      .child("comments")
      .child(this.Item.key);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
    });
    this.dbTwo
      .child("likes")
      .child(firebase.auth().currentUser.uid)
      .on("value", (snapshot) => {
        if (snapshot.exists()) this.setState({ liked: snapshot.val().liked });
        else this.setState({ liked: false });
      });
    this.dbTwo
      .child("likes")
      .orderByChild("liked")
      .equalTo(true)
      .on("value", (snapshot) =>
        this.setState({ likes: snapshot.numChildren() })
      );
  }

  componentWillUnmount() {
    this.db.off();
    this.dbTwo.off();
  }

  likeComment = () => {
    this.dbTwo.child("likes").child(firebase.auth().currentUser.uid).update({
      liked: !this.state.liked,
    });
  };

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
      likeView: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
      },
      likesText: {
        color: this.state.liked ? colors.primary : colors.text,
        fontSize: 10,
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
                  userUID: this.Item.userUID,
                })
              }>
              <Text style={styles.username}>
                {this.state.userDetails.username}
              </Text>
              <Text style={styles.placeholder}>{this.Item.email}</Text>
            </TouchableOpacity>
            <Text style={styles.text}>{this.Item.text}</Text>
          </View>
          <View style={styles.likeView}>
            <Text style={styles.likesText}>{this.state.likes}</Text>
            <IconButton
              icon={this.state.liked ? "heart" : "heart-outline"}
              style={{
                backgroundColor: this.state.liked
                  ? colors.primary
                  : "transparent",
              }}
              color={colors.text}
              size={10}
              onPress={this.likeComment}
            />
          </View>
        </View>
      );
  }
}

export default withTheme(Comment);
