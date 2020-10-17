import React from "react";
import { Image, SafeAreaView, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { IconButton, withTheme } from "react-native-paper";

class ImageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 0.5,
      bordersVisible: true,
    };
    this.imageUrl = this.props.route.params.imageUrl;
    this.title = this.props.route.params.title;
    Image.getSize(this.imageUrl, (width, height) => {
      this.setState({ ratio: width / height });
    });
  }

  render() {
    const colors = this.props.theme.colors;
    this.props.navigation.setOptions({
      headerBackground: () => (
        <View
          style={{
            backgroundColor: colors.card,
            opacity: 0.7,
            flex: 1,
          }}></View>
      ),
      headerShown: this.state.bordersVisible,
      headerTitle: this.title,
    });
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <TouchableWithoutFeedback
          onPress={() =>
            this.setState({ bordersVisible: !this.state.bordersVisible })
          }
          style={{ height: "100%", justifyContent: "center" }}>
          <Image
            source={{ uri: this.imageUrl }}
            style={{
              width: "100%",
              height: undefined,
              aspectRatio: this.state.ratio,
            }}
          />
        </TouchableWithoutFeedback>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            paddingHorizontal: 12,
            backgroundColor: colors.card,
            opacity: 0.7,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <IconButton icon="download" color={colors.text} onPress={() => {}} />
        </View>
      </SafeAreaView>
    );
  }
}

export default withTheme(ImageScreen);
