import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Picker,
  LayoutAnimation
} from 'react-native';
import Slider from 'react-native-slider';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import { Switch } from 'react-native-switch';
import { ButtonGroup } from 'react-native-elements';

import { Colors } from './common/constants/colors';

const modeDescriptions = [
  '題目難度將適性調整。當你答對簡單題，題目將會越來越難，但若你答錯，題目又會變回簡單',
  '題目難度將為隨機',
  '題目難度全為簡單',
  '題目難度全為中等',
  '題目難度全為困難'
];

const timeLimitDescriptions = [
  '簡單題時限5分鐘，中等題時限8分鐘，困難題時限10分鐘',
  '簡單題時限2分鐘，中等題時限5分鐘，困難題時限8分鐘',
  '簡單題時限1分鐘，中等題時限2分鐘，困難題時限5分鐘'
];

const SettingsItem = props => {
  const { image, label, labelColor, selected, icon, ...attributes } = props;
  return (
    <TouchableOpacity {...attributes}>
      <View
        style={[
          styles.settingsItemContainer,
          selected ? styles.settingsItemContainerSelected : null
        ]}
      >
        {/* <Text style={[styles.userTypeLabel, { color: labelColor }]}>
          {label}
        </Text> */}
        {icon}
      </View>
    </TouchableOpacity>
  );
};

export default class ModePage extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      mode: params.initialMode,
      qnums: params.initialQnums,
      volume: params.initialVolume,
      timer: params.initialTimer,
      selectedTimerIndex: params.initialTimerIndex,
      selectedType: 'selectMode'
    };
    this.setSelectedType = this.setSelectedType.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  setSelectedType = selectedType => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ selectedType });
    LayoutAnimation.easeInEaseOut();
  };

  renderContent = now => {
    const { params } = this.props.navigation.state;
    if (now == 'selectMode') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Picker
            selectedValue={this.state.mode}
            style={styles.picker}
            itemStyle={{ color: '#6495ED', fontWeight: 'bold' }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ mode: itemValue })
            }
          >
            <Picker.Item label="適性模式" value={0} />
            <Picker.Item label="隨機模式" value={1} />
            <Picker.Item label="簡單模式" value={2} />
            <Picker.Item label="中等模式" value={3} />
            <Picker.Item label="困難模式" value={4} />
          </Picker>
          <View style={styles.description}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {modeDescriptions[this.state.mode]}
            </Text>
          </View>
        </View>
      );
    } else if (now == 'selectQnums') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -20
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            題數：{this.state.qnums}
          </Text>
          <Slider
            value={this.state.qnums}
            onValueChange={value => this.setState({ qnums: value })}
            minimumValue={5}
            maximumValue={20}
            step={1}
            style={styles.slider}
            minimumTrackTintColor={'#6495ED'}
            thumbTintColor={'#6495ED'}
            //thumbTouchSize={{width: 20, height: 20}}
            thumbStyle={{ size: 5 }}
          />
        </View>
      );
    } else if (now == 'selectVolume') {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -20
          }}
        >
          {this.state.volume ? (
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              開啟音效，獲得更佳體驗
            </Text>
          ) : (
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              關閉音效，思考不受影響
            </Text>
          )}
          <View style={{ marginTop: 20 }}>
            <Switch
              value={this.state.volume}
              onValueChange={value => this.setState({ volume: value })}
              circleBorderWidth={3}
            />
          </View>
        </View>
      );
    } else if (now == 'selectTimer') {
      const buttons = ['入門', '正常', '挑戰'];
      return (
        <View
          style={{
            flex: 1,
            //flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              flex: 1
              //justifyContent: 'center'
            }}
          >
            <Switch
              value={this.state.timer}
              onValueChange={value => {
                this.setState({ timer: value });
                LayoutAnimation.easeInEaseOut();
              }}
              circleBorderWidth={3}
            />
          </View>
          <View
            style={{
              flex: 3
            }}
          >
            {this.state.timer ? (
              <View style={{ alignItems: 'center' }}>
                <ButtonGroup
                  onPress={selectedTimerIndex => {
                    this.setState({
                      selectedTimerIndex
                    });
                    LayoutAnimation.easeInEaseOut();
                  }}
                  selectedIndex={this.state.selectedTimerIndex}
                  buttons={buttons}
                  containerStyle={{
                    width: 500,
                    borderWidth: 2,
                    borderColor: Colors.black,
                    borderRadius: 10,
                    backgroundColor: Colors.darkOrange
                    //opacity: 0.5
                  }}
                  textStyle={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: Colors.black
                  }}
                  selectedButtonStyle={{
                    backgroundColor: Colors.lightOrange,
                    opcaity: 1
                  }}
                  //buttonStyle={{ borderWidth: 1, borderColor: Colors.black }}
                  //containerBorderRadius={20}
                />
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}
                >
                  {timeLimitDescriptions[this.state.selectedTimerIndex]}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      );
    }
  };

  render() {
    const { selectedType } = this.state;
    return (
      <View style={styles.bg}>
        <View style={styles.settingsTypesContainer}>
          <SettingsItem
            //label="COOL"
            //labelColor="#ECC841"
            icon={
              <SLIcon
                name={'map'}
                size={selectedType === 'selectMode' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectMode')}
            selected={selectedType === 'selectMode'}
          />
          <SettingsItem
            //label="STUDENT"
            //labelColor="#2CA75E"
            icon={
              <MCIcon
                name="numeric-0-box-multiple-outline"
                size={selectedType === 'selectQnums' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectQnums')}
            selected={selectedType === 'selectQnums'}
          />
          <SettingsItem
            //label="HARRY POTTER"
            //labelColor="#36717F"
            icon={
              <FIcon
                name="volume-2"
                size={selectedType === 'selectVolume' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectVolume')}
            selected={selectedType === 'selectVolume'}
          />
          <SettingsItem
            //label="STUDENT"
            //labelColor="#2CA75E"
            icon={
              <MCIcon
                name="timer"
                size={selectedType === 'selectTimer' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectTimer')}
            selected={selectedType === 'selectTimer'}
          />
          <SettingsItem
            //label="HARRY POTTER"
            //labelColor="#36717F"
            icon={
              <EIcon
                name="pencil"
                size={selectedType === 'selectColors' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectColors')}
            selected={selectedType === 'selectColors'}
          />
        </View>
        <View style={{ flex: 1.5 }}>{this.renderContent(selectedType)}</View>
        <View style={{ position: 'absolute', left: 3, bottom: -1 }}>
          <EIcon
            name="squared-cross"
            size={52}
            onPress={() => {
              this.props.navigation.navigate('First');
            }}
          />
        </View>
        <View style={{ position: 'absolute', right: 5, bottom: 5 }}>
          <FAIcon
            name="check-square"
            size={50}
            onPress={() => {
              this.props.navigation.navigate('First', {
                mode: this.state.mode,
                qnums: this.state.qnums,
                volume: this.state.volume,
                timer: this.state.timer,
                timerIndex: this.state.selectedTimerIndex
              });
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    //flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FAFAD2'
  },
  picker: {
    width: 150,
    //marginRight: 20,
    paddingRight: 20,
    borderRightWidth: 3
  },
  description: {
    width: 300,
    alignItems: 'center',
    marginLeft: 20
  },
  slider: {
    width: 200
  },
  button: {
    backgroundColor: '#FFE4B5',
    padding: 10,
    margin: 20,
    borderRadius: 10,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    width: 100
  },
  buttonText: {
    fontSize: 20,
    //margin: 15,
    color: '#000000',
    //padding: 20,
    textAlign: 'center'
  },
  settingsTypesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    marginTop: 20
    //borderBottomWidth: 3
  },
  settingsItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
  },
  settingsItemContainerSelected: {
    opacity: 1
  }
});
