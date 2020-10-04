import * as React from "react";
import { View, Text, Image } from "react-native";
import { TouchableRipple, withTheme } from "react-native-paper";
import * as firebase from "firebase";

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.Item = this.props.Item;
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableRipple
        style={{ flex: 1, marginBottom: 8 }}
        onPress={() => this.props.onPress()}
        onLongPress={() =>
          this.props.navigation.navigate("Profile", {
            userUID: this.Item.userUID,
          })
        }>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}>
          <Image
            source={{ uri: this.Item.profilePictureUrl }}
            style={{ width: 42, height: 42, borderRadius: 21 }}
          />
          <View style={{ flexDirection: "column", flex: 1, marginStart: 12 }}>
            <Text style={{ fontSize: 14, color: colors.text }}>
              {this.Item.username}
            </Text>
            <Text style={{ fontSize: 12, color: colors.placeholder }}>
              {this.Item.description}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(Contact);
