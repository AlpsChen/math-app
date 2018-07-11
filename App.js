import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import WelcomePage from './src/welcome';
import QuestionPage from './src/question';
import ScoringPage from './src/scoring';
import ModePage from './src/mode';
import ReviewPage from './src/review';
import Onboarding from './src/onboarding';
import AccountPage from './src/account';
import checkIfFirstLaunch from './src/components/checkIfFirstLaunch';
//import HeaderBackButton from 'react-navigation/src/views/Header/HeaderBackButton';
import * as firebase from 'firebase';

const routeConfig = {
  First: { screen: WelcomePage },
  Second: { screen: QuestionPage },
  Third: { screen: ScoringPage },
  // Loading,
  // SignUp,
  // Login,
  ModePage,
  ReviewPage,
  AccountPage
};
const FirstNavigation = createStackNavigator(routeConfig, {
  initialRouteName: 'First'
});
const LoginNavigation = createStackNavigator(routeConfig, {
  initialRouteName: 'AccountPage'
});

export default class App extends Component {
  state = {
    initialRoute: '',
    isFirstLaunch: false,
    checkedAsyncStorage: false
  };

  async componentWillMount() {
    const isFirstLaunch = await checkIfFirstLaunch();
    this.setState({ isFirstLaunch, checkedAsyncStorage: true });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ initialRoute: user ? 'First' : 'Login' });
    });
  }
  render() {
    console.disableYellowBox = true;
    const { checkedAsyncStorage, isFirstLaunch, initialRoute } = this.state;
    if (!checkedAsyncStorage) {
      return null;
    }
    if (isFirstLaunch) return <Onboarding />;
    else if (initialRoute === 'First') return <FirstNavigation />;
    else if (initialRoute === 'Login') return <LoginNavigation />;
    else return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});
