import React, { Component } from 'React';
import { LayoutAnimation, View, UIManager, StatusBar } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import EIcon from 'react-native-vector-icons/Entypo';
import { Button } from 'react-native-elements';
import IIcon from 'react-native-vector-icons/Ionicons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { translate } from 'react-i18next';

const backgroundColor = isLight => (isLight ? 'blue' : 'lightblue');
const color = isLight => backgroundColor(!isLight);

const Next = ({ isLight, ...props }) => (
  <View>
    {/* {LayoutAnimation.easeInEaseOut()} */}
    <Button
      title={''}
      icon={<IIcon name={'ios-arrow-dropright'} size={40} />}
      buttonStyle={{
        backgroundColor: 'transparent',
        marginHorizontal: 20
      }}
      containerStyle={{
        //marginVertical: 10,
        //marginHorizontal: 10
        alignItems: 'center',
        justifyContent: 'center'
      }}
      textStyle={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
      {...props}
    />
  </View>
);

export class OnboardingPageiOS extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  render() {
    const { t, navigation } = this.props;
    const { navigate } = navigation;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <Onboarding
          showSkip={false}
          //DotComponent={Square}
          NextButtonComponent={Next}
          bottomBarHighlight={false}
          onDone={() => {
            LayoutAnimation.easeInEaseOut();
            navigate('AccountPageiOS');
          }}
          pages={[
            {
              backgroundColor: '#CCFFE5',
              image: (
                <IIcon
                  name={'md-bulb'}
                  size={210}
                  style={ifIphoneX({ marginBottom: -15 }, null)}
                />
              ),
              title: t('welcome.title'),
              subtitle: t('welcome.description')
            },
            {
              backgroundColor: '#FFCC99',
              image: (
                <SLIcon
                  name={'map'}
                  size={ifIphoneX(190, 210)}
                  style={ifIphoneX({ marginBottom: -5 }, null)}
                />
              ),
              title: t('mode.title'),
              subtitle: t('mode.description')
            },
            {
              backgroundColor: '#CCCCFF',
              image: (
                <SLIcon
                  name={'note'}
                  size={ifIphoneX(190, 210)}
                  style={[
                    ifIphoneX({ marginBottom: -5 }, null),
                    { marginLeft: 35 }
                  ]}
                />
              ),
              title: t('paper.title'),
              subtitle: t('paper.description')
            },
            {
              backgroundColor: '#FFCCCC',
              image: (
                <MCIcon
                  name={'timer-sand'}
                  size={210}
                  style={ifIphoneX({ marginBottom: -15 }, null)}
                />
              ),
              title: t('limit.title'),
              subtitle: t('limit.description')
            },
            {
              backgroundColor: '#E5CCFF',
              image: (
                <MCIcon
                  name={'checkbox-multiple-marked-outline'}
                  size={210}
                  style={ifIphoneX({ marginBottom: -15 }, null)}
                />
              ),
              title: t('review.title'),
              subtitle: t('review.description')
            },
            {
              backgroundColor: '#99CCFF',
              image: (
                <SLIcon
                  name={'earphones'}
                  size={ifIphoneX(200, 210)}
                  style={ifIphoneX({ marginBottom: -10 }, null)}
                />
              ),
              title: t('sound.title'),
              subtitle: t('sound.description')
            },
            {
              backgroundColor: '#FF9999',
              image: (
                <SLIcon
                  name={'refresh'}
                  size={ifIphoneX(190, 210)}
                  style={ifIphoneX({ marginBottom: -5 }, null)}
                />
              ),
              title: t('update.title'),
              subtitle: t('update.description')
            },
            {
              backgroundColor: '#FFCCE5',
              image: (
                <EIcon
                  name={'aircraft-take-off'}
                  size={210}
                  style={ifIphoneX({ marginBottom: -20 }, null)}
                />
              ),
              title: t('success.title'),
              subtitle: t('success.description')
            }
          ]}
        />
      </View>
    );
  }
}

export default translate(['onboardingPage', 'common'], { wait: true })(
  OnboardingPageiOS
);
