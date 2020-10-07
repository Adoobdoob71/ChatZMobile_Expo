import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
} from "react-native";
import { withTheme, Card, Avatar } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Comment from "../components/Comment";
import * as firebase from "firebase";

class PostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      ratio: 0,
    };
    this.Item = this.props.route.params.Item;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.db = firebase
        .database()
        .ref("posts")
        .child(this.Item.key)
        .child("comments");
      this.db
        .once("value", (snapshot) => {
          snapshot.forEach((item) => {
            let itm = { ...item.val(), key: item.key };
            this.setState({ data: [...this.state.data, itm] });
          });
        })
        .then(() => this.setState({ loading: false }));
      Image.getSize(this.Item.imageUrl, (width, height) => {
        this.setState({ ratio: width / height });
      });
    });
  }

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      imageCover: {
        aspectRatio: this.state.ratio,
        width: "100%",
        height: undefined,
      },
      bodyView: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        alignItems: "center",
        padding: 12,
      },
      emptyFlatList: {
        width: "100%",
        height: 300,
        justifyContent: "center",
        alignItems: "center",
      },
      emptyFlatListText: {
        color: this.props.theme.colors.placeholder,
        fontSize: 16,
      },
    });
    const LeftContent = () => (
      <Avatar.Image source={{ uri: this.Item.groupImage }} size={42} />
    );
    if (this.state.loading || this.state.ratio == 0)
      return (
        <SafeAreaView
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      );
    else
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={this.state.data}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={{ backgroundColor: colors.card }}>
                <Card.Title
                  title={this.Item.title}
                  subtitle={this.Item.groupName}
                  left={LeftContent}
                />
                <Card.Cover
                  source={{ uri: this.Item.imageUrl }}
                  style={styles.imageCover}
                />
                <View style={styles.bodyView}>
                  <Text style={{ fontSize: 12, color: colors.text }}>
                    {this.Item.body}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyFlatList}>
                <MaterialIcons
                  name="sentiment-dissatisfied"
                  color={this.props.theme.colors.placeholder}
                  size={40}
                  style={{ marginBottom: 16 }}
                />
                <Text style={styles.emptyFlatListText}>
                  Seems pretty empty here...
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <Comment
                Item={item}
                navigation={this.props.navigation}
                postID={this.Item.key}
              />
            )}
          />
        </SafeAreaView>
      );
  }
}

export default withTheme(PostScreen);
