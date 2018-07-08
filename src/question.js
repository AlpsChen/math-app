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
  TouchableHighlight
  //Slider
} from 'react-native';
import * as firebase from 'firebase';
import ChoiceButton from './components/choicebutton';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Foundation';
import EIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
//import Orientation from 'react-native-orientation';
import SketchDraw from 'react-native-sketch-draw';
import Drawer from 'react-native-drawer';
import MathJax from 'react-native-mathjax';
import RNDraw from 'rn-draw';
import Slider from 'react-native-slider';

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
const bgcolor = '#FFE4B5';
const { height, width } = Dimensions.get('screen');

// const ImageHeader = props => {
//   return (
//     <View
//     //style={{height: 10*vh, justifyContent: 'flex-end', padding: 5}}
//     >
//       <Image
//         style={{ width: '100%', height: 50 }}
//         source={require('../components/bgImage.jpg')}
//         resizeMode="cover"
//       />
//     </View>
//   );
// };

export default class QuestionPage extends Component {
  constructor(props) {
    super(props);
    this.num = 0; // the nth question
    this.score = 0; // correct number of questions
    this.difficulty = 'easy'; // current difficulty
    this.index = 0; // index of current question in Firebase
    this.marked = []; // records the marked questions
    this._undo;
    this._clear;
    this.state = {
      data: '', // data of current question
      total: 0, // total question of current difficulty
      shownext: false, // true to show the "next" button
      renew: false, // true to refresh the question display and buttons
      correct: false, // true if answered correctly
      penColor: '#87CEFA', // pen color (default is light blue)
      showModal: false, // true to show modal (計算紙)
      thickness: 5,
      mark: false // true if current question is marked
    };
    //Orientation.lockToLandscape();
    chosenEasy.fill(false);
    chosenMedium.fill(false);
    chosenHard.fill(false);
  }

  componentWillMount() {
    //Orientation.lockToLandscape();
    this.init();
    this.next();
  }

  static navigationOptions = ({ navigation }) => {
    const { getParam } = navigation;
    var mark = false;
    return {
      title: '題目：' + getParam('displaynum', 1) + '/' + getParam('qnums', 10),
      headerStyle: {
        backgroundColor: bgcolor
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

  //initialize
  init = () => {};

  //mark the question
  onClickMark = now => {
    if (now) {
      //unmark question
      this.props.navigation.setParams({ mark: false });
      this.marked.pop();
    } else {
      //mark question
      this.props.navigation.setParams({ mark: true });
      this.marked.push({ difficulty: this.difficulty, index: this.index });
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
          }).bind(this);
        });
      console.log(this.total);
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
        .then(
          function(snap) {
            this.setState({
              data: snap.val(),
              shownext: false,
              renew: false,
              correct: false,
              onClickMark: this.onClickMark.bind(this)
            });
          }.bind(this)
        );
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
                //console.warn(this.state.shownext);
                if (!correctoption) {
                  //the option is correct when correctoption = 0
                  this.setState({ correct: true });
                  this.score += 1 / this.props.navigation.state.params.qnums;
                  //console.warn(this.state.correct);
                }
              }}
            />
          )}
        </View>
      );
    }
    return options;
  }

  // renderIf(condition, content){
  //   return condition? content:null;
  // }

  // _onLayout() {
  //   if (this.state.src) {
  //     Image.getSize(this.state.src, (w, h) => {
  //       this.setState({
  //         imageHeight: Dimensions.get("window").width * h / w
  //       });
  //     });
  //   }
  // }

  drawerContent = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row'
        }}
      >
        <RNDraw
          containerStyle={styles.sketch}
          rewind={undo => {
            this._undo = undo;
          }}
          clear={clear => {
            this._clear = clear;
          }}
          color={this.state.penColor}
          strokeWidth={this.state.thickness}
          onChangeStrokes={strokes => console.log(strokes)}
        />
        <View
          style={{
            flex: 0.5,
            flexDirection: 'column',
            backgroundColor: '#FFE4B5'
            //alignItems: 'center'
          }}
        >
          <View
            style={{
              flex: 6,
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            {/* <EIcon
            name={'pencil'}
            size={35}
            color={this.state.tool === 'pen' ? '#808080' : '#000'}
            onPress={() => {
              this.setState({
                tool: 'pen'
              });
            }}
            
          /> */}

            <FAIcon
              name={'undo'}
              size={30}
              color={'#000'}
              onPress={this._undo}
              style={{ marginTop: 10 }}
            />
            <MCIcon
              name={'delete'}
              size={35}
              color={'#000'}
              onPress={this._clear}
              style={{ marginTop: 5 }}
            />

            {/* </View> */}
            {/* <View style={{ flex: 0.5, flexDirection: "column", backgroundColor: "#FFE4B5" }}> */}
            {this.renderColorButton('#008000')}
            {this.renderColorButton('#FF6347')}
            {this.renderColorButton('#87CEFA')}
          </View>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Slider
              value={this.state.thickness}
              onValueChange={value => this.setState({ thickness: value })}
              orientation="vertical"
              step={1}
              minimumValue={2}
              maximumValue={8}
              thumbStyle={{ size: 10 }}
              style={{
                transform: [{ rotateZ: '90deg' }]
                //flex: 3
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  renderColorButton = color => {
    const active = color === this.state.penColor;

    return (
      <TouchableOpacity
        onPress={() => this.setState({ penColor: color })}
        style={[
          styles.colorButton,
          {
            backgroundColor: active ? '#FABBA9' : color,
            borderColor: color
          }
        ]}
      />
    );
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
            <MathJax
              style={{ marginHorizontal: 20 }}
              html={'$(A)' + this.state.data.A + '$'}
              customStyle={`
                * {
                  font-family: 'Times New Roman';
                  font-size: 24;
                  }
              `}
              enableBaseUrl={false}
              //enableAnimation={false}
            />
            <MathJax
              style={{ marginHorizontal: 20 }}
              html={'$(B)' + this.state.data.B + '$'}
              customStyle={`
                * {
                  font-family: 'Times New Roman';
                  font-size: 24;
                  }
              `}
              enableBaseUrl={false}
              //enableAnimation={false}
            />
            <MathJax
              style={{ marginHorizontal: 20 }}
              html={'$(C)' + this.state.data.C + '$'}
              customStyle={`
                * {
                  font-family: 'Times New Roman';
                  font-size: 24;
                  }
              `}
              enableBaseUrl={false}
              //enableAnimation={false}
            />
            <MathJax
              style={{ marginHorizontal: 20 }}
              html={'$(D)' + this.state.data.D + '$'}
              customStyle={`
                * {
                  font-family: 'Times New Roman';
                  font-size: 24;
                  }
              `}
              enableBaseUrl={false}
              //enableAnimation={false}
            />
          </View>
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.bg}>
        {this.state.renew ? (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 2 }} />
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
            content={this.drawerContent()}
          >
            <View style={{ flex: 2, justifyContent: 'center' }}>
              {/* display question */}
              <ScrollView>
                {this.state.data ? (
                  <View>
                    <MathJax
                      style={{ marginHorizontal: 20, marginTop: 5, flex: 1 }}
                      html={'$' + this.state.data.content + '$'}
                      customStyle={`
                * {
                  font-family: 'Times New Roman';
                  font-size: 20;
                  }
              `}
                      enableBaseUrl={false}
                      enableAnimation={false}
                      scalesPageToFit={Platform.OS === 'android' ? true : false}
                    />
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
                  color={this.state.shownext ? '#FFFFFF' : bgcolor}
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
                {/* <Text>{this.state.ans}</Text> */}
              </View>
              <TouchableOpacity
                underlayColor={'#CCC'}
                style={{ alignItems: 'center', paddingVertical: 10 }}
                onPress={() => {
                  this.setState({
                    showModal: true
                  });
                }}
              >
                <Text
                  style={{ color: '#888', fontWeight: '600', fontSize: 20 }}
                >
                  計算紙
                </Text>
              </TouchableOpacity>
            </View>
          </Drawer>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    //justifyContent: 'space-around',
    backgroundColor: '#FFF'
  },
  image: {
    width: '100%'
    //height: height,
    //resizeMode: "contain"
  },
  buttons: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: bgcolor
  },
  nextbutton: {
    //padding: 10,
    //borderRadius: 28
  },
  topright: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  drawer: {
    backgroundColor: '#11111155',
    //borderRadius: 5,
    borderColor: bgcolor
    //shadowRadius: 3
  },
  sketch: {
    flex: 5,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  colorButton: {
    borderRadius: 50,
    borderWidth: 8,
    width: 25,
    height: 25,
    marginVertical: 5
  }
});
