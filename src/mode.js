import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Picker,
  LayoutAnimation,
  Slider,
  Platform
} from 'react-native';
import SlideriOS from 'react-native-slider';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/Feather';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import EIcon from 'react-native-vector-icons/Entypo';
import { Switch } from 'react-native-switch';
import { ButtonGroup } from 'react-native-elements';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { translate } from 'react-i18next';

import { Colors } from './common/constants/colors';

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

export class ModePage extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      mode: params.initialMode,
      qnums: params.initialQnums,
      volume: params.initialVolume,
      timer: params.initialTimer,
      selectedTimerIndex: params.initialTimerIndex,
      selectedType: 'selectMode',
      language: this.props.i18n.language
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
    const { t, i18n } = this.props;
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
            itemStyle={{
              color: Colors.lightOrange,
              fontWeight: 'bold'
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ mode: itemValue })
            }
          >
            <Picker.Item label={t('common:modes.0')} value={0} />
            <Picker.Item label={t('common:modes.1')} value={1} />
            <Picker.Item label={t('common:modes.2')} value={2} />
            <Picker.Item label={t('common:modes.3')} value={3} />
            <Picker.Item label={t('common:modes.4')} value={4} />
          </Picker>
          <View style={styles.description}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {t(`modeDescriptions.${this.state.mode}`)}
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
          <Text style={{ fontSize: 20, fontWeight: '900' }}>
            {t('total') + this.state.qnums}
          </Text>
          {Platform.OS === 'ios' ? (
            <SlideriOS
              value={this.state.qnums}
              onValueChange={value => this.setState({ qnums: value })}
              minimumValue={5}
              maximumValue={20}
              step={1}
              style={styles.slider}
              minimumTrackTintColor={Colors.lightOrange}
              thumbTintColor={Colors.lightOrange}
              //thumbTouchSize={{width: 20, height: 20}}
              //thumbStyle={{ size: 5 }}
            />
          ) : (
            <Slider
              value={this.state.qnums}
              onValueChange={value => this.setState({ qnums: value })}
              minimumValue={5}
              maximumValue={20}
              step={1}
              style={[styles.slider, { marginTop: 10 }]}
              minimumTrackTintColor={Colors.lightOrange}
              thumbTintColor={Colors.lightOrange}
            />
          )}
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
              {t('sound.on')}
            </Text>
          ) : (
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {t('sound.off')}
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
      const buttons =
        i18n.language === 'zh'
          ? ['入門', '正常', '挑戰']
          : ['Beginner', 'Intermediate', 'Advanced'];
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
                  {t(`limitDescriptions.${this.state.selectedTimerIndex}`)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      );
    } else if (now == 'selectLanguage') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Picker
            selectedValue={this.state.language}
            style={styles.picker2}
            itemStyle={{
              color: Colors.lightOrange,
              fontWeight: 'bold'
            }}
            onValueChange={(itemValue, itemIndex) => {
              i18n.changeLanguage(itemValue);
              this.setState({ language: itemValue });
            }}
          >
            <Picker.Item label={'繁體中文'} value={'zh'} />
            <Picker.Item label={'English'} value={'en'} />
          </Picker>
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
            icon={
              <EIcon
                name="pencil"
                size={selectedType === 'selectColors' ? 70 : 50}
              />
            }
            onPress={() => this.setSelectedType('selectColors')}
            selected={selectedType === 'selectColors'}
          />
          <SettingsItem
            icon={
              <MCIcon
                name={'format-color-text'}
                size={selectedType === 'selectLanguage' ? 70 : 50}
                style={{ marginTop: 10 }}
              />
            }
            onPress={() => this.setSelectedType('selectLanguage')}
            selected={selectedType === 'selectLanguage'}
          />
        </View>
        <View style={{ flex: 1.5 }}>{this.renderContent(selectedType)}</View>
        <View
          style={{
            position: 'absolute',
            bottom: -1,
            ...ifIphoneX({ left: 23 }, { left: 3 })
          }}
        >
          <EIcon
            name="squared-cross"
            size={52}
            onPress={() => {
              this.props.navigation.navigate('First');
            }}
          />
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: 5,
            ...ifIphoneX({ right: 25 }, { right: 5 })
          }}
        >
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
export default translate(['settingsPage', 'common'], { wait: true })(ModePage);

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
  picker2: {
    width: 150,
    borderWidth: 2,
    borderRadius: 20
  },
  description: {
    width: 400,
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
