import React from "react";
import { Image, SafeAreaView } from "react-native";

class ImageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 0.5,
    };
    this.imageUrl = this.props.route.params.imageUrl;
    Image.getSize(this.imageUrl, (width, height) => {
      this.setState({ ratio: width / height });
    });
  }

  render() {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={{ uri: this.imageUrl }}
          style={{
            width: "100%",
            height: undefined,
            aspectRatio: this.state.ratio,
          }}
        />
      </SafeAreaView>
    );
  }
}

export default ImageScreen;
