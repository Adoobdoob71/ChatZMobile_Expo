import * as React from "react";
import { FlatList, SafeAreaView } from "react-native";
import * as firebase from "firebase";
import Contact from "../components/Contact";

class ContactsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ data: [] });
        this.db = firebase
          .database()
          .ref("users")
          .child(user.uid)
          .child("private_messages");
        this.db.on("value", (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((item) => {
              let tempDB = firebase
                .database()
                .ref("users")
                .child(item.val().userUID);
              tempDB
                .once("value", (snapshot) => {
                  this.setState({
                    data: [
                      ...this.state.data,
                      { ...snapshot.val(), PM: item.val(), key: snapshot.key },
                    ],
                  });
                })
                .then(() => tempDB.off());
            });
          }
        });
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          style={{ flex: 1 }}
          renderItem={({ item }) => (
            <Contact
              onPress={() =>
                this.props.navigation.navigate("PrivateMessageScreen", {
                  Item: item,
                })
              }
              Item={item}
              navigation={this.props.navigation}
            />
          )}
        />
      </SafeAreaView>
    );
  }
}

export default ContactsScreen;
