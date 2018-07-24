import React, { Component } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image
} from 'react-native';
import * as Progress from 'react-native-progress';
import { Asset } from 'expo';
import * as firebase from 'firebase';

const bgcolor = '#F5FCFF';
const bgImage = require('../assets/scoringImage.jpg');
var arr = [];

export default class ScoringPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      score: 0,
      finished: false,
      downloadFinished: false
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
      this.setState({ finished: true });
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
          this.setState({
            finished: true
          });
        }
        this.setState({ score: progress });
      }, 100);
    }, 1500);
  }

  addMarked() {
    let { marked } = this.props.navigation.state.params;
    let { navigate } = this.props.navigation;
    if (marked.length == 0) {
      alert('沒有難題哦！');
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

  render() {
    let { navigate } = this.props.navigation;
    let { params } = this.props.navigation.state;
    return (
      <View style={styles.bg}>
        {this.state.downloadFinished
          ? navigate('ReviewPage', {
              marked: arr
            })
          : null}
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
            <View style={{ flexDirection: 'row' }}>
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
                onPress={() => {
                  navigate('First');
                }}
                style={[
                  styles.button,
                  {
                    backgroundColor: this.state.finished
                      ? '#FFE4B5'
                      : 'transparant'
                  }
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    { color: this.state.finished ? '#000000' : 'transparent' }
                  ]}
                >
                  回到首頁
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
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
    padding: 10,
    marginTop: -30,
    borderRadius: 10,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    width: 120,
    marginHorizontal: 20
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
