import * as React from "react";
import {
  SafeAreaView,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  InteractionManager,
} from "react-native";
import { withTheme, IconButton, Menu } from "react-native-paper";
import * as firebase from "firebase";
import PostCard from "../components/PostCard";
import { set } from "react-native-reanimated";

class GroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      menuVisible: false,
      authenticated: false,
    };
    this.Item = this.props.route.params.Item;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.setState({ authenticated: true });
      else this.setState({ authenticated: false });
    });
    this.db = firebase
      .database()
      .ref("posts")
      .orderByChild("groupName")
      .equalTo(this.Item.key);
    this.db.once("value", (snapshot) => {
      let tempData = [];
      snapshot.forEach((item) => {
        let itm = { ...item.val(), key: item.key };
        tempData.push(itm);
      });
      this.setState({ data: tempData });
    });
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    this.props.navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={this.state.menuVisible}
          onDismiss={() => this.setState({ menuVisible: false })}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() =>
                InteractionManager.runAfterInteractions(() =>
                  this.setState({ menuVisible: true })
                )
              }
              color={colors.text}
            />
          }>
          <Menu.Item
            icon="message"
            title="Chat"
            onPress={() => {
              InteractionManager.runAfterInteractions(() => {
                this.setState({ menuVisible: false });
                this.props.navigation.navigate("ChatScreen", {
                  Item: this.Item,
                });
              });
            }}
            disabled={this.state.authenticated == false}
          />
          <Menu.Item
            icon="comment"
            title="Add Post"
            onPress={() => {
              InteractionManager.runAfterInteractions(() => {
                this.setState({ menuVisible: false });
                this.props.navigation.navigate("AddPost", { Item: this.Item });
              });
            }}
            disabled={this.state.authenticated == false}
          />
        </Menu>
      ),
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View>
              <View
                style={{
                  backgroundColor:
                    this.Item.mainColor == undefined
                      ? colors.card
                      : this.Item.mainColor,
                  width: "100%",
                  paddingTop: 40,
                  paddingBottom: 20,
                }}>
                <View
                  style={{
                    alignSelf: "center",
                    alignItems: "center",
                  }}>
                  <Image
                    source={{ uri: this.Item.imageUrl }}
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 55,
                    }}
                  />
                  <Text
                    style={{ fontSize: 16, color: colors.text, marginTop: 8 }}>
                    {this.Item.key}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.placeholder,
                      marginTop: 4,
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {this.Item.description}
                  </Text>
                </View>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <PostCard Item={item} navigation={this.props.navigation} />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(GroupScreen);
