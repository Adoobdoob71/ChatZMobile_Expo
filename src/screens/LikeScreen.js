import * as React from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import { withTheme, IconButton } from "react-native-paper";
import * as firebase from "firebase";
import Contact from "../components/Contact";

class LikesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      liked: props.route.params.liked,
    };
    this.Item = props.route.params.Item;
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("posts")
      .child(this.Item.key)
      .child("liked");
    this.dbTwo = firebase.database().ref("users");
    this.db
      .orderByChild("liked")
      .equalTo(true)
      .once("value", (snapshot) => {
        snapshot.forEach((item) => {
          this.dbTwo.child(item.val().userUID).once("value", (snapshotTwo) => {
            this.setState({ data: [...this.state.data, snapshotTwo.val()] });
          });
        });
      });
  }

  likePost = async () => {
    if (firebase.auth().currentUser) {
      await this.dbTwo
        .child(firebase.auth().currentUser.uid)
        .child("liked_posts")
        .child(this.Item.key)
        .update({
          liked: !this.state.liked,
          key: this.Item.key,
        });
      await this.db.child(firebase.auth().currentUser.uid).update({
        liked: !this.state.liked,
        userUID: firebase.auth().currentUser.uid,
      });
      this.setState({ liked: !this.state.liked });
    }
  };

  render() {
    const colors = this.props.theme.colors;
    this.props.navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={this.state.liked ? "heart" : "heart-outline"}
          color={this.state.liked ? colors.primary : colors.text}
          onPress={this.likePost}
          disabled={!firebase.auth().currentUser}
        />
      ),
    });
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={this.state.data}
          renderItem={({ item }) => (
            <Contact Item={item} {...this.props} onPress={() => {}} />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(LikesScreen);
