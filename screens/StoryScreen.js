import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Speech from "expo-speech";
import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: "gray",
      speakerIcon: "volume-high-outline",
      lighttheme:true
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  fetchUser = async () => {
    let theme;
    var refLoc = await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      theme = data.val().current_theme;
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  };
  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  async initiateTTS(title, author, story, moral) {
    const current_color = this.state.speakerColor;
    this.setState({
      speakerColor: current_color === "gray" ? "#ee8249" : "gray"
    });
    if (current_color === "gray") {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak("The moral of the story is!");
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.lighttheme?styles.containerlight:styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.lighttheme?styles.appTitleTextlight:styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView style={this.state.lighttheme?styles.storyCardlight:styles.storyCard}>
              <Image
                source={require("../assets/story_image_1.png")}
                style={styles.image}
              ></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={this.state.lighttheme?styles.storyTitleTextlight:styles.storyTitleText}>
                    {this.props.route.params.storydata.title}
                  </Text>
                  <Text style={this.state.lighttheme?styles.storyAuthorTextlight:styles.storyTitleText}>
                    {this.props.route.params.storydata.author}
                  </Text>
                  <Text style={this.state.lighttheme?styles.storyAuthorTextlight:styles.storyTitleText}>
                    {this.props.route.params.storydata.created_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.initiateTTS(
                        this.props.route.params.storydata.title,
                        this.props.route.params.storydata.author,
                        this.props.route.params.storydata.story,
                        this.props.route.params.storydata.moral
                      )
                    }
                  >
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style={this.state.lighttheme?styles.storyTextlight:styles.storyTitleText}>
                  {this.props.route.params.storydata.story}
                </Text>
                <Text style={this.state.lighttheme?styles.moralTextlight:styles.moralText}>
                  Moral - {this.props.route.params.storydata.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons name={"heart"} size={RFValue(30)} color={this.state.lighttheme?"black":'white'} />
                  <Text style={this.state.lighttheme?styles.likeTextlight:styles.likeText}>{this.props.route.params.storydata.likes}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  containerlight: {
    flex: 1,
    backgroundColor:"black"
  },
  container: {
    flex: 1,
    backgroundColor:"white"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain"
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: "center"
  },
  appTitleTextlight: {
    color: "black",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  storyContainer: {
    flex: 1
  },
  storyCardlight: {
    margin: RFValue(20),
    backgroundColor: "black",
    borderRadius: RFValue(20)
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: "white",
    borderRadius: RFValue(20)
  },
  image: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: "contain"
  },
  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20)
  },
  titleTextContainer: {
    flex: 0.8
  },
  storyTitleTextlight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "black"
  },
  storyTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "white"
  },
  storyAuthorTextlight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "black"
  },
  storyAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "white"
  },
  iconContainer: {
    flex: 0.2
  },
  storyTextContainer: {
    padding: RFValue(20)
  },
  storyTextlight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "black"
  },
  storyText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "white"
  },
  moralTextlight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "black"
  },
  moralText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "white"
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(30)
  },
  likeTextlight: {
    color: "black",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  }
});
