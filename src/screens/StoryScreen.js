import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import * as firebase from "firebase";
import { IconButton, withTheme } from "react-native-paper";
import { FlatList } from "react-native-gesture-handler";
import { Video } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { log } from "react-native-reanimated";

class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentItem: 0,
    };
    this.Item = props.route.params.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.child("stories").on("value", (snapshot) => {
      snapshot.forEach((item) =>
        this.setState({
          data: [...this.state.data, { ...item.val(), key: item.key }],
        })
      );
    });
  }

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      footer: {
        backgroundColor: "transparent",
        position: "absolute",
        bottom: 0,
        left: 0,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
      },
      header: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 100,
        justifyContent: "space-between",
        backgroundColor: colors.header,
        opacity: 0.8,
      },
      iconButton: {
        color: colors.text,
        backgroundColor: colors.header,
      },
      title: {
        fontSize: 18,
        fontWeight: "bold",
        color: colors.text,
      },
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <IconButton
            icon="close"
            style={styles.iconButton}
            onPress={() => this.props.navigation.pop()}
          />
          <Text style={styles.title}>{this.Item.username + "'s Story"}</Text>
        </View>
        {/* <FlatList
          data={this.state.data}
          ref={(ref) => (this.FlatList = ref)}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Video
              source={{
                uri: item.videoUrl,
              }}
              ref={(ref) => (this.Video = ref)}
              style={{
                width: Dimensions.get("screen").width,
                height: Dimensions.get("screen").height,
              }}
              isLooping
              useNativeControls={false}
              onLoad={() => this.Video.playAsync()}
              shouldPlay
              rate={1.0}
              volume={1.0}
              resizeMode="contain"
            />
          )}
          horizontal
          scrollEnabled={false}
        /> */}
        <View style={styles.footer}>
          <IconButton
            icon="chevron-left"
            onPress={() => {
              // this.setState({ currentItem: this.state.currentItem - 1 });
              // this.FlatList.scrollToIndex({
              //   index: this.state.currentItem,
              //   animated: true,
              // });
            }}
            disabled={this.state.currentItem === 0}
            style={styles.iconButton}
          />
          <IconButton
            icon="chevron-right"
            onPress={() => {
              // this.setState({ currentItem: this.state.currentItem + 1 });
              // this.FlatList.scrollToIndex({
              //   index: this.state.currentItem,
              //   animated: true,
              // });
            }}
            disabled={this.state.currentItem === this.state.data.length}
            style={styles.iconButton}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(StoryScreen);
