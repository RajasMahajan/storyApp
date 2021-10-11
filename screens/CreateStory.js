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
  TextInput,
  Dimensions,
  Alert
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";
import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: "image_1",
      dropdownHeight: 40,
      lighttheme:true,
      title:'',
      description:'',
      moral:'',
      story:'',


    };
  };

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
 addstory= async()=>{
   if(this.state.title && this.state.description && this.state.moral && this.state.story){
     var ref = await firebase.database().ref("/posts/"+Math.random().toString(36).slice(2))
    ref.set({
      previewImage:this.state.previewImage,
      description:this.state.description,
      title:this.state.title,
      story:this.state.story,
      moral:this.state.moral,
      author:firebase.auth().currentUser.displayName,
      createdon:new Date(),
      authorid:firebase.auth().currentUser.uid,
      likes:0


    })
    this.props.setUpdateTotrue();
    this.props.navigation.navigate("Feed")
    
    }else{
      Alert.alert("error","Fill fields properly",[{
        text:'I will see',onPress:()=>{
          console.log("button is pressed")
        }
      }],
      {cancelable:false}
      )
    }
 }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image_1: require("../assets/story_image_1.png"),
        image_2: require("../assets/story_image_2.png"),
        image_3: require("../assets/story_image_3.png"),
        image_4: require("../assets/story_image_4.png"),
        image_5: require("../assets/story_image_5.png")
      };
      return (
        <View style={ this.state.lighttheme
          ? { flex: 1, backgroundColor: "white" }
          : { flex: 1, backgroundColor: "#000000" }}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>
            <View style={ 
                this.state.lighttheme
              ? styles.titletextlight
              : styles.titletext
              }>
              <Text style={styles.appTitleText}>New Story</Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}
              ></Image>
              <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: "Image 1", value: "image_1" },
                    { label: "Image 2", value: "image_2" },
                    { label: "Image 3", value: "image_3" },
                    { label: "Image 4", value: "image_4" },
                    { label: "Image 5", value: "image_5" }
                  ]}
                  defaultValue={this.state.previewImage}
                  containerStyle={{
                    height: 40,
                    borderRadius: 20,
                    marginBottom: 10
                  }}
                  onOpen={() => {
                    this.setState({ dropdownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropdownHeight: 40 });
                  }}
                  style={{ backgroundColor: "transparent" }}
                  itemStyle={{
                    justifyContent: "flex-start"
                  }}
                  dropDownStyle= {this.state.lighttheme?{background:'white',marginLeft:10}:{backgroundColor:'black',marginLeft:10}}
                  labelStyle={this.state.lighttheme?{
                    color: "black",
                    fontFamily: "Bubblegum-Sans"
          
                  }:{
                    color: "white",
                    fontFamily: "Bubblegum-Sans"
          
                  }
                
                }
                  arrowStyle={{
                    color: "white",
                    fontFamily: "Bubblegum-Sans"
                  }}
                  onChangeItem={item =>
                    this.setState({
                      previewImage: item.value
                    })
                  }
                />
              </View>

              <TextInput
                style={this.state.lighttheme?styles.inputFontlight:styles.inputFont}
                onChangeText={title => this.setState({ title })}
                placeholder={"Title"}
                placeholderTextColor={this.state.lighttheme?"black":"white"}
              />

              <TextInput
                style={this.state.lighttheme?
                  styles.inputFontlight:styles.inputFont
                }
                onChangeText={description => this.setState({ description })}
                placeholder={"Description"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={this.state.lighttheme?"black":'white'}
              />
              <TextInput
                style={this.state.lighttheme?
                  styles.inputFontlight:styles.inputFont}
                onChangeText={story => this.setState({ story })}
                placeholder={"Story"}
                multiline={true}
                numberOfLines={20}
                placeholderTextColor={this.state.lighttheme?"black":"white"}
              />

              <TextInput
                style={this.state.lighttheme?
                  styles.inputFontlight:styles.inputFont}
                onChangeText={moral => this.setState({ moral })}
                placeholder={"Moral of the story"}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={this.state.lighttheme?"black":"white"}
              />
              <TouchableOpacity
              style={{
              backgroundColor:'#841584',
              marginTop:RFValue(20),
            width:RFValue(100),
            height:RFValue(60),
            alignSelf:'center',
            justifyContent:'center',
          }}
          onPress={()=>{
          this.addstory();

          }}
          >
                <Text style={{
                fontFamily:'Bubblegum-Sans',
                fontSize:RFValue(20),
                color:'white',
                textAlign:'center',

                }}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={{ flex: 0.08 }} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c",
    
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
  appTitleText: {
    color: "white",
    fontSize: RFValue(28),
    fontFamily: "Bubblegum-Sans"
  },
  fieldsContainer: {
    flex: 0.85
  },
  previewImage: {
    width: "93%",
    height: RFValue(250),
    alignSelf: "center",
    borderRadius: RFValue(10),
    marginVertical: RFValue(10),
    resizeMode: "contain"
  },
  inputFont: {
    height: RFValue(40),
    borderColor: "white",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    padding: RFValue(10),
    color: "white",
    fontFamily: "Bubblegum-Sans",
    marginLeft:RFValue(10),
    marginTop:RFValue(10),
    marginRight:RFValue(10),
    
  },
  inputFontlight: {
    height: RFValue(40),
    borderColor: "black",
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    padding: RFValue(10),
    color: "black",
    fontFamily: "Bubblegum-Sans",
    marginLeft:RFValue(10),
    marginTop:RFValue(10),
    marginRight:RFValue(10),
    
  },
  
  inputTextBig: {
    textAlignVertical: "top",
    padding: RFValue(5)
  },
  titletext:{
    color:'white',
    fontFamily:'Bubblegum-Sans',
    fontSize:RFValue(25),

  },
  titletextlight:{
    color:'black',
    fontFamily:'Bubblegum-Sans',
    fontSize:RFValue(25)
  }
});
