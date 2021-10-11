import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Alert
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import StoryCard from "./StoryCard";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase"
let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

let stories = require("./temp_stories.json");

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lighttheme:true,
      storys:[],
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchstorys();
    this.fetchUser();
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
  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };

  keyExtractor = (item, index) => index.toString();
  
 fetchstorys =()=>{
  
 let keystory 
 firebase.database().ref("/posts/").on("value",(snapshot)=>{
 let storys=[]
 if(snapshot.val()){
   keystory = Object.keys(snapshot.val())
   console.log("keystory: ",keystory)
   keystory.forEach((key)=>{
   storys.push({
     key:key,
     value:snapshot.val()[key]
   })

   console.log("storys: ", storys)
   })
 }
 this.setState({
   storys:storys
 })
 this.props.setUpdateToFalse();
 })
 }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.lighttheme?{flex:1,backgroundColor:'white'}:{flex:1,backgroundColor:'black'}}>
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
          {!this.state.storys[0]?(
            <View style={
              {
                flex:0.85,
                justifyContent:'center',
                alignItems:'center',

              }
            }>
              <Text style={
              this.state.lighttheme?styles.nostorystextlight:styles.nostorystext
              }>No story available You can post</Text>
            </View>
          ):(<View style={styles.cardContainer}>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.storys}
              renderItem={this.renderItem}
            />
          </View>)}
          
        
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
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
  }, appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  cardContainer: {
    flex: 0.85
  },
 nostorystextlight:{

fontFamily:"Bubblegum-Sans",
fontSize:RFValue(35),
color:"black"
},

nostorystext:{

  fontFamily:"Bubblegum-Sans",
  fontSize:RFValue(35),
  color:"white"
  }
});
