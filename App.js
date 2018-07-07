import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { StackNavigator } from "react-navigation";
import WelcomePage from "./src/welcome";
import QuestionPage from "./src/question";
import ScoringPage from "./src/scoring";
import Loading from "./src/login/loading";
import SignUp from "./src/login/signup";
import Login from "./src/login/login";
import ModePage from "./src/mode";
import ReviewPage from "./src/review";
import HeaderBackButton from "react-navigation/src/views/Header/HeaderBackButton";

const Navigation = StackNavigator(
  {
    First: { screen: WelcomePage },
    Second: { screen: QuestionPage },
    Third: { screen: ScoringPage },
    Loading,
    SignUp,
    Login,
    ModePage,
    ReviewPage,
  },
  {
    initialRouteName: "Loading"
  }
);

console.disableYellowBox = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});

export default Navigation;
