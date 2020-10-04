import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import GroupCard from "../components/GroupCard";
import * as firebase from "firebase";
import { withTheme } from "react-native-paper";

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
    };
  }

  componentDidMount() {
    this.db = firebase.database().ref("groups");
    this.LoadGroups();
  }

  LoadGroups = () => {
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
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.LoadGroups()}
              progressBackgroundColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <GroupCard Item={item} navigation={this.props.navigation} />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(Groups);
