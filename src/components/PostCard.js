import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  InteractionManager,
  Animated,
} from "react-native";
import {
  Avatar,
  IconButton,
  Button,
  Card,
  withTheme,
  Menu,
} from "react-native-paper";
import * as firebase from "firebase";

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { profilePictureUrl: "empty", username: "" },
      bookmarked: null,
      ratio: 0,
      loading: true,
      groupData: null,
      liked: false,
      // fadeValue: new Animated.Value(0),
      // spring: new Animated.Value(1),
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users");
    this.db.child(this.Item.userUID).once("value", (snapshot) => {
      this.setState({ user: snapshot.val() });
    });
    Image.getSize(this.Item.imageUrl, (width, height) => {
      this.setState({ ratio: width / height });
    });
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase
          .database()
          .ref("users")
          .child(user.uid)
          .child("bookmarks")
          .child(this.Item.key)
          .on("value", (snapshot) => {
            if (snapshot.exists())
              this.setState({ bookmarked: snapshot.val().bookmarked });
            else this.setState({ bookmarked: false });
          });
      } else this.setState({ bookmarked: null });
    });
    this.dbTwo = firebase.database().ref("groups").child(this.Item.groupName);
    this.dbTwo
      .once("value", (snapshot) => {
        this.setState({ groupData: { ...snapshot.val(), key: snapshot.key } });
      })
      .then(() => {
        this.dbTwo.off();
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.db.off();
  }

  bookmarkPost = () => {
    this.setState({ loading: true });
    this.db
      .child(firebase.auth().currentUser.uid)
      .child("bookmarks")
      .child(this.Item.key)
      .update({
        bookmarked: !this.state.bookmarked,
        key: this.Item.key,
      });
    this.setState({ loading: false });
  };

  // fade = () => {
  //   Animated.timing(this.state.fadeValue, {
  //     duration: 1000,
  //     toValue: 1,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // spring = () => {
  //   Animated.sequence([
  //     Animated.timing(this.state.spring, {
  //       toValue: 1.1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(this.state.spring, {
  //       toValue: 1,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  // };

  render() {
    const colors = this.props.theme.colors;
    const LeftContent = () => (
      <TouchableOpacity
        onPress={() =>
          InteractionManager.runAfterInteractions(() =>
            this.props.navigation.navigate("GroupScreen", {
              Item: this.state.groupData,
            })
          )
        }>
        <Avatar.Image source={{ uri: this.Item.groupImage }} size={42} />
      </TouchableOpacity>
    );
    const RightContent = () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* <IconButton
          icon={this.state.liked ? "heart" : "heart-outline"}
          color={colors.primary}
          onPress={() => this.setState({ liked: !this.state.liked })}
        />
        <IconButton
          icon={this.state.bookmarked ? "bookmark" : "bookmark-outline"}
          color={colors.primary}
          disabled={this.state.bookmarked === null || this.state.loading}
          onPress={
            () => this.bookmarkPost()
            // this.fade();
            // this.spring();
          }
        /> */}
        <Menu
          visible={this.state.menuVisible}
          anchor={
            <IconButton
              icon="dots-vertical"
              color={colors.text}
              onPress={() => this.setState({ menuVisible: true })}
            />
          }
          onDismiss={() => this.setState({ menuVisible: false })}>
          <Menu.Item
            title="Favorite"
            icon={this.state.liked ? "heart" : "heart-outline"}
            onPress={() =>
              this.setState({ liked: !this.state.liked, menuVisible: false })
            }
          />
          <Menu.Item
            title="Bookmark"
            icon={this.state.bookmarked ? "bookmark" : "bookmark-outline"}
            onPress={() => {
              this.bookmarkPost();
              this.setState({ menuVisible: false });
            }}
          />
        </Menu>
      </View>
    );
    if (this.state.ratio == 0 || this.state.loading) return null;
    else
      return (
        <Card style={{ marginVertical: 4, borderRadius: 0, elevation: 0 }}>
          <Card.Title
            title={this.Item.title}
            subtitle={this.Item.groupName}
            left={LeftContent}
            right={RightContent}
          />
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("ImageScreen", {
                imageUrl: this.Item.imageUrl,
                title: this.Item.title,
              })
            }>
            <Card.Cover
              source={{ uri: this.Item.imageUrl }}
              style={{
                aspectRatio: this.state.ratio,
                width: "100%",
                height: undefined,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
              paddingHorizontal: 4,
              paddingVertical: 6,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("Profile", {
                  userUID: this.Item.userUID,
                })
              }>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{ uri: this.state.user.profilePictureUrl }}
                  style={{ height: 24, width: 24, borderRadius: 12 }}
                />
                {/* <Animated.Text
                  style={{
                    fontSize: 10,
                    color: colors.placeholder,
                    marginLeft: 8,
                    // opacity: this.state.fadeValue,
                    transform: [{ scale: this.state.spring }],
                  }}>
                  Posted by {this.state.user.username}
                </Animated.Text> */}
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.placeholder,
                    marginLeft: 8,
                  }}>
                  Posted by {this.state.user.username}
                </Text>
              </View>
            </TouchableOpacity>
            <Button
              mode="text"
              color={colors.primary}
              icon="chevron-right"
              onPress={() =>
                InteractionManager.runAfterInteractions(() =>
                  this.props.navigation.navigate("PostScreen", {
                    Item: this.Item,
                  })
                )
              }>
              Read More
            </Button>
          </View>
        </Card>
      );
  }
}

export default withTheme(PostCard);
