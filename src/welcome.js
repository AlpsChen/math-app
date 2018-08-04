import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  NetInfo,
  Alert
} from 'react-native';
import FIcon from 'react-native-vector-icons/Foundation';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import * as firebase from 'firebase';
import IIcon from 'react-native-vector-icons/Ionicons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EIcon from 'react-native-vector-icons/Entypo';
const { width, height } = Dimensions.get('window');
const texts = ['適性模式', '隨機模式', '簡單模式', '中等模式', '困難模式'];

import { Colors } from './common/constants/colors';

const UserTypeItem = props => {
  const { image, label, labelColor, selected, ...attributes } = props;
  return (
    <TouchableOpacity {...attributes}>
      <View
        style={[
          styles.userTypeItemContainer,
          selected && styles.userTypeItemContainerSelected
        ]}
      >
        <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text>
        <Image
          source={image}
          style={[
            styles.userTypeMugshot,
            selected && styles.userTypeMugshotSelected
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      user: null,
      errorMessage: '',
      username: '',
      status: true
    };
  }
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.navigation.navigate('AccountPage');
      })
      .catch(error => this.setState({ errorMessage: error.message }));
    //LoginManager.logOut();
  };

  componentWillMount() {
    var user = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref('/users/')
      .child(user)
      .once('value')
      .then(snap => {
        this.setState({
          username: snap.val().username
        });
      });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleConnectionChange = isConnected => {};

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  detectConnection() {
    const { navigate, getParam } = this.props.navigation;
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type == 'none' || connectionInfo.type == 'unknown') {
        Alert.alert('請檢查網路連線');
      } else {
        this.setState({ showModal: false });
        navigate('Second', {
          timerIndex: getParam('timerIndex', 1),
          qnums: getParam('qnums', 10),
          volume: getParam('volume', true),
          mode: getParam('mode', 0),
          timer: getParam('timer', true)
        });
        // navigate('Third', {
        //   score: 0,
        //   marked: [
        //     { difficulty: 'easy', index: 2, userAnswer: 'A' },
        //     { difficulty: 'easy', index: 1, userAnswer: 'A' }
        //   ]
        // });
      }
    });
  }

  render() {
    const { navigate, getParam } = this.props.navigation;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/bgImage.jpg')}
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'cover' }}
        >
          {this.state.errorMessage ? (
            <Text style={{ color: 'red' }}>{this.state.errorMessage}</Text>
          ) : null}
          <View style={styles.buttonsContainer}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>{this.state.username},歡迎</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ showModal: !this.state.showModal });
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>開始練習</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigate('ModePage', {
                  initialTimerIndex: getParam('timerIndex', 1),
                  initialQnums: getParam('qnums', 10),
                  initialVolume: getParam('volume', true),
                  initialMode: getParam('mode', 0),
                  initialTimer: getParam('timer', true)
                });
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>設定</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.signOut();
              }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>登出</Text>
            </TouchableOpacity>
          </View>

          <Modal
            isVisible={this.state.showModal}
            supportedOrientations={['portrait', 'landscape']}
            onBackdropPress={() => this.setState({ showModal: false })}
            onSwipe={() => this.setState({ showModal: false })}
            swipeDirection={'left'}
          >
            <View style={styles.modal}>
              <View>
                <Text style={styles.modalText}>
                  {texts[getParam('mode', 0)]}
                </Text>
                <Text style={styles.modalText}>{getParam('qnums', 10)}題</Text>
                {getParam('timer', true) ? (
                  <Text style={styles.modalText}>時限模式</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={this.detectConnection.bind(this)}
              >
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>確定</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    //backgroundColor: "#FAFAD2"
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: width,
    alignItems: 'center'
  },
  iconItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
    //size: 50
  },
  iconSelected: {
    opacity: 1
    //size: 100
  },
  button: {
    backgroundColor: '#FFE4B5',
    padding: 15,
    marginVertical: 12,
    borderRadius: 10,
    shadowRadius: 20,
    shadowOpacity: 0.5,
    width: 180
  },
  buttonText: {
    fontSize: 20,
    //margin: 15,
    color: '#000000',
    //padding: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modal: {
    flex: 1,
    marginHorizontal: '37%',
    marginVertical: 25,
    backgroundColor: '#FFFFE0',
    borderRadius: 10,
    borderColor: '#FFE4B5',
    borderWidth: 5,
    alignItems: 'center'
  },
  modalText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: Colors.orange,
    padding: 15,
    textAlign: 'center',
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderRadius: 10
  }
});
