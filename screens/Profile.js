import React, { Component } from "react";
import { StyleSheet, Text, View, Switch,Platform, StatusBar,Image,SafeAreaView} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from "firebase";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      lighttheme:true,
      Isenabled:false,
      name:"",
      profileImage:"",
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  toggleSwitch() {
    const previousstate = this.state.Isenabled
    const theme = !this.state.Isenabled?"dark":"light" 
    var updated = {}
    updated["/users/"+firebase.auth().currentUser.uid+"/current_theme"]= theme
    firebase.database().ref().update(updated)
    this.setState({
      Isenabled:!previousstate,
      lighttheme:previousstate
    })

  }
  componentDidMount() {
    this._loadFontsAsync();
    this.fechUser();
  }
  fechUser = async() =>{
    let name,profileimage,theme
    let referencelocation = await firebase.database().ref("/users/"+firebase.auth().currentUser.uid)
    referencelocation.on("value",(data)=>{
      name=`${data.val().first_name}${data.val().last_name}`
      profileimage=`${data.val().profile_picture}`
      theme = `${data.val().current_theme}`
    })
    this.setState({
      name:name,
      profileImage:profileimage,
      lighttheme:theme==="light"? true:false,
      Isenabled: theme==="light"? false:true,
    })
  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View
          style={
            this.state.lighttheme
              ? { flex: 1, backgroundColor: "white" }
              : { flex: 1, backgroundColor: "#000000" }
          }
        >
          <SafeAreaView style={styles.androidSafeArea} />
          <View style={styles.titleStyle}>
            <View style={styles.logoImageView}>
              <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}
              />
            </View>
            <View style={styles.titleTextView}>
              <Text
                style={
                  this.state.lighttheme
                    ? styles.titleTextLight
                    : styles.titleText
                }
              >
                Story Telling App
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.85 }}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: this.state.profileImage }}
                style={styles.profileImage}
              />
              <Text
                style={
                  this.state.lighttheme ? styles.nameTextLight : styles.nameText
                }
              >
                {this.state.name}
              </Text>
            </View>
            <View style={styles.themeContainer}>
              <Text
                style={
                  this.state.lighttheme
                    ? styles.themeTextLight
                    : styles.themeText
                }
              >
                Dark Theme
              </Text>
              <Switch
                style={{
                  transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                }}
                trackColor={{ false: "#767577", true: "white" }}
                thumbColor={this.state.Isenabled ? "orange" : "purple"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  this.toggleSwitch();
                }}
                value={this.state.Isenabled}
              />
            </View>
          </View>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
    androidSafeArea: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    titleStyle: {
      flexDirection: "row",
  
      flex: 0.07,
    },
    titleTextView: {
      flex: 0.7,
  
      justifyContent: "center",
    },
  
    titleText: {
      fontSize: RFValue(35),
      fontFamily: "Bubblegum-Sans",
      color: "white",
    },
    titleTextLight: {
      fontSize: RFValue(35),
      fontFamily: "Bubblegum-Sans",
      color: "black",
    },
    logoImageView: {
      justifyContent: "center",
      flex: 0.3,
    },
    logoImage: {
      resizeMode: "contain",
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    profileImage: {
      width: RFValue(140),
      height: RFValue(140),
      borderRadius: RFValue(100),
    },
    profileImageContainer: {
      justifyContent: "center",
      alignItems: "center",
      flex: 0.5,
    },
    nameText: {
      fontSize: RFValue(35),
      fontFamily: "Bubblegum-Sans",
      color: "white",
      marginTop: RFValue(12),
    },
    nameTextLight: {
      fontSize: RFValue(35),
      fontFamily: "Bubblegum-Sans",
      color: "black",
      marginTop: RFValue(12),
    },
    themeContainer: {
      flex: 0.2,
      justifyContent: "center",
      alignItems: "center",
    },
    themeText: {
      fontFamily: "Bubblegum-Sans",
      color: "white",
      fontSize: RFValue(25),
    },
    themeTextLight: {
      fontFamily: "Bubblegum-Sans",
      color: "black",
      fontSize: RFValue(25),
    },
  
})
