import * as React from "react";
import { View, Image } from "react-native";
import { TouchableRipple, withTheme } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const colors = this.props.theme.colors;
    return (
      <TouchableRipple onPress={() => this.props.navigation.pop()}>
        <View
          style={{ flexDirection: "row", padding: 2, alignItems: "center" }}>
          <MaterialIcons name="chevron-left" color={colors.text} size={24} />
          <Image
            source={{ uri: this.props.imageUrl }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginLeft: 4,
            }}
          />
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(BackButton);
