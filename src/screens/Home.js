import * as React from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  InteractionManager,
  RefreshControl,
  StyleSheet,
} from "react-native";
import PostCard from "../components/PostCard";
import * as firebase from "firebase";
import { withTheme, IconButton, FAB, Portal } from "react-native-paper";
import { Notifications } from "expo";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      fabOpen: false,
      refreshing: true,
    };
  }

  componentDidMount() {
    this.db = firebase
      .database()
      .ref("posts")
      .orderByChild("time")
      .limitToLast(20);
    this.LoadPosts();
  }

  LoadPosts = () => {
    this.db.once("value", (snapshot) => {
      let tempData = [];
      snapshot.forEach((item) => {
        let itm = { ...item.val(), key: item.key };
        tempData.push(itm);
      });
      this.setState({ data: tempData, refreshing: false });
    });
  };

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      fab: {
        backgroundColor: colors.background,
        bottom: 16,
        right: 16,
        position: "absolute",
      },
    });
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          ref={(ref) => (this.flatList = ref)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              progressBackgroundColor={colors.primary}
              onRefresh={() => this.LoadPosts()}
            />
          }
          renderItem={({ item }) => (
            <PostCard Item={item} navigation={this.props.navigation} />
          )}
        />
        {/* <FAB.Group
          open={this.state.fabOpen}
          small
          fabStyle={{ backgroundColor: colors.background }}
          color={colors.primary}
          icon={this.state.fabOpen ? "close" : "plus"}
          actions={[
            // {
            //   icon: "plus",
            //   label: "Add Post",
            //   onPress: () => this.props.navigation.navigate("AddPost"),
            // },
            {
              icon: "chevron-up",
              label: "Scroll Up",
              onPress: () =>
                this.flatList.scrollToOffset({ offset: 0, animated: true }),
            },
          ]}
          onStateChange={() =>
            InteractionManager.runAfterInteractions(() =>
              this.setState({ fabOpen: !this.state.fabOpen })
            )
          }
        /> */}
        <FAB
          icon="chevron-up"
          style={styles.fab}
          color={colors.primary}
          onPress={() =>
            InteractionManager.runAfterInteractions(() =>
              this.flatList.scrollToOffset({ offset: 0, animated: true })
            )
          }
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Home);
