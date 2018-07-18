import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  State,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  TouchableHighlight,
  ActivityIndicator,
  NetInfo,
  StatusBar
} from 'react-native';
import * as firebase from 'firebase';
import ChoiceButton from './components/choicebutton';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Foundation';
import IIcons from 'react-native-vector-icons/Ionicons';
import Drawer from 'react-native-drawer';
import MathJax from 'react-native-mathjax';
import { Audio, PlaybackObject } from 'expo';

import DrawerContent from './components/drawerContent';

import { Colors } from './common/constants/colors';
import { styles } from '../styles';

const iosConfig = {
  clientId:
    '163605876535-b8nca0rgug75bphrobpmrpjd02onr2np.apps.googleusercontent.com',
  appId: '1:163605876535:ios:e9b4e1bdb99bad8f',
  apiKey: 'AIzaSyAC4lAbF8f-ffsL44NSfQFvruI6BxjCg8k',
  databaseURL: 'https://myapp1116.firebaseio.com/',
  storageBucket: 'myapp1116.appspot.com'
  //messaging:
};
firebase.initializeApp(iosConfig);

var chosenEasy = [100],
  chosenMedium = [100],
  chosenHard = [100];
const { height, width } = Dimensions.get('screen');

export default class QuestionPage extends Component {
  constructor(props) {
    super(props);
    this.num = 0; // the nth question
    this.score = 0; // correct number of questions
    this.difficulty = 'easy'; // current difficulty
    this.index = 0; // index of current question in Firebase
    this.marked = []; // records the marked questions
    this.correctCount = 0;
    this.chosenOption = ''; // the option that the user chose
    this.state = {
      data: '', // data of current question
      total: 0, // total question of current difficulty
      shownext: false, // true to show the "next" button
      renew: true, // true to refresh the question display and buttons
      correct: false, // true if answered correctly
      showModal: false, // true to show modal (計算紙)
      mark: false, // true if current question is marked
      isConnected: true
    };
    //Orientation.lockToLandscape();
    chosenEasy.fill(false);
    chosenMedium.fill(false);
    chosenHard.fill(false);
  }

  componentWillMount() {
    this.next();
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleConnectionChange = isConnected => {
    this.setState({ isConnected });
  };
  static navigationOptions = ({ navigation }) => {
    const { getParam } = navigation;
    const { params } = navigation.state;
    var mark = false;
    return {
      title: '題目：' + getParam('displaynum', 1) + '/' + getParam('qnums', 10),
      headerStyle: {
        backgroundColor: Colors.orange
      },
      //header: <ImageHeader/>,
      headerLeft: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('你確定要離開嗎', '記錄將不會被儲存', [
                {
                  text: '確定',
                  onPress: () => {
                    navigation.goBack();
                  }
                },
                { text: '不要啊', onPress: () => {}, style: 'cancel' }
              ]);
            }}
          >
            <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>
              {'   '}
              離開{'    '}
            </Text>
          </TouchableOpacity>
          {params.mark ? (
            <MCIcon
              name={'bookmark'}
              onPress={() => {
                params.onClickMark(params.mark);
              }}
              color={'#000'}
              size={24}
              style={{ marginTop: 3 }}
            />
          ) : (
            <MCIcon
              name={'bookmark-outline'}
              onPress={() => {
                params.onClickMark(params.mark);
              }}
              color={'#000'}
              size={24}
              style={{ marginTop: 3 }}
            />
          )}
        </View>
      ),
      headerRight: (
        <View style={styles.topright}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>
            難度：
          </Text>
          {params.icons}
        </View>
      )
    };
  };

  //mark the question
  onClickMark = now => {
    if (now) {
      //unmark question
      this.props.navigation.setParams({ mark: false });
      this.setState({ mark: false });
    } else {
      //mark question
      this.props.navigation.setParams({ mark: true });
      this.setState({ mark: true });
    }
  };

  displaystars() {
    switch (this.difficulty) {
      case 'easy':
        var stars = 1;
        break;
      case 'medium':
        var stars = 2;
        break;
      case 'hard':
        var stars = 3;
        break;
    }
    var IconArray = [5];
    for (let i = 0; i < stars; i++) {
      IconArray[i] = <FIcon key={i} name={'star'} size={26} />;
    }
    for (let i = stars; i < 5; i++) {
      IconArray[i] = <Text key={i}> </Text>;
    }
    return IconArray;
  }

  setState_difficulty(nxt) {
    this.difficulty = nxt;
  }

  //determine the difficulty of the next question (according to the mode)
  determine_next() {
    let { params } = this.props.navigation.state;
    switch (params.mode) {
      //adapting mode
      case 0:
        if (this.state.correct) {
          switch (this.difficulty) {
            case 'easy':
              this.setState_difficulty('medium');
              break;
            case 'medium':
              this.setState_difficulty('hard');
              break;
            case 'hard':
              break;
          }
        } else {
          switch (this.difficulty) {
            case 'easy':
              //alert('簡單題欸！');
              break;
            case 'medium':
              this.setState_difficulty('easy');
              break;
            case 'hard':
              this.setState_difficulty('medium');
              break;
          }
        }
        break;

      //random mode
      case 1:
        var i = Math.floor(Math.random() * 3);
        if (i == 0) this.setState_difficulty('easy');
        else if (i == 1) this.setState_difficulty('medium');
        else this.setState_difficulty('hard');
        break;

      //easy mode
      case 2:
        this.setState_difficulty('easy');
        break;

      //medium mode
      case 3:
        this.setState_difficulty('medium');
        break;

      //hard mode
      case 4:
        this.setState_difficulty('hard');
        break;
    }
    //console.warn(this.state.difficulty);
  }

  generateRandom(currentTotal, currentArray) {
    do {
      this.index = Math.floor(Math.random() * currentTotal) + 1;
    } while (currentArray[this.index]);

    currentArray[this.index] = true;
  }

  next() {
    if (this.state.mark && this.num > 0) {
      this.marked.push({
        difficulty: this.difficulty,
        index: this.index,
        userAnswer: this.chosenOption
      });
    }
    if (this.num < this.props.navigation.state.params.qnums) {
      this.num++;
      //console.warn(this.state.correct);
      this.determine_next();
      //the total number of question of the current difficulty
      firebase
        .database()
        .ref('/questionBank/' + this.difficulty)
        .once('value')
        .then(snap => {
          this.setState({
            total: snap.val().total
          });
        })
        .then(() => {
          var starArray = this.displaystars();
          this.props.navigation.setParams({
            displaynum: this.num,
            difficult: this.difficulty,
            icons: starArray,
            onClickMark: this.onClickMark.bind(this),
            mark: false
          });

          switch (this.difficulty) {
            case 'easy':
              this.generateRandom(this.state.total, chosenEasy);
              break;
            case 'medium':
              this.generateRandom(this.state.total, chosenMedium);
              break;
            case 'hard':
              this.generateRandom(this.state.total, chosenHard);
              break;
          }

          //download json data from Firebase
          firebase
            .database()
            .ref('/questionBank/' + this.difficulty + '/' + this.index)
            .once('value')
            .then(snap => {
              this.setState({
                data: snap.val(),
                shownext: false,
                renew: false,
                correct: false,
                onClickMark: this.onClickMark.bind(this),
                mark: false
              });
            });
        });
    } else {
      //go to scoring page
      var { navigate } = this.props.navigation;
      navigate('Third', { score: this.score, marked: this.marked });
    }
  }

  showoptions() {
    var options = [];
    for (let i = 0; i < 4; i++) {
      var option = String.fromCharCode('A'.charCodeAt() + i);
      let correctoption = option.localeCompare(this.state.data.answer);
      options.push(
        <View key={option}>
          {this.state.renew ? null : (
            <ChoiceButton
              text={option}
              close={this.state.shownext ? true : false}
              onColor={correctoption ? 'red' : 'green'}
              shouldshake={correctoption ? true : false}
              _onPress={() => {
                this.setState({ shownext: true });
                var lastCorrectCount = 0;
                if (!correctoption) {
                  //the option is correct when correctoption = 0
                  this.setState({ correct: true });
                  this.score += 1 / this.props.navigation.state.params.qnums;
                  this.correctCount++;
                } else {
                  lastCorrectCount = this.correctCount;
                  this.correctCount = 0;
                }
                //this.chosenOption = key;
                this.renderSound(lastCorrectCount);
              }}
            />
          )}
        </View>
      );
    }
    return options;
  }

  renderSound = lastCorrectCount => {
    switch (this.correctCount) {
      case 0:
        var i = Math.floor(Math.random() * 3);
        switch (i) {
          case 0:
            this.sound(
              require('../assets/sounds/wrong-defeat.mp3'),
              lastCorrectCount >= 3
            );
            break;
          case 1:
            this.sound(require('../assets/sounds/wrong-executed.mp3'), true);
            break;
          case 2:
            this.sound(
              require('../assets/sounds/wrong-youHaveBeenSlained.mp3'),
              true
            );
            break;
        }

        break;
      case 1:
        if (this.num == 1)
          this.sound(require('../assets/sounds/firstBlood.mp3'));
        else this.sound(require('../assets/sounds/correct.mp3'));
        break;

      case 2:
        this.sound(require('../assets/sounds/doubleKill.mp3'));
        break;
      case 3:
        this.sound(require('../assets/sounds/tripleKill.mp3'));
        break;
      case 4:
        this.sound(require('../assets/sounds/quadraKill.mp3'));
        break;
      case 5:
        this.sound(require('../assets/sounds/pentaKill.mp3'));
        break;
      case 6:
        this.sound(require('../assets/sounds/killingSpree.mp3'), false);
        break;
      case 7:
        this.sound(require('../assets/sounds/rampage.mp3'), false);
        break;
      case 8:
        this.sound(require('../assets/sounds/unstoppable.mp3'), false);
        break;
      case 9:
        this.sound(require('../assets/sounds/dominating.mp3'), false);
        break;
      case 10:
        this.sound(require('../assets/sounds/godlike.mp3'), false);
        break;
      case this.correctCount > 10:
        this.sound(require('../assets/sounds/legendary.mp3'), false);
        break;
      default:
        break;
    }
  };

  sound = (position, shutDown) => {
    const soundObject = new Expo.Audio.Sound();
    soundObject.loadAsync(position).then(() => {
      soundObject.playAsync();
      // .then(() => {
      //   if (shutDown) {
      //     const soundObjecta = new Expo.Audio.Sound();
      //     soundObjecta
      //       .loadAsync(require('../assets/sounds/shutDown.mp3'))
      //       .then(() => {
      //         soundObjecta.playAsync();
      //       });
      //   }
      // });
    });
  };

  renderOptions = () => {
    var { data } = this.state;
    var { width } = Dimensions.get('window');
    if (data.A) {
      if (data.A.length + data.B.length + data.C.length + data.D.length < 20) {
        return (
          <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
            (A) {'  '}
            {this.state.data.A}
            {'    '} (B) {'  '}
            {this.state.data.B}
            {'    '} (C) {'  '}
            {this.state.data.C}
            {'    '} (D) {'  '}
            {this.state.data.D}
          </Text>
        );
      } else {
        return (
          <View>
            <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
              (A) {this.state.data.A}
            </Text>
            <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
              (B) {this.state.data.B}
            </Text>
            <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
              (C) {this.state.data.C}
            </Text>
            <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
              (D) {this.state.data.D}
            </Text>
          </View>
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.bg}>
        <StatusBar hidden />
        {this.state.renew ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 2, alignItems: 'center' }}>
              <ActivityIndicator
                animating
                size={'large'}
                style={{ marginTop: 20 }}
              />
              {this.state.isConnected ? null : (
                <Text style={{ color: 'red', marginTop: 20, fontSize: 20 }}>
                  請檢查網路連線
                </Text>
              )}
            </View>
            <View style={styles.buttons} />
          </View>
        ) : (
          <Drawer
            type="overlay"
            open={this.state.showModal}
            openDrawerOffset={0.2}
            //closedDrawerOffset={-3}
            styles={styles.drawer}
            //tweenHandler={Drawer.tweenPresets.parallax}
            side={'bottom'}
            ref={ref => (this._drawer = ref)}
            onCloseStart={() => {
              this.setState({ showModal: false });
            }}
            content={
              <DrawerContent color={['#008000', '#FF6347', '#87CEFA']} />
            }
          >
            ','
            <View style={{ flex: 2, justifyContent: 'center' }}>
              {/* display question */}
              <ScrollView>
                {this.state.data ? (
                  <View>
                    <Text
                      style={{
                        fontSize: 24,
                        marginHorizontal: 20,
                        marginVertical: 10
                      }}
                    >
                      {this.state.data.content}
                    </Text>
                    {this.renderOptions()}
                  </View>
                ) : null}
              </ScrollView>
            </View>
            <View style={styles.buttons}>
              {this.showoptions()}
              <View style={styles.nextbutton}>
                <MCIcon
                  name={'arrow-right-bold-box'}
                  size={85}
                  color={this.state.shownext ? Colors.white : Colors.orange}
                  onPress={() => {
                    //console.warn(this.state.shownext);
                    if (this.state.shownext) {
                      this.next();
                      this.setState({
                        renew: true
                      });
                    }
                  }}
                />
                {/* <Text>{this.state.data.answer}</Text> */}
              </View>
              <IIcons
                name="ios-paper-outline"
                size={50}
                onPress={() => {
                  this.setState({
                    showModal: true
                  });
                }}
              />
            </View>
          </Drawer>
        )}
      </View>
    );
  }
}
