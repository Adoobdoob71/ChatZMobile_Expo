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
      this.setState({ data: [] });
      if (user) {
        this.db = firebase
          .database()
          .ref("users")
          .child(user.uid)
          .child("private_messages");
        this.db.on("value", (snapshot) => {
          this.setState({ data: [] });
          if (snapshot.exists()) {
            snapshot.forEach((item) => {
              let tempDB = firebase
                .database()
                .ref("users")
                .child(item.val().userUID);
              tempDB
                .once("value", (snapshotTwo) => {
                  this.setState({
                    data: [
                      ...this.state.data,
                      {
                        ...snapshotTwo.val(),
                        PM: item.val(),
                        key: snapshotTwo.key,
                      },
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
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Contact
              onPress={() => {
                firebase
                  .database()
                  .ref("users")
                  .child(firebase.auth().currentUser.uid)
                  .update({
                    lastOnline: firebase.database.ServerValue.TIMESTAMP,
                  });
                this.props.navigation.navigate("PrivateMessageScreen", {
                  Item: item,
                });
              }}
              PrivateMessageContact={true}
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
