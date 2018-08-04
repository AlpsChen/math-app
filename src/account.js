import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StatusBar
} from 'react-native';
import { Font } from 'expo';
import { Input, Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import FAIcon from 'react-native-vector-icons/FontAwesome';
import FIcon from 'react-native-vector-icons/Feather';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';

import IIcon from 'react-native-vector-icons/Ionicons';
import * as firebase from 'firebase';
import { Permissions, Notifications } from 'expo';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const appId = '476487499464586';

//const BG_IMAGE = require('../../../assets/images/bg_screen4.jpg');

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const TabSelector = ({ selected }) => {
  return (
    <View style={{ marginVertical: 50 }}>
      <View style={selected ? styles.selected : null} />
    </View>
  );
};

export default class AccountPage extends Component {
  constructor(props) {
    super(props);
    this.layoutAnimationActive = false;
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      //fontLoaded: false,
      selectedCategory: 0,
      isLoading: false,
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true,
      errorMessage: '',
      username: ''
    };

    this.selectCategory = this.selectCategory.bind(this);
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  layoutAnimation() {
    //if (!this.layoutAnimationActive) {
    this.layoutAnimationActive = true;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut, () => {
      this.layoutAnimationActive = false;
    });
    //}
  }

  selectCategory(selectedCategory) {
    this.layoutAnimation();
    this.setState({
      selectedCategory,
      isLoading: false
    });
    this.renew();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email);
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }

    // Get the token that uniquely identifies this device
    //   let token = await Notifications.getExpoPushTokenAsync();

    //   var updates = {};
    //   updates['/expoToken'] = token;
    //   firebase
    //     .database()
    //     .ref('users')
    //     .child(user.uid)
    //     .update(updates);
  };

  login() {
    const { email, password, isEmailValid, isPasswordValid } = this.state;
    this.setState({ isLoading: true });
    //email and password check passed
    if (this.validateEmail(email) && password.length >= 8) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.setState({ isLoading: false, email: '', password: '' });
          this.props.navigation.navigate('First');
        })
        .catch(error => {
          //setTimeout(() => {
          this.layoutAnimation();
          this.setState({
            //email: '',
            password: '',
            isLoading: false
          });
          switch (error.code) {
            case 'auth/wrong-password':
              this.setState({
                errorMessage: '帳號或密碼錯誤'
              });
              break;
            case 'auth/user-not-found':
              this.setState({
                errorMessage: '帳號或密碼錯誤'
              });
              break;
            case 'auth/user-disabled':
              this.setState({
                errorMessage: '帳號不存在'
              });
              break;
            case 'auth/network-request-failed':
              this.setState({
                errorMessage: '請檢查網路連線'
              });
              break;
            default:
              this.setState({
                errorMessage: '登入失敗'
              });
              break;
          }
          console.log(error.code);
          this.emailInput.shake();
          this.passwordInput.shake();
          //}, 1000);
        });
    } else {
      //email and password check not passed
      //setTimeout(() => {
      this.layoutAnimation();
      this.setState({
        //email: '',
        password: '',
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake()
      });
      //}, 1000);
    }
  }

  async loginFb() {
    this.setState({ isLoading: true });
    Expo.Facebook.logInWithReadPermissionsAsync(appId, {
      permissions: ['public_profile', 'email', 'user_friends']
    })
      .then(result => {
        if (result.type === 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential(
            result.token
          );
          fetch(
            `https://graph.facebook.com/me?access_token=${
              result.token
            }&fields=id,first_name,email,about,picture`
          ).then(response => {
            response.json().then(json => {
              //console.log('b');
              firebase
                .auth()
                .signInWithCredential(credential)
                .then(authData => {
                  //console.log(authData);
                  firebase
                    .database()
                    .ref('users')
                    .child(authData.uid)
                    .set({
                      username: json.first_name,
                      email: authData.email
                    })
                    .then(() => {
                      this.setState({ isLoading: false });
                      //console.log('a');
                      this.props.navigation.navigate('First');
                      //console.log('b');
                    })
                    .catch(error => console.log(error.Message));
                });
            });
          });
        } else {
          this.setState({ isLoading: false });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false, errorMessage: '登入失敗' });
      });
  }

  renew() {
    this.layoutAnimation();
    this.setState({
      errorMessage: '',
      isEmailValid: true,
      isPasswordValid: true,
      isConfirmationValid: true
    });
  }

  signUp() {
    const { email, password, passwordConfirmation } = this.state;
    this.setState({ isLoading: true });
    //email and password check passed
    if (
      this.validateEmail(email) &&
      password.length >= 8 &&
      password == passwordConfirmation
    ) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(authData => {
          firebase
            .database()
            .ref('users')
            .child(authData.user.uid)
            .set({
              username: this.state.username,
              email: email
            })
            .then(() => {
              this.registerForPushNotificationsAsync().then(() => {
                this.setState({ isLoading: false });
                this.props.navigation.navigate('First');
              });
            })
            .catch(error => console.log(error.Message));
        })
        .catch(error => {
          //setTimeout(() => {
          this.layoutAnimation();
          this.setState({
            //email: '',
            password: '',
            passwordConfirmation: '',
            isLoading: false
          });
          switch (error.code) {
            case 'auth/email-already-in-use':
              this.setState({
                errorMessage: '帳號已在別處被使用'
              });
              break;
            case 'auth/network-request-failed':
              this.setState({
                errorMessage: '請檢查網路連線'
              });
              break;
            default:
              this.setState({
                errorMessage: '註冊失敗'
              });
              console.log(error.Message);
              break;
          }
          this.emailInput.shake();
          this.passwordInput.shake();
          //}, 1000)
        });
    } else {
      //email and password check not passed
      //setTimeout(() => {
      this.layoutAnimation();
      this.setState({
        //email: '',
        password: '',
        passwordConfirmation: '',
        isLoading: false,
        isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
        isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
        isConfirmationValid:
          password == passwordConfirmation || this.confirmationInput.shake()
      });
      //}, 1000);
    }
  }

  render() {
    //console.log(this.state.errorMessage);
    var isLoginPage = this.state.selectedCategory === 0;
    var isSignUpPage = this.state.selectedCategory === 1;
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <KeyboardAwareScrollView enableOnAndroid>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View
              style={styles.rowContainer}
              onLayout={() => {
                console.log('a');
              }}
            >
              <View style={styles.buttonContainer}>
                <Button
                  disabled={this.state.isLoading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(0)}
                  containerStyle={{
                    marginBottom: 30,
                    borderColor: isLoginPage
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.35)',
                    borderWidth: 2,
                    borderRadius: 10
                  }}
                  titleStyle={[
                    styles.categoryText,
                    isLoginPage ? { opacity: 1 } : null
                  ]}
                  title={'登入'}
                />
                <Button
                  disabled={this.state.isLoading}
                  clear
                  activeOpacity={0.7}
                  onPress={() => this.selectCategory(1)}
                  containerStyle={{
                    marginTop: 30,
                    borderColor: isSignUpPage
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.35)',
                    borderWidth: 2,
                    borderRadius: 10
                  }}
                  titleStyle={[
                    styles.categoryText,
                    isSignUpPage ? { opacity: 1 } : null
                  ]}
                  title={'註冊'}
                />
              </View>
              <View style={styles.selectorContainer}>
                <TabSelector selected={isLoginPage} />
                <TabSelector selected={isSignUpPage} />
              </View>

              {/* <KeyboardAvoidingView
              //contentContainerStyle={styles.loginContainer}
              behavior="position"
            > */}
              <View style={styles.formContainer}>
                {this.state.errorMessage ? (
                  <View style={{ alignSelf: 'flex-start', marginLeft: 25 }}>
                    <Text style={{ color: '#FF2D00', fontSize: 12 }}>
                      {this.state.errorMessage}
                    </Text>
                  </View>
                ) : null}
                {isSignUpPage ? (
                  <Input
                    leftIcon={
                      <FIcon
                        name="user"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                        //iconStyle={{ left: -5 }}
                      />
                    }
                    value={this.state.username}
                    keyboardAppearance="light"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType={'next'}
                    containerStyle={{
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)'
                    }}
                    inputStyle={{ marginLeft: 10 }}
                    placeholder={'暱稱'}
                    //ref={input => (this.confirmationInput = input)}
                    onSubmitEditing={() => this.emailInput.focus()}
                    onChangeText={username => {
                      this.setState({ username });
                      //this.renew();
                    }}
                  />
                ) : null}
                <Input
                  leftIcon={
                    <FAIcon
                      name="envelope-o"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  value={this.state.email}
                  keyboardAppearance="light"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  //containerStyle={{ marginLeft: 10 }}
                  placeholder={'電子郵件'}
                  containerStyle={[
                    isSignUpPage ? { marginTop: 16 } : null,
                    { borderBottomColor: 'rgba(0, 0, 0, 0.38)' }
                  ]}
                  ref={input => (this.emailInput = input)}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  onChangeText={email => {
                    this.setState({ email });
                    this.renew();
                  }}
                  errorMessage={
                    this.state.isEmailValid ? null : '請輸入有效電子郵件'
                  }
                />
                <Input
                  leftIcon={
                    <SLIcon
                      name="lock"
                      color="rgba(0, 0, 0, 0.38)"
                      size={25}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  }
                  value={this.state.password}
                  keyboardAppearance="light"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={true}
                  returnKeyType={isSignUpPage ? 'next' : 'done'}
                  blurOnSubmit={true}
                  containerStyle={{
                    marginTop: 16,
                    borderBottomColor: 'rgba(0, 0, 0, 0.38)'
                  }}
                  inputStyle={{ marginLeft: 10 }}
                  placeholder={'密碼'}
                  ref={input => (this.passwordInput = input)}
                  onSubmitEditing={() =>
                    isSignUpPage ? this.confirmationInput.focus() : this.login()
                  }
                  onChangeText={password => {
                    this.setState({ password });
                    this.renew();
                  }}
                  errorMessage={
                    this.state.isPasswordValid ? null : '密碼長度需至少為8字元'
                  }
                />
                {isSignUpPage ? (
                  <Input
                    leftIcon={
                      <SLIcon
                        name="lock"
                        color="rgba(0, 0, 0, 0.38)"
                        size={25}
                        style={{ backgroundColor: 'transparent' }}
                      />
                    }
                    value={this.state.passwordConfirmation}
                    secureTextEntry={true}
                    keyboardAppearance="light"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType={'done'}
                    blurOnSubmit={true}
                    containerStyle={{
                      marginTop: 16,
                      borderBottomColor: 'rgba(0, 0, 0, 0.38)'
                    }}
                    inputStyle={{ marginLeft: 10 }}
                    placeholder={'確認密碼'}
                    ref={input => (this.confirmationInput = input)}
                    onSubmitEditing={this.signUp}
                    onChangeText={passwordConfirmation => {
                      this.setState({ passwordConfirmation });
                      this.renew();
                    }}
                    errorMessage={
                      this.state.isConfirmationValid ? null : '兩密碼不相同'
                    }
                  />
                ) : null}
                {/* <View style={{ flexDirection: 'row' }}> */}

                {isLoginPage ? (
                  <IIcon
                    name="logo-facebook"
                    color="#3b5998"
                    onPress={this.loginFb.bind(this)}
                    size={50}
                    style={styles.fbButton}
                    borderRadius={10}
                  />
                ) : null}
                <Button
                  buttonStyle={styles.loginButton}
                  containerStyle={{
                    marginTop: 25,
                    flex: 0,
                    alignItems: 'center'
                  }}
                  activeOpacity={0.8}
                  title={isLoginPage ? '登入' : '註冊'}
                  onPress={isLoginPage ? this.login : this.signUp}
                  titleStyle={styles.loginTextButton}
                  loading={this.state.isLoading}
                  disabled={this.state.isLoading}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDAB9',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

    //alignSelf: 'center'
  },
  buttonContainer: {
    //flex: 1,
    flexDirection: 'column'
    //position: 'absolute',
    //top: 20,
    //left: 20
  },
  selectorContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  selected: {
    //position: 'absolute',
    borderRadius: 70,
    height: 0,
    width: 0,
    right: -50,
    //top: 50,
    borderLeftWidth: 70,
    borderBottomWidth: 70,
    //marginTop: 50,
    borderColor: 'white',
    backgroundColor: 'white'
  },
  fbButton: {
    marginTop: 15,
    marginBottom: -15,
    borderRadius: 20
  },
  loginTextButton: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  loginButton: {
    backgroundColor: 'rgba(232, 147, 142, 1)',
    borderRadius: 10,
    height: 50,
    width: 200
  },
  formContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH * 0.55,
    //flex: 1,
    borderRadius: 10,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center'
    //marginVertical: 100
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  categoryText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    //fontFamily: 'light',
    backgroundColor: 'transparent',
    opacity: 0.7,
    fontWeight: 'bold'
  },
  titleText: {
    color: 'white',
    fontSize: 30
    //fontFamily: 'regular'
  },
  helpContainer: {
    //height: 64,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
