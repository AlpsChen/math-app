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
import { translate } from 'react-i18next';

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

export class OnboardingPageAndroid extends Component {
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

  // componentDidMount() {
  //   Expo.Font.loadAsync({
  //     blackjack: require('../assets/fonts/blackjack.otf')
  //   });
  // }

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
    const { t } = this.props;

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
        <StatusBar hidden />
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
            <Text style={styles.titleText}>{t('welcome.title')}</Text>
            <Text style={styles.subtitleText}>{t('welcome.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'map'}
              size={120}
              style={{ marginTop: -30, marginBottom: 10 }}
            />
            <Text style={styles.titleText}>{t('mode.title')}</Text>
            <Text style={styles.subtitleText}>{t('mode.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'note'}
              size={120}
              style={{ marginTop: -30, marginBottom: 10, marginLeft: 20 }}
            />
            <Text style={styles.titleText}>{t('paper.title')}</Text>
            <Text style={styles.subtitleText}>{t('paper.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <MCIcon name={'timer-sand'} size={130} style={{ marginTop: -50 }} />
            <Text style={styles.titleText}>{t('limit.title')}</Text>
            <Text style={styles.subtitleText}>{t('limit.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <MCIcon
              name={'checkbox-multiple-marked-outline'}
              size={130}
              style={{ marginTop: -50 }}
            />
            <Text style={styles.titleText}>{t('review.title')}</Text>
            <Text style={styles.subtitleText}>{t('review.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon name={'earphones'} size={130} style={{ marginTop: -50 }} />
            <Text style={styles.titleText}>{t('sound.title')}</Text>
            <Text style={styles.subtitleText}>{t('sound.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <SLIcon
              name={'refresh'}
              size={120}
              style={{ marginTop: -50, marginBottom: 10 }}
            />

            <Text style={styles.titleText}>{t('update.title')}</Text>
            <Text style={styles.subtitleText}>{t('update.description')}</Text>
          </Animated.View>

          <Animated.View style={[styles.slides, { backgroundColor }]}>
            <EIcon
              name={'aircraft-take-off'}
              size={130}
              style={{ marginTop: -50 }}
            />
            <Text style={styles.titleText}>{t('success.title')}</Text>
            <Text style={styles.subtitleText}>{t('success.description')}</Text>
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

export default translate(['onboardingPage', 'common'], { wait: true })(
  OnboardingPageAndroid
);

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
    fontFamily: 'blackjack',
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
