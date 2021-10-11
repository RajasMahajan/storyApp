import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lighttheme:true,
      storyid:this.props.story.key,
      storydata:this.props.story.value,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount(){
    this.fetchUser();
    this._loadFontsAsync();
    
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
  }
 
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let image = {image1:require("../assets/story_image_1.png"),
    image2:require("../assets/story_image_2.png"),
    image3:require("../assets/story_image_3.png"),
    image4:require("../assets/story_image_4.png"),
    image5:require("../assets/story_image_5.png")}
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            this.props.navigation.navigate("StoryScreen", {
              storydata: this.state.storydata,
              storyid:this.state.storyid,
            })
          }
        >
          <View style={this.state.lighttheme?styles.cardContainerlight:styles.cardContainer}>
            <Image
              source={image[this.state.storydata.previewImage]}
              style={styles.storyImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text style={this.state.lighttheme?styles.storyTitleTextlight:styles.storyTitleText}>
                {this.state.storydata.title}
              </Text>
              <Text style={this.state.lighttheme?styles.storyAuthorTextlight:styles.storyAuthorText}>
                {this.state.storydata.author}
              </Text>
              <Text style={this.state.lighttheme?styles.descriptionTextlight:descriptionTextlight}>
                {this.state.storydata.description}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.likeButton}>
                <Ionicons name={"heart"} size={RFValue(30)} color={this.state.lighttheme?'black':'white'} />
                <Text style={this.state.lighttheme?styles.likeButtonlight:styles.likeButton}>120B</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContainerlight: {
    margin: RFValue(13),
    backgroundColor: "black",
    borderRadius: RFValue(20)
  },cardContainer: {
    margin: RFValue(13),
    backgroundColor: "white",
    borderRadius: RFValue(20)
  },
  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  storyTitleTextlight: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "black"
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyAuthorTextlight: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "black"
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  descriptionTextlight: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "black",
    paddingTop: RFValue(10)
  },
  descriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  likeButtonlight: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "black",
    borderRadius: RFValue(30)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "white",
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
