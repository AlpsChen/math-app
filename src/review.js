import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as firebase from 'firebase';
import Drawer from 'react-native-drawer';
import DrawerContent from './components/drawerContent';
import IIcon from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/Entypo';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-elements';
import { Colors } from './common/constants/colors';

renderOptions = props => {
  var data = JSON.parse(props.JSON);
  if (data.A) {
    if (data.A.length + data.B.length + data.C.length + data.D.length < 20) {
      return (
        <Text style={{ fontSize: 24, marginHorizontal: 20, marginTop: 20 }}>
          (A) {'  '}
          {data.A}
          {'    '} (B) {'  '}
          {data.B}
          {'    '} (C) {'  '}
          {data.C}
          {'    '} (D) {'  '}
          {data.D}
        </Text>
      );
    } else {
      return (
        <View>
          <Text style={{ fontSize: 24, marginHorizontal: 20, marginTop: 20 }}>
            (A) {data.A}
          </Text>
          <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
            (B) {data.B}
          </Text>
          <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
            (C) {data.C}
          </Text>
          <Text style={{ fontSize: 24, marginHorizontal: 20 }}>
            (D) {data.D}
          </Text>
        </View>
      );
    }
  }
};

const Slide = props => {
  return (
    <View style={styles.slide}>
      <Drawer
        type="overlay"
        open={props.showModal}
        openDrawerOffset={0.2}
        //closedDrawerOffset={-3}
        styles={styles.drawer}
        //tweenHandler={Drawer.tweenPresets.parallax}
        side={'bottom'}
        ref={ref => (this._drawer = ref)}
        onCloseStart={props.close}
        content={<DrawerContent color={['#008000', '#FF6347', '#87CEFA']} />}
      >
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            <Text style={styles.text}>
              {JSON.parse(props.data.JSON).content}
              {'\n'}
              {renderOptions(props.data)}
            </Text>
          </ScrollView>
        </View>
        <View style={styles.bottomBarContainer}>
          <Button
            icon={<EIcon name="pencil" size={25} />}
            title={props.displayUserAnswer ? '隱藏答案' : '你的答案'}
            buttonStyle={[styles.buttons, { marginLeft: 20 }]}
            titleStyle={{ color: Colors.black }}
            onPress={props.onPressUA}
          />
          <Button
            icon={<FAIcon name="question" size={30} />}
            title={props.displayCorrectAnswer ? '隱藏答案' : '正確答案'}
            buttonStyle={styles.buttons}
            titleStyle={{ color: Colors.black }}
            onPress={props.onPressCA}
          />
          <View style={styles.iconsContainer}>
            <Button
              icon={<EIcon name="pencil" size={25} />}
              title={props.data.userAnswer}
              disabledStyle={styles.buttons}
              disabledTitleStyle={[
                styles.disabledTitleStyle,
                {
                  color: props.displayUserAnswer ? Colors.black : 'transparent'
                }
              ]}
              disabled
            />
            <Button
              icon={<FAIcon name="question" size={30} />}
              title={JSON.parse(props.data.JSON).answer}
              disabledStyle={styles.buttons}
              disabledTitleStyle={[
                styles.disabledTitleStyle,
                {
                  color: props.displayCorrectAnswer
                    ? Colors.black
                    : 'transparent'
                }
              ]}
              disabled
            />
            <IIcon
              style={[styles.paperIcon, { marginTop: 2 }]}
              name="ios-paper-outline"
              size={50}
              onPress={props.open}
            />
            <MIcon
              style={styles.runIcon}
              name="directions-run"
              size={30}
              onPress={() => {
                props.navigation.goBack();
              }}
            />
          </View>
        </View>
      </Drawer>
    </View>
  );
};

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      showModal: false,
      displayCorrectAnswer: false,
      displayUserAnswer: false
    };
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  setShowModal = open => {
    // this.setState(prevState => ({
    //   showModal: !prevState.showModal
    // }));
    if (open) this.setState({ showModal: true });
    else this.setState({ showModal: false });
  };

  onPressButton = userAnswer => {
    if (userAnswer)
      this.setState(pre => ({
        displayUserAnswer: !pre.displayUserAnswer
      }));
    else
      this.setState(pre => ({
        displayCorrectAnswer: !pre.displayCorrectAnswer
      }));
  };

  onIndexChanged = () => {
    this.setState({
      showModal: false,
      displayCorrectAnswer: false,
      displayUserAnswer: false
    });
  };

  render() {
    var { marked } = this.props.navigation.state.params;
    return (
      <View style={styles.slide}>
        {/* {qnums?  */}
        <Swiper
          style={styles.wrapper}
          loop={false}
          //renderPagination={this.renderPagination}
          showsButtons
          onIndexChanged={this.onIndexChanged}
          scrollEnabled={!this.state.showModal}
        >
          {marked.map((item, i) => (
            <Slide
              data={item}
              showModal={this.state.showModal}
              open={this.setShowModal.bind(this, true)}
              close={this.setShowModal.bind(this, false)}
              displayUserAnswer={this.state.displayUserAnswer}
              displayCorrectAnswer={this.state.displayCorrectAnswer}
              onPressUA={this.onPressButton.bind(this, true)}
              onPressCA={this.onPressButton.bind(this, false)}
              navigation={this.props.navigation}
            />
          ))}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    //justifyContent: 'center',
    backgroundColor: Colors.white
  },
  text: {
    fontSize: 24,
    marginHorizontal: 20,
    marginVertical: 10
  },
  image: {
    width: '100%',
    //height:"100%",
    resizeMode: 'cover',
    flex: 1
  },
  scrollViewContainer: {
    flex: 3,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderColor: Colors.darkOrange
  },
  bottomBarContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.darkOrange,
    alignItems: 'center'
    //justifyContent: 'center'
  },
  buttons: {
    paddingHorizontal: 5,
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: Colors.black
  },
  runIcon: {
    marginHorizontal: 20,
    borderWidth: 5,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 2
  },
  iconsContainer: {
    position: 'absolute',
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  disabledTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
