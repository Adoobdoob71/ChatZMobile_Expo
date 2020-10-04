import * as React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";
import * as firebase from "firebase";
import { withTheme, TouchableRipple } from "react-native-paper";

class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userFurtherDetails: null,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user: user });
      if (user) {
        let db = firebase.database().ref("users").child(user.uid);
        db.once("value", (snapshot) =>
          this.setState({ userFurtherDetails: snapshot.val() })
        ).then(() => db.off());
      }
    });
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.user && this.state.userFurtherDetails && (
          <TouchableRipple
            onPress={() => this.props.navigation.navigate("EditProfile")}>
            <View style={{ padding: 16, flexDirection: "row" }}>
              <Image
                source={{
                  uri: this.state.userFurtherDetails.profilePictureUrl,
                }}
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
          </TouchableRipple>
        )}
      </SafeAreaView>
    );
  }
}

export default withTheme(MyProfile);
