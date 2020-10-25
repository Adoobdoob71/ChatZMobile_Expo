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
      likes: 0,
      size: new Animated.Value(1),
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
        this.db
          .child(user.uid)
          .child("bookmarks")
          .child(this.Item.key)
          .on("value", (snapshot) => {
            if (snapshot.exists())
              this.setState({ bookmarked: snapshot.val().bookmarked });
            else this.setState({ bookmarked: false });
          });
        this.db
          .child(user.uid)
          .child("liked_posts")
          .child(this.Item.key)
          .once("value", (snapshot) => {
            if (snapshot.exists())
              this.setState({ liked: snapshot.val().liked });
            else this.setState({ liked: false });
          });
      } else this.setState({ bookmarked: null, liked: null });
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
    this.dbThree = firebase
      .database()
      .ref("posts")
      .child(this.Item.key)
      .child("liked");
    this.dbThree
      .orderByChild("liked")
      .startAt(true)
      .on("value", (snapshot) =>
        this.setState({ likes: snapshot.numChildren() })
      );
  }

  componentWillUnmount() {
    this.db.off();
  }

  bookmarkPost = async () => {
    await this.db
      .child(firebase.auth().currentUser.uid)
      .child("bookmarks")
      .child(this.Item.key)
      .update({
        bookmarked: !this.state.bookmarked,
        key: this.Item.key,
      });
    this.setState({ bookmarked: !this.state.bookmarked });
  };

  likePost = async () => {
    await this.db
      .child(firebase.auth().currentUser.uid)
      .child("liked_posts")
      .child(this.Item.key)
      .update({
        liked: !this.state.liked,
        key: this.Item.key,
      });
    await this.dbThree.child(firebase.auth().currentUser.uid).update({
      liked: !this.state.liked,
      userUID: firebase.auth().currentUser.uid,
    });
    this.setState({ liked: !this.state.liked });
  };

  animation = () => {
    Animated.sequence([
      Animated.timing(this.state.size, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.size, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
            disabled={!firebase.auth().currentUser}
            icon={this.state.liked ? "heart" : "heart-outline"}
            onPress={() => {
              this.setState({ menuVisible: false });
              this.likePost();
              this.animation();
            }}
          />
          <Menu.Item
            title="Bookmark"
            disabled={!firebase.auth().currentUser}
            icon={this.state.bookmarked ? "bookmark" : "bookmark-outline"}
            onPress={() => {
              this.setState({ menuVisible: false });
              this.bookmarkPost();
            }}
          />
          <Menu.Item 
            title="Likes"
            icon="account-heart"
            onPress={() => {
              this.setState({ menuVisible: false });
              this.props.navigation.navigate("LikeScreen", {Item: this.Item, liked: this.state.liked});
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
                <View style={{ marginLeft: 8 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.placeholder,
                    }}>
                    Posted by {this.state.user.username}
                  </Text>
                  <Animated.Text
                    style={{
                      fontSize: 10,
                      color: this.state.liked
                        ? colors.primary
                        : colors.placeholder,
                      transform: [{ scale: this.state.size }],
                    }}>
                    {this.state.likes} ❤️
                  </Animated.Text>
                </View>
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
