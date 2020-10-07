import * as React from "react";
import { View, Image, StyleSheet } from "react-native";
import { TouchableRipple, withTheme } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

class BackButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const colors = this.props.theme.colors;
    const styles = StyleSheet.create({
      body: {
        flexDirection: "row",
        padding: 2,
        alignItems: "center",
      },
      image: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginLeft: 4,
      },
    });
    return (
      <TouchableRipple onPress={() => this.props.navigation.pop()}>
        <View style={styles.body}>
          <MaterialIcons name="chevron-left" color={colors.text} size={24} />
          <Image source={{ uri: this.props.imageUrl }} style={styles.image} />
        </View>
      </TouchableRipple>
    );
  }
}

export default withTheme(BackButton);
