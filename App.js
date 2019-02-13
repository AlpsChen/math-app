import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, StatusBar } from 'react-native';

import { createStackNavigator } from 'react-navigation';
import WelcomePage from './src/welcome';
import QuestionPage from './src/question';
import ScoringPage from './src/scoring';
import ModePage from './src/mode';
import ReviewPage from './src/review';
import OnboardingPageiOS from './src/onboardingiOS';
import AccountPageiOS from './src/accountiOS';
import AccountPageAndroid from './src/accountAndroid';
import OnboardingPageAndroid from './src/onboardingAndroid';
import checkIfFirstLaunch from './src/components/checkIfFirstLaunch';
import { Notifications } from 'expo';

import * as firebase from 'firebase';
import { translate } from 'react-i18next';
import i18n from './src/common/i18n';

// Route & Localization settings
// ============================================

const routeConfig = {
  First: { screen: WelcomePage },
  Second: { screen: QuestionPage },
  Third: { screen: ScoringPage },
  ModePage,
  ReviewPage,
  AccountPageAndroid,
  AccountPageiOS,
  OnboardingPageAndroid,
  OnboardingPageiOS
};

translate.setDefaults({
  bindI18n: 'languageChanged',
  bindStore: false
});

const FirstNavigation = createStackNavigator(routeConfig, {
  initialRouteName: 'First'
});
const WrappedFirst = ({ t }) => {
  return <FirstNavigation screenProps={{ t }} />;
};
const First = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedFirst);

const LoginNavigation = createStackNavigator(routeConfig, {
  initialRouteName:
    Platform.OS === 'ios' ? 'AccountPageiOS' : 'AccountPageAndroid'
});
const WrappedLogin = ({ t }) => {
  return <LoginNavigation screenProps={{ t }} />;
};
const Login = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedLogin);

const OnboardingNavigation = createStackNavigator(routeConfig, {
  initialRouteName:
    Platform.OS === 'ios' ? 'OnboardingPageiOS' : 'OnboardingPageAndroid'
});
const WrappedOnboarding = ({ t }) => {
  return <OnboardingNavigation screenProps={{ t }} />;
};
const Onboarding = translate('common', {
  bindI18n: 'languageChanged',
  bindStore: false
})(WrappedOnboarding);

// ============================================

// Notification settings
// ============================================

const localNotification = {
  title: '會考的數學會考',
  body: '每天練習可以增加手感ㄛ',
  ios: { sound: true }
};
const schedulingOptions = {
  time: 1533038400,
  repeat: 'day'
};
Notifications.scheduleLocalNotificationAsync(
  localNotification,
  schedulingOptions
);

// ============================================

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
    // if (!checkedAsyncStorage) {
    //   return null;
    // }
    // if (isFirstLaunch) return <Onboarding />;
    // else if (initialRoute === 'First') return <First />;
    // else if (initialRoute === 'Login') return <Login />;
    // else return null;

    return <Onboarding />;
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
