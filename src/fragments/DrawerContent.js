import * as React from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  TouchableOpacity,
  SectionList,
} from "react-native";
import DrawerContact from "../components/DrawerContact";
import * as firebase from "firebase";
import { withTheme, TouchableRipple, IconButton } from "react-native-paper";

class DrawerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user: null,
      userFurtherDetails: {
        username: "",
        profilePictureUrl: null,
        description: "",
      },
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });
      if (user) {
        let db = firebase
          .database()
          .ref("users")
          .child(user.uid)
          .child("private_messages");
        db.on("value", (snapshot) => {
          this.setState({ data: [] });
          if (snapshot.exists()) {
            snapshot.forEach((item) => {
              let tempDB = firebase
                .database()
                .ref("users")
                .child(item.val().userUID);
              tempDB
                .once("value", (snapshot) => {
                  this.setState({
                    data: [
                      ...this.state.data,
                      { ...snapshot.val(), PM: item.val(), key: snapshot.key },
                    ],
                  });
                })
                .then(() => tempDB.off());
            });
          }
        });
        let dbTwo = firebase.database().ref("users").child(user.uid);
        dbTwo
          .on("value", (snapshot) =>
            this.setState({ userFurtherDetails: snapshot.val() })
          )
          .then(() => dbTwo.off());
      }
    });
  }
  render() {
    const colors = this.props.theme.colors;
    if (this.state.user != null)
      return (
        <SafeAreaView style={{ flex: 1, padding: 12 }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("MyProfile")}
            style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={
                  this.state.userFurtherDetails.profilePictureUrl !== null && {
                    uri: this.state.userFurtherDetails.profilePictureUrl,
                  }
                }
                style={{ width: 81, height: 81, borderRadius: 12 }}
              />
              <View style={{ height: 81, marginLeft: 24 }}>
                <Text style={{ fontSize: 16, color: colors.text }}>
                  {this.state.userFurtherDetails.username}
                </Text>
                <Text style={{ fontSize: 12, color: colors.placeholder }}>
                  {this.state.user.email}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.text,
                    marginTop: 8,
                  }}>
                  {this.state.userFurtherDetails.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <SectionList
            sections={[{ title: "Contacts", data: this.state.data }]}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            renderSectionHeader={({ section: { title } }) => (
              <Text
                style={{
                  fontSize: 16,
                  color: colors.text,
                  fontWeight: "bold",
                  marginBottom: 12,
                }}>
                {title}
              </Text>
            )}
            renderItem={({ item }) => (
              <DrawerContact Item={item} navigation={this.props.navigation} />
            )}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <IconButton
              icon="settings"
              color={colors.text}
              onPress={() => this.props.navigation.navigate("Settings")}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.text,
                marginStart: 8,
              }}>
              Settings
            </Text>
          </View>
        </SafeAreaView>
      );
    else return null;
  }
}

export default withTheme(DrawerContent);
