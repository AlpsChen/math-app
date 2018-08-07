import React, { Component } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  View,
  Button,
  Vibration,
  StyleSheet,
  Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';

export default class ChoiceButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: false
    };
  }
  pressed() {
    //this.props._onPress(!this.state.chosen);
    this.setState({
      chosen: true
    });
    if (this.props.shouldshake) {
      this.refs.View.shake(800);
      Vibration.vibrate(500);
    }
  }
  showcorrect(a, b) {
    if (
      this.state.chosen ||
      (this.props.close && !this.props.onColor.localeCompare('green'))
    ) {
      return a;
    }
    return b;
  }
  render() {
    return (
      <View>
        <TouchableWithoutFeedback
          disabled={this.props.close}
          onPress={() => {
            this.pressed();
            this.props._onPress(this.props.text);
          }}
        >
          <Animatable.View
            ref="View"
            style={[
              {
                backgroundColor: this.showcorrect(this.props.onColor, '#C0C0C0')
              },
              Platform.OS === 'ios' ? { padding: 16 } : { padding: 12 },
              Platform.OS === 'ios'
                ? { borderRadius: 28 }
                : { borderRadius: 20 }
            ]}
          >
            <Text
              style={{
                color: this.showcorrect('#FFFFFF', '#696969'),
                fontWeight: 'bold',
                fontSize: 32
              }}
            >
              {' '}
              {this.props.text}{' '}
            </Text>
          </Animatable.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
