import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
  InteractionManager,
} from "react-native";
import {
  Avatar,
  IconButton,
  Button,
  Card,
  withTheme,
} from "react-native-paper";
import * as firebase from "firebase";

class PostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { profilePictureUrl: "empty", username: "" },
      bookmarked: false,
      ratio: 0,
      loading: true,
      groupData: null,
    };
    this.Item = this.props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.once("value", (snapshot) => {
      this.setState({ user: snapshot.val() });
    });
    Image.getSize(this.Item.imageUrl, (width, height) => {
      this.setState({ ratio: width / height });
    });
    this.db = firebase.database().ref("groups").child(this.Item.groupName);
    this.db
      .once("value", (snapshot) => {
        this.setState({ groupData: { ...snapshot.val(), key: snapshot.key } });
      })
      .then(() => {
        this.db.off();
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this.db.off();
  }

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
      <IconButton
        icon={this.state.bookmarked ? "bookmark" : "bookmark-outline"}
        color={colors.primary}
        onPress={() => this.setState({ bookmarked: !this.state.bookmarked })}
      />
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
