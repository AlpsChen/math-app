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
  StatusBar,
  LayoutAnimation
} from 'react-native';
import * as firebase from 'firebase';
import ChoiceButton from './components/choicebutton';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Foundation';
import IIcons from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Drawer from 'react-native-drawer';
import MathJax from 'react-native-mathjax';
import ProgressBar from 'react-native-progress/Bar';
import Modal from 'react-native-modal';
import { Audio, PlaybackObject } from 'expo';
import { translate } from 'react-i18next';

import DrawerContent from './components/drawerContent';

import { Colors } from './common/constants/colors';
import { styles } from '../styles';
import { timeLimits } from './common/constants/constants';
import { soundsCorrect, soundsWrong } from './common/constants/sounds';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const firebaseConfig = {
  clientId:
    '163605876535-b8nca0rgug75bphrobpmrpjd02onr2np.apps.googleusercontent.com',
  appId: '1:163605876535:ios:e9b4e1bdb99bad8f',
  apiKey: 'AIzaSyAC4lAbF8f-ffsL44NSfQFvruI6BxjCg8k',
  databaseURL: 'https://myapp1116.firebaseio.com/',
  storageBucket: 'myapp1116.appspot.com'
  //messaging:
};
firebase.initializeApp(firebaseConfig);

var chosenEasy = [100],
  chosenMedium = [100],
  chosenHard = [100];
const { height, width } = Dimensions.get('screen');
const IOS = Platform.OS === 'ios';

export class QuestionPage extends Component {
  constructor(props) {
    super(props);
    this.num = 0; // the nth question
    this.score = 0; // correct number of questions
    this.difficulty = 'easy'; // current difficulty
    this.index = 0; // index of current question in Firebase
    this.marked = []; // records the marked questions
    this.mark = false;
    this.correctCount = 0;
    this.interval = null;
    this.chosenOption = ''; // the option that the user chose
    this.state = {
      data: '', // data of current question
      total: 0, // total question of current difficulty
      shownext: false, // true to show the "next" button
      renew: true, // true to refresh the question display and buttons
      correct: false, // true if answered correctly
      showModal: false, // true to show modal (計算紙)
      barColor: '',
      isConnected: true,
      countdown: 1,
      timeUp: false,
      displayBar: true
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
    //this.animateCountdown();
  }

  handleConnectionChange = isConnected => {
    this.setState({ isConnected });
  };
  static navigationOptions = ({ screenProps, navigation }) => {
    const { getParam } = navigation;
    const { params } = navigation.state;
    const { t } = screenProps;
    var mark = false;
    return {
      title: IOS
        ? t('questionPage:header.title', {
            current: getParam('displaynum', 1),
            total: getParam('qnums', 10)
          })
        : null,
      headerTitleStyle: { textAlign: 'center', alignSelf: 'center' },
      headerStyle: [
        {
          backgroundColor: Colors.orange
        },
        Platform.OS === 'android' ? { marginTop: -24, height: 35 } : null
      ],
      //header: <ImageHeader/>,
      headerLeft: (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                t('questionPage:header.left.title'),
                t('questionPage:header.left.message'),
                [
                  {
                    text: t('questionPage:header.left.yes'),
                    onPress: () => {
                      clearInterval(this.interval);

                      navigation.goBack();
                    }
                  },
                  {
                    text: t('questionPage:header.left.no'),
                    onPress: () => {},
                    style: 'cancel'
                  }
                ]
              );
            }}
          >
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
                ...ifIphoneX({ marginLeft: 15 }, null),
                marginRight: 10
              }}
            >
              {'   '}
              {t('questionPage:header.left.leave')}
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
              style={IOS ? { marginTop: 3 } : null}
            />
          ) : (
            <MCIcon
              name={'bookmark-outline'}
              onPress={() => {
                params.onClickMark(params.mark);
              }}
              color={'#000'}
              size={24}
              style={IOS ? { marginTop: 3 } : null}
            />
          )}
          {IOS ? null : (
            <Text
              style={{
                color: 'black',
                fontWeight: 'bold',
                fontSize: 18,
                marginLeft: 10
                //...ifIphoneX({ marginLeft: 15 }, null)
              }}
            >
              {t('questionPage:header.title', {
                current: getParam('displaynum', 1),
                total: getParam('qnums', 10)
              })}
            </Text>
          )}
        </View>
      ),
      headerRight: (
        <View style={styles.topright}>
          <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18 }}>
            {t('questionPage:header.right.difficulty')}
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
      this.mark = false;
    } else {
      //mark question
      this.props.navigation.setParams({ mark: true });
      this.mark = true;
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
    const { params } = this.props.navigation.state;
    LayoutAnimation.easeInEaseOut();
    if (this.mark) {
      this.marked.push({
        difficulty: this.difficulty,
        index: this.index,
        userAnswer: this.chosenOption
      });
    }
    if (this.num < params.qnums) {
      if (params.timer) this.animateCountdown();
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
                countdown: 1
              });
              this.mark = false;
              //LayoutAnimation.easeInEaseOut();
            });
        });
    } else {
      //go to scoring page
      var { navigate } = this.props.navigation;
      clearInterval(this.interval);
      navigate('Third', { score: this.score, marked: this.marked });
    }
  }

  showoptions() {
    var options = [];
    const { params } = this.props.navigation.state;
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
              _onPress={nowOption => {
                this.setState({ shownext: true });
                clearInterval(this.interval);
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
                this.chosenOption = nowOption;
                if (params.volume) this.renderSound(lastCorrectCount);
              }}
            />
          )}
        </View>
      );
    }
    return options;
  }

  renderSound = lastCorrectCount => {
    //wrong
    if (this.correctCount == 0) {
      if (lastCorrectCount >= 3) {
        this.sound(soundsWrong[3]);
      } else {
        var i = Math.floor(Math.random() * 3);
        this.sound(soundsWrong[i]);
      }
    }
    //correct
    else if (this.correctCount == 1) {
      if (this.num == 1) this.sound(soundsCorrect[0].firstBlood);
      else this.sound(soundsCorrect[0].notFirst);
    } else {
      if (this.correctCount > 11) this.correctCount = 11;
      this.sound(soundsCorrect[this.correctCount - 1]);
    }
  };

  sound = (position, shutDown) => {
    const soundObject = new Expo.Audio.Sound();
    soundObject.loadAsync(position).then(() => {
      soundObject.playAsync();
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

  animateCountdown() {
    let progress = 1;
    let { params } = this.props.navigation.state;
    this.setState({
      barColor: Colors.lightOrange
    });
    //setTimeout(() => {
    this.interval = setInterval(() => {
      progress -= 0.1 / (timeLimits[params.timerIndex][this.difficulty] * 60);
      if (progress < 0.2) {
        this.setState({
          barColor: 'red'
        });
      }
      if (progress < 0) {
        progress = 0;
        this.setState({
          timeUp: true
        });
        this.doTimeUp();
        clearInterval(this.interval);
      }
      this.setState({ countdown: progress });
    }, 100);
    //}, 500);
  }
  doTimeUp = () => {
    var lastCorrectCount = this.correctCount;
    this.correctCount = 0;
    const { params } = this.props.navigation.state;
    this.chosenOption = '無';
    if (params.volume) this.renderSound(lastCorrectCount);
  };

  render() {
    const { params } = this.props.navigation.state;
    const { t } = this.props;
    return (
      <View style={styles.bg}>
        <StatusBar hidden translucent />
        {/* {this.state.timeUp ? this.doTimeUp() : null} */}
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
            <View style={{ flex: 2, justifyContent: 'center' }}>
              {params.timer ? (
                <ProgressBar
                  width={Platform.OS === 'ios' ? width - 25 : width - 80}
                  progress={this.state.countdown}
                  borderRadius={0}
                  borderColor={Colors.lightOrange}
                  borderWidth={0}
                  color={
                    this.state.displayBar ? this.state.barColor : 'transparent'
                  }
                />
              ) : null}

              {/* display question */}
              <ScrollView>
                {this.state.data ? (
                  <View style={{ marginBottom: 20 }}>
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
                  size={Platform.OS === 'ios' ? 85 : 80}
                  color={this.state.shownext ? Colors.white : Colors.orange}
                  onPress={() => {
                    //console.warn(this.state.shownext);
                    if (this.state.shownext) {
                      this.next();
                      this.setState({
                        renew: true
                      });
                      LayoutAnimation.easeInEaseOut();
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
            {params.timer ? (
              <View style={{ position: 'absolute', top: 0, right: 2 }}>
                {this.state.displayBar ? (
                  <EIcon
                    name="squared-cross"
                    size={25}
                    onPress={() => {
                      this.setState({ displayBar: false });
                    }}
                    style={{ marginTop: -2 }}
                  />
                ) : (
                  <FAIcon
                    name="check-square"
                    size={25}
                    onPress={() => {
                      this.setState({ displayBar: true });
                    }}
                    style={{ marginTop: -2 }}
                  />
                )}
              </View>
            ) : null}
            <Modal
              isVisible={this.state.timeUp}
              supportedOrientations={['portrait', 'landscape']}
            >
              <View
                style={[
                  localStyles.modal,
                  IOS ? { marginVertical: '10%' } : { marginVertical: '5%' }
                ]}
              >
                <View>
                  <Text style={[localStyles.modalText, { fontSize: 28 }]}>
                    {t('timeUp.title')}
                  </Text>
                  <Text style={[localStyles.modalText, { fontSize: 20 }]}>
                    {t('timeUp.message')}
                  </Text>
                </View>
                <View
                  style={[
                    localStyles.modalButtonContainer,
                    IOS ? { bottom: 25 } : { bottom: 10 }
                  ]}
                >
                  <TouchableOpacity
                    style={localStyles.modalButton}
                    onPress={() => {
                      this.mark = false;
                      this.setState({
                        timeUp: false,
                        renew: true,
                        showModal: false
                      });
                      this.next();
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {t('timeUp.no')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={localStyles.modalButton}
                    onPress={() => {
                      this.mark = true;
                      this.setState({
                        timeUp: false,
                        renew: true,
                        showModal: false
                      });
                      this.next();
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {t('timeUp.yes')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </Drawer>
        )}
      </View>
    );
  }
}
export default translate(['questionPage', 'common'], { wait: true })(
  QuestionPage
);

const localStyles = StyleSheet.create({
  modal: {
    flex: 1,
    marginHorizontal: '20%',
    backgroundColor: '#FFFFE0',
    borderRadius: 10,
    borderColor: '#FFE4B5',
    borderWidth: 5,
    alignItems: 'center'
  },
  modalText: {
    marginTop: 25,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalButton: {
    //position: 'absolute',
    //bottom: 25,
    backgroundColor: Colors.orange,
    padding: 10,
    textAlign: 'center',
    //shadowRadius: 10,
    //shadowOpacity: 0.5,
    borderRadius: 10,
    marginHorizontal: 12,
    borderWidth: 1.5
  },
  modalButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
