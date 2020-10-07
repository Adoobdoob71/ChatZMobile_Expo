import * as React from "react";
import { FlatList, SafeAreaView, Text, TextInput, View } from "react-native";
import { IconButton, withTheme } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as firebase from "firebase";
import Contact from "../components/Contact";

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchQuery: "",
    };
  }

  componentDidMount() {
    this.db = firebase.database().ref("users");
  }

  addChat = () => {};

  searchPeople = (value) => {
    this.setState({ data: [], searchQuery: value });
    this.db
      .orderByChild("username")
      .startAt(value)
      .endAt(value + "\uf8ff")
      .once("value", (snapshot) => {
        let itmData = [];
        snapshot.forEach((item) => {
          itmData.push(item.val());
        });
        this.setState({ data: itmData });
      })
      .then(() => this.db.off());
  };

  render() {
    const colors = this.props.theme.colors;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            paddingVertical: 8,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <IconButton
            icon="arrow-left"
            color={colors.text}
            onPress={() => this.props.navigation.pop()}
          />
          <View
            style={{
              backgroundColor: colors.card,
              paddingVertical: 4,
              paddingHorizontal: 12,
              flex: 1,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 8,
            }}>
            <MaterialIcons name="search" size={16} color={colors.placeholder} />
            <TextInput
              value={this.state.searchQuery}
              onChangeText={(value) => this.searchPeople(value)}
              placeholder="Search"
              placeholderTextColor={colors.placeholder}
              style={{ flex: 1, marginStart: 8, color: colors.text }}
            />
          </View>
        </View>
        <FlatList
          data={this.state.data}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <Contact Item={item} onPress={() => this.addChat()} />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default withTheme(SearchScreen);
