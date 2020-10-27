import React from "react";
import { Image, SafeAreaView, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { IconButton, withTheme, Snackbar } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

class ImageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ratio: 0.5,
      bordersVisible: true,
      downloading: false,
      progress: 0,
      message: null,
    };
    this.imageUrl = this.props.route.params.imageUrl;
    this.title = this.props.route.params.title;
    Image.getSize(this.imageUrl, (width, height) => {
      this.setState({ ratio: width / height });
    });
  }

  callback = (progress) => {
    let result =
      progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
    this.setState({ progress: result });
    if (result == 1) this.setState({ downloading: false });
  };

  saveImage = async () => {
    try {
      const path = FileSystem.createDownloadResumable(
        this.imageUrl,
        FileSystem.documentDirectory
      );
      const { uri } = await path.downloadAsync();
      let exists = await MediaLibrary.getAlbumAsync("ChatZ");
      if (exists)
        MediaLibrary.addAssetsToAlbumAsync(uri, "ChatZ").then(() =>
          this.setState({ message: "Download successful! 😃" })
        );
      else
        MediaLibrary.createAlbumAsync("ChatZ", uri).then(() =>
          this.setState({ message: "Download successful! 😃" })
        );
    } catch (error) {
      this.setState({ message: "Download unsuccessful 😞" });
    }
  };

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
      <>
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
            <IconButton
              icon="download"
              color={colors.text}
              onPress={this.saveImage}
            />
          </View>
        </SafeAreaView>
        <Snackbar
          visible={this.state.message}
          action={{
            label: "DISMISS",
            onPress: () => this.setState({ message: null }),
          }}
          onDismiss={() => this.setState({ message: null })}>
          {this.state.message && this.state.message}
        </Snackbar>
      </>
    );
  }
}

export default withTheme(ImageScreen);
