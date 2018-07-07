import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
//import Orientation from 'react-native-orientation';

export default class Loading extends Component {
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    //Orientation.lockToLandscape();
    setTimeout(() => {
      firebase.auth().onAuthStateChanged(user => {
        user
          ? this.props.navigation.navigate('First', { mode: 0, qnums: 10 })
          : this.props.navigation.navigate('Login');
      });
    }, 500);
  }
  render() {
    return (
      <View style={styles.bg}>
        <Text style={styles.logo}>My App</Text>
        {/* <ActivityIndicator size="large" /> */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  logo: {
    fontSize: 50,
    color: '#FFFFE0'
  }
});
