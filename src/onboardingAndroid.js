import React, { Component } from 'React';
import {
  LayoutAnimation,
  View,
  UIManager,
  StatusBar,
  StyleSheet,
  Text,
  Animated,
  Dimensions
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import EIcon from 'react-native-vector-icons/Entypo';
import { Button } from 'react-native-elements';
import IIcon from 'react-native-vector-icons/Ionicons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';

const backgroundColors = [
  '#9DD6EB',
  '#FFCC99',
  '#CCCCFF',
  '#FFCCCC',
  '#E5CCFF',
  '#99CCFF',
  '#FF9999',
  '#FFCCE5'
];
const { width, height } = Dimensions.get('screen');

export default class OnboardingPageAndroid extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      doneButtonAnim: new Animated.Value(0),
      previousPage: null,
      backgroundColorAnim: new Animated.Value(0)
    };
  }

  componentDidUpdate() {
    Animated.timing(this.state.backgroundColorAnim, {
      toValue: 1,
      duration: 1500
    }).start();
    if (this.state.currentPage === backgroundColors.length - 1) {
      Animated.timing(this.state.doneButtonAnim, {
        toValue: 1,
        duration: 2500
      }).start();
    }
  }

  animateColor = index => {
    this.setState(prev => {
      return {
        previousPage: prev.currentPage,
        currentPage: index,
        backgroundColorAnim: new Animated.Value(0)
      };
    });
  };

  render() {
    const { navigate } = this.props.navigation;

    const currentBackgroundColor = backgroundColors[this.state.currentPage];
    let backgroundColor = currentBackgroundColor;
    if (this.state.previousPage !== null) {
      const previousBackgroundColor = backgroundColors[this.state.previousPage];
      backgroundColor = this.state.backgroundColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [previousBackgroundColor, currentBackgroundColor]
      });
    }

    return (
      <View style={{ flex: 1 }}>
        <Swiper
          style={styles.wrapper}
          loop={false}
          activeDotColor="#000"
          onIndexChanged={this.animateColor}
          dotStyle={{ width: 5, height: 5 }}
          activeDotStyle={{ width: 6, height: 6 }}
          showsButtons
          nextButton={<Text style={styles.buttonText}>›</Text>}
          prevButton={<Text />}
        >
          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <IIcon name={'md-bulb'} size={135} style={{ marginTop: -50 }} />
            <Text style={styles.titleText}>歡迎</Text>
            <Text style={styles.subtitleText}>
              這裡有五花八門的數學題供這裡有五花八門的數學題供你小試身手
            </Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'map'}
              size={120}
              style={{ marginTop: -30, marginBottom: 10 }}
            />
            <Text style={styles.titleText}>五種模式</Text>
            <Text style={styles.subtitleText}>
              適性、隨機、簡單、中等、困難
            </Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'note'}
              size={120}
              style={{ marginTop: -30, marginBottom: 10, marginLeft: 20 }}
            />
            <Text style={styles.titleText}>計算紙</Text>
            <Text style={styles.subtitleText}>隨時隨地都能算</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <MCIcon name={'timer-sand'} size={130} style={{ marginTop: -50 }} />
            <Text style={styles.titleText}>時限</Text>
            <Text style={styles.subtitleText}>讓答題更具挑戰性</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <MCIcon
              name={'checkbox-multiple-marked-outline'}
              size={130}
              style={{ marginTop: -50 }}
            />
            <Text style={styles.titleText}>複習</Text>
            <Text style={styles.subtitleText}>標記難題，加強印象</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon name={'earphones'} size={130} style={{ marginTop: -50 }} />
            <Text style={styles.titleText}>音效</Text>
            <Text style={styles.subtitleText}>開啟聲音，讓答題更有趣</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'refresh'}
              size={120}
              style={{ marginTop: -50, marginBottom: 10 }}
            />

            <Text style={styles.titleText}>隨時更新</Text>
            <Text style={styles.subtitleText}>最新題型，一應俱全</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <EIcon
              name={'aircraft-take-off'}
              size={130}
              style={{ marginTop: -50 }}
            />
            <Text style={styles.titleText}>數學起飛</Text>
            <Text style={styles.subtitleText}>會考成為囊中物！</Text>
          </Animated.View>
        </Swiper>

        <Animated.View
          style={[styles.doneButton, { opacity: this.state.doneButtonAnim }]}
        >
          <FIcon
            name="check-circle"
            size={30}
            onPress={() => {
              navigate('AccountPageAndroid');
            }}
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slides: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginTop: 20
  },
  subtitleText: {
    color: '#000',
    fontSize: 16,
    //fontWeight: 'bold',
    fontFamily: 'serif',
    marginTop: 10
  },
  buttonText: {
    fontSize: 50,
    color: '#000'
  },
  doneButton: {
    position: 'absolute',
    right: 20,
    bottom: 20
  }
});
