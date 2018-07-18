import React, { Component } from 'React';
import { LayoutAnimation, View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import EIcon from 'react-native-vector-icons/Entypo';
import { Button } from 'react-native-elements';
import IIcon from 'react-native-vector-icons/Ionicons';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Square = ({ isLight, selected }) => {
  let backgroundColor;
  if (isLight) {
    backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
  } else {
    backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
  }
  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor: 'white'
      }}
    />
  );
};

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

export default class OnboardingPage extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
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
            backgroundColor: '#E5FFCC',
            image: (
              <IIcon
                name={'md-bulb'}
                size={240}
                style={{ marginBottom: -30 }}
              />
            ),
            title: '歡迎',
            subtitle: '這裡有五花八門的數學題供你小試身手'
          },
          {
            backgroundColor: '#FFCC99',
            image: <SLIcon name={'map'} size={210} />,
            title: '五種模式',
            subtitle: '適性、隨機、簡單、中等、困難'
          },
          {
            backgroundColor: '#FF9999',
            image: <SLIcon name={'refresh'} size={210} />,
            title: '隨時更新',
            subtitle: '最新題型，一應俱全'
          },
          {
            backgroundColor: '#E5CCFF',
            image: (
              <MCIcon
                name={'checkbox-multiple-marked-outline'}
                size={210}
                //style={{ marginBottom: 10 }}
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
                size={210}
                //style={{ marginBottom: 10 }}
              />
            ),
            title: '音效',
            subtitle: '開啟聲音，讓答題更有趣'
          },
          {
            backgroundColor: '#FFCCE5',
            image: (
              <EIcon
                name={'aircraft-take-off'}
                size={210}
                //style={{ marginTop: 20 }}
              />
            ),
            title: '數學起飛',
            subtitle: '會考成為囊中物！'
          }
        ]}
      />
    );
  }
}
