import * as React from "react";
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";
import { TouchableRipple, withTheme } from "react-native-paper";

class GroupCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Item = this.props.Item;
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableRipple
        onPress={() =>
          this.props.navigation.navigate("GroupScreen", { Item: this.Item })
        }
        style={{ marginBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            paddingVertical: 6,
          }}>
          <Image
            source={{ uri: this.Item.imageUrl }}
            style={{ height: 42, width: 42, borderRadius: 21, marginRight: 12 }}
          />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Text style={{ color: colors.text, fontSize: 14 }}>
              {this.Item.key}
            </Text>
            <Text style={{ color: colors.placeholder, fontSize: 12 }}>
              {this.Item.description}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(GroupCard);
