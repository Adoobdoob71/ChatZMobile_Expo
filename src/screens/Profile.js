import * as React from "react";
import { FlatList, SafeAreaView, View, Text, Image } from "react-native";
import * as firebase from "firebase";
import { withTheme } from "react-native-paper";
import PostCard from "../components/PostCard";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      data: [],
    };
    this.userUID = this.props.route.params.userUID;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.userUID);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
      this.props.navigation.setOptions({
        headerTitle: snapshot.val().username,
      });
    });
    this.dbTwo = firebase
      .database()
      .ref("posts")
      .orderByChild("userUID")
      .equalTo(this.userUID);
    this.dbTwo.once("value", (snapshot) => {
      let tempData = [];
      snapshot.forEach((item) => {
        let itm = { ...item.val(), key: item.key };
        tempData.push(itm);
      });
      this.setState({ data: tempData });
    });
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    const colors = this.props.theme.colors;
    if (this.state.userDetails)
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={this.state.data}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View>
                <View
                  style={{
                    backgroundColor: colors.card,
                    width: "100%",
                    paddingTop: 40,
                    paddingBottom: 20,
                  }}>
                  <View
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                    }}>
                    <Image
                      source={{ uri: this.state.userDetails.profilePictureUrl }}
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 55,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        marginTop: 8,
                      }}>
                      {this.state.userDetails.username}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.placeholder,
                        marginTop: 4,
                      }}
                      numberOfLines={2}
                      ellipsizeMode="tail">
                      {this.state.userDetails.description}
                    </Text>
                  </View>
                </View>
              </View>
            )}
            renderItem={({ item }) => (
              <PostCard Item={item} navigation={this.props.navigation} />
            )}
          />
        </SafeAreaView>
      );
    else return null;
  }
}

export default withTheme(Profile);
