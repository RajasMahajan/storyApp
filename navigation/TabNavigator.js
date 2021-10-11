import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";
import Feed from "../screens/Feed";
import CreateStory from "../screens/CreateStory";
const Tab = createMaterialBottomTabNavigator();

export default class BottomNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightTheme: true,
      isUpdated: false
    };
  }

  componentDidMount() {
    let theme;
    var refLoc = firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid);
    refLoc.on("value", (data) => {
      theme = data.val().current_theme;
      this.setState({
        lightTheme: theme === "light" ? true : false,
      });
    });
  }

  
  renderFeed = props => {
    return <Feed setUpdateToFalse={this.removeUpdated} {...props} />;
  };

  renderStory = props => {
    return <CreateStory setUpdateToTrue={this.changeUpdated} {...props} />;
  };

  changeUpdated = () => {
    this.setState({ isUpdated: true });
  };

  removeUpdated = () => {
    this.setState({ isUpdated: false });
  };

  render() {
    return (
      <Tab.Navigator
        labeled={false}
        barStyle={
          this.state.lightTheme
            ? styles.bottomTabStyleLight
            : styles.bottomTabStyle
        }
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "DisplayStories") {
              iconName = focused ? "book" : "book-outline";
            } else if (route.name === "CreateStory") {
              iconName = focused ? "create" : "create-outline";
            }
            return (
              <Ionicons
                name={iconName}
                size={RFValue(25)}
                color={color}
                style={styles.iconStyle}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "maroon",
          inactiveTintColor: "gray",
        }}
      >
         <Tab.Screen
          name="DisplayStories"
          component={this.renderFeed}
          options={{ unmountOnBlur: true }}
        />
        <Tab.Screen 
          name="CreateStory"
          component={this.renderStory}
          options={{ unmountOnBlur: true }}
        />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  bottomTabStyle: {
    height: "8%",
    backgroundColor: "#2f345d",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute"
  },
  bottomTabStyleLight: {
    height: "8%",
    backgroundColor: "#eaeaea",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    position: "absolute"
  },
  iconStyle: {
    width: RFValue(30),
    height: RFValue(30),
  },
});