import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import * as firebase from 'firebase';
//import Orientation from 'react-native-orientation';
import * as Progress from 'react-native-progress';

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
  componentWillMount() {
    //Orientation.lockToLandscape();
  }

  handleSignUp = () => {
    // this.setState({
    //   loading: true
    // });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        firebase
          .database()
          .ref('users')
          .child(firebase.auth().currentUser.uid)
          .set({
            username: this.state.username
          });
        //this.setState({ loading: false });
        console.log('a');
        this.props.navigation.navigate('First', { mode: 0, qnums: 10 });
        console.log('b');
      })
      .catch(error =>
        this.setState({
          errorMessage: error.message,
          loading: false
        })
      );
  };

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
            placeholder={'暱稱'}
            returnKeyType={'next'}
            autoCapitalize={'none'}
            style={styles.textInput}
            onChangeText={username =>
              this.setState({ username, errorMessage: '' })
            }
            value={this.state.username}
            onSubmitEditing={() => {
              this.gotoemail.focus();
            }}
          />
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
            ref={input => {
              this.gotoemail = input;
            }}
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
          <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
            <Text style={styles.text}>註冊</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.text}>已有帳號？</Text>
          </TouchableOpacity>
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
  }
});
