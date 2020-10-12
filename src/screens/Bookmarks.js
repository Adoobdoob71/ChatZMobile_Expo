import React from "react";
import { SafeAreaView } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as firebase from "firebase";
import PostCard from "../components/PostCard";
import { withTheme } from "react-native-paper";

class Bookmarks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("users")
      .child(firebase.auth().currentUser.uid)
      .child("bookmarks");
    this.db.once("value", (snapshot) => {
      snapshot.forEach((item) => {
        if (item.val().bookmarked)
          firebase
            .database()
            .ref("posts")
            .child(item.val().key)
            .once("value", (snapshotTwo) => {
              this.setState({
                data: [
                  ...this.state.data,
                  { ...snapshotTwo.val(), key: item.key },
                ],
              });
            });
      });
    });
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          data={this.state.data}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostCard Item={item} navigation={this.props.navigation} />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Bookmarks);
