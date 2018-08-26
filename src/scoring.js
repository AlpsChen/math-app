import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  Alert,
  LayoutAnimation,
  Animated,
  Platform
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Asset } from 'expo';
import * as firebase from 'firebase';
import { translate } from 'react-i18next';

const bgcolor = '#F5FCFF';
const bgImage = require('../assets/scoringImage.jpg');
var arr = [];
const IOS = Platform.OS === 'ios';

export class ScoringPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      finished: false,
      downloadFinished: false,
      buttonAnim: new Animated.Value(0)
    };
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  componentWillMount() {
    Expo.Asset.fromModule(bgImage).downloadAsync();
  }

  componentDidMount() {
    if (this.props.navigation.state.params.score == 0) {
      setTimeout(() => {
        this.setState({ finished: true });
      }, 1000);
    } else {
      this.animate();
    }
  }

  animate() {
    let progress = 0,
      speed = 3;
    setTimeout(() => {
      let { params } = this.props.navigation.state;
      setInterval(() => {
        progress += params.score / 3 / speed;
        speed += 1;
        if (progress > params.score) {
          progress = params.score;
          LayoutAnimation.easeInEaseOut();
          this.setState({
            finished: true
          });
        }
        this.setState({ score: progress });
      }, 100);
    }, 500);
  }

  addMarked() {
    let { marked } = this.props.navigation.state.params;
    let { navigate } = this.props.navigation;
    let { t } = this.props;
    if (marked.length == 0) {
      Alert.alert(t('alert.title'), '', [
        { text: t('alert.ok2'), onPress: () => {}, style: 'cancel' },
        { text: t('alert.ok'), onPress: () => {} }
      ]);
    } else {
      for (let i = 0; i < marked.length; i++) {
        let difficulty = marked[i].difficulty;
        let index = marked[i].index;
        firebase
          .database()
          .ref('/questionBank/' + difficulty + '/' + index)
          .once('value')
          .then(snap => {
            arr.push({
              JSON: JSON.stringify(snap.val()),
              userAnswer: marked[i].userAnswer
            });
            if (i == marked.length - 1) {
              this.setState({
                downloadFinished: true
              });
            }
          });
      }
    }
  }

  navigateToReview = () => {
    let { navigate } = this.props.navigation;
    navigate('ReviewPage', {
      marked: arr
    });
    this.setState({
      downloadFinished: false
    });
  };

  navigateToFirst = () => {
    let { navigate } = this.props.navigation;
    let { marked } = this.props.navigation.state.params;

    navigate('First');
  };

  animateButtons = () => {
    Animated.timing(this.state.buttonAnim, {
      toValue: 1,
      duration: 500
    }).start();
    this.setState({
      finished: false
    });
  };

  render() {
    let { navigate } = this.props.navigation;
    let { params } = this.props.navigation.state;
    let { t } = this.props;
    return (
      <View style={styles.bg}>
        {this.state.finished ? this.animateButtons() : null}
        {this.state.downloadFinished ? this.navigateToReview() : null}
        <ImageBackground
          source={bgImage}
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'cover' }}
        >
          <View style={styles.bg}>
            <View style={{ marginTop: 20 }}>
              <Progress.Circle
                size={200}
                progress={this.state.score}
                thickness={20}
                showsText={true}
                textStyle={{ fontWeight: '800' }}
                //borderWidth={2}
                //thickness={2}
                strokeCap={'round'}
                unfilledColor={'#808080'}
                color={'#FFE4B5'}
              />
            </View>
            {/* {IOS ? ( */}
            <Animated.View
              style={{ flexDirection: 'row', opacity: this.state.buttonAnim }}
            >
              <TouchableOpacity
                onPress={this.addMarked.bind(this)}
                style={[
                  styles.button,
                  {
                    backgroundColor: '#FFE4B5'
                  }
                ]}
              >
                <Text style={[styles.buttonText, { color: '#000000' }]}>
                  {t('buttons.viewMarked')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.navigateToFirst}
                style={[
                  styles.button,
                  {
                    backgroundColor: '#FFE4B5'
                  }
                ]}
              >
                <Text style={[styles.buttonText, { color: '#000000' }]}>
                  {t('buttons.goBack')}
                </Text>
              </TouchableOpacity>
            </Animated.View>
            {/* ) : null} */}
            {/* {!IOS ? (
              <View style={{ flexDirection: 'row', opacity: 1 }}>
                <TouchableOpacity
                  onPress={this.addMarked.bind(this)}
                  style={[
                    styles.button,
                    {
                      backgroundColor: this.state.finished
                        ? '#FFE4B5'
                        : 'transparent'
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      { color: this.state.finished ? '#000000' : 'transparent' }
                    ]}
                  >
                    查看難題
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.navigateToFirst}
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#FFE4B5'
                    }
                  ]}
                >
                  <Text style={[styles.buttonText, { color: '#000000' }]}>
                    回到首頁
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null} */}
          </View>
        </ImageBackground>
      </View>
    );
  }
}
export default translate(['scoringPage', 'common'], { wait: true })(
  ScoringPage
);

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
    //backgroundColor: bgcolor
  },
  bgImage: {
    flex: 1,
    width: '100%'
  },
  button: {
    paddingVertical: IOS ? 10 : 5,
    paddingHorizontal: 30,
    //marginTop: -20,
    borderRadius: 10,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    //width: 200,
    marginHorizontal: 20
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
