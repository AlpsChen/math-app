import React, { Component } from 'React';
import { LayoutAnimation, View, UIManager, StatusBar } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import EIcon from 'react-native-vector-icons/Entypo';
import { Button } from 'react-native-elements';
import IIcon from 'react-native-vector-icons/Ionicons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ifIphoneX } from 'react-native-iphone-x-helper';

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

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default class OnboardingPage extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  render() {
    const { navigate } = this.props.navigation;
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
            navigate('AccountPage');
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
              title: '歡迎',
              subtitle: '這裡有五花八門的數學題供你小試身手'
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
              title: '五種模式',
              subtitle: '適性、隨機、簡單、中等、困難'
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
              title: '計算紙',
              subtitle: '隨時隨地都能算'
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
              title: '時限',
              subtitle: '讓答題更具挑戰性'
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
              title: '複習',
              subtitle: '標記難題，加強印象'
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
              title: '音效',
              subtitle: '開啟聲音，讓答題更有趣'
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
              title: '隨時更新',
              subtitle: '最新題型，一應俱全'
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
              title: '數學起飛',
              subtitle: '會考成為囊中物！'
            }
          ]}
        />
      </View>
    );
  }
}
