import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import firebase from 'firebase';
import {
  AccessToken,
  LoginManager,
  LoginButton,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';
import Icon from 'react-native-vector-icons/Ionicons';
//import Orientation from 'react-native-orientation';
import * as Progress from 'react-native-progress';
import Expo from 'expo';

const { height, width } = Dimensions.get('screen');
const appId = '476487499464586';

export default class SignUp extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: null,
    username: '',
    loading: false
  };
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };
  componentWillMount() {}

  handleLogin = () => {
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.setState({ loading: false, email: '', password: '' });
        this.props.navigation.navigate('First');
      })
      .catch(error =>
        this.setState({ errorMessage: error.message, loading: false })
      );
  };

  async loginFb() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
      appId,
      {
        permissions: ['public_profile', 'email', 'user_friends']
      }
    );
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,first_name,email,about,picture`
      );
      const json = await response.json();
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      //console.log(json);
      this.setState({ loading: true });
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(() => {
          firebase
            .database()
            .ref('users')
            .child(firebase.auth().currentUser.uid)
            .set({
              username: json.first_name
            });
        })
        .then(() => {
          this.setState({ loading: false });
          this.props.navigation.navigate('First', { mode: 0, qnums: 10 });
        });
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.bg}
          enabled
          behavior={'height'}
          //keyboardVerticalOffset={-50}
        >
          {/* <Text style={styles.top}>登入</Text> */}
          {this.state.errorMessage ? (
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          ) : null}

          <TextInput
            placeholder={'電子郵件'}
            returnKeyType={'next'}
            autoCapitalize={'none'}
            style={styles.textInput}
            onChangeText={email => this.setState({ email, errorMessage: '' })}
            value={this.state.email}
            onSubmitEditing={() => {
              this.gotopassword.focus();
            }}
            keyboardType={'email-address'}
          />
          <TextInput
            secureTextEntry
            placeholder={'密碼'}
            returnKeyType={'go'}
            autoCapitalize={'none'}
            style={styles.textInput}
            onChangeText={password =>
              this.setState({ password, errorMessage: '' })
            }
            value={this.state.password}
            ref={input => {
              this.gotopassword = input;
            }}
          />
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={styles.text}>登入</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate('SignUp');
              this.setState({
                email: '',
                password: ''
              });
            }}
          >
            <Text style={styles.text}>註冊</Text>
          </TouchableOpacity>
          <Icon
            name="logo-facebook"
            color="#3b5998"
            onPress={this.loginFb.bind(this)}
            size={50}
            style={styles.fbButton}
          />
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Progress.CircleSnail
              animating={this.state.loading}
              hidesWhenStopped
              size={70}
              thickness={5}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDAB9'
  },
  textInput: {
    height: 40,
    width: '35%',
    borderColor: 'gray',
    backgroundColor: '#FFFACD',
    marginTop: 8
    //borderRadius: 20,
  },
  button: {
    width: '35%',
    padding: 16,
    marginTop: 20,
    backgroundColor: '#FFEFD5'
    //borderRadius: 20,
  },
  text: {
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    fontWeight: '500'
  },
  top: {
    fontSize: 25,
    fontWeight: '500'
  },
  fbButton: {
    marginTop: 10
  }
});
