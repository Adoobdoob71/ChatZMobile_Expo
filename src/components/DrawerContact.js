import * as React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { withTheme } from "react-native-paper";

class DrawerContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Item = this.props.Item;
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          borderRadius: 8,
          backgroundColor: colors.header,
          marginBottom: 12,
        }}
        onPress={() => {
          this.props.navigation.navigate("PrivateMessageScreen", {
            Item: this.Item,
          });
        }}
        onLongPress={() =>
          this.props.navigation.navigate("Profile", {
            userUID: this.Item.userUID,
          })
        }>
        <Image
          source={{ uri: this.Item.profilePictureUrl }}
          style={{
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            height: 56,
            width: 56,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 12,
            paddingEnd: 16,
          }}>
          <Text
            style={{ color: colors.text, fontSize: 16, fontWeight: "bold" }}>
            {this.Item.username}
          </Text>
          <Text style={{ color: colors.placeholder, fontSize: 12 }}>
            {this.Item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default withTheme(DrawerContact);
