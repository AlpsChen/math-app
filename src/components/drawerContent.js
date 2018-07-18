import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import RNDraw from 'rn-draw';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Slider from 'react-native-slider';

export default class DrawerContent extends Component {
  state = {
    penColor: '#87CEFA', // pen color (default is light blue)
    thickness: 5
  };
  renderColorButton = color => {
    const active = color === this.state.penColor;

    return (
      <TouchableOpacity
        onPress={() => this.setState({ penColor: color })}
        style={[
          styles.colorButton,
          {
            backgroundColor: active ? '#FABBA9' : color,
            borderColor: color
          }
        ]}
      />
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row'
        }}
      >
        <RNDraw
          containerStyle={styles.sketch}
          rewind={undo => {
            this._undo = undo;
          }}
          clear={clear => {
            this._clear = clear;
          }}
          color={this.state.penColor}
          strokeWidth={this.state.thickness}
          //onChangeStrokes={strokes => console.log(strokes)}
        />
        <View
          style={{
            flex: 0.5,
            flexDirection: 'column',
            backgroundColor: '#FFE4B5'
            //alignItems: 'center'
          }}
        >
          <View
            style={{
              flex: 6,
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <FAIcon
              name={'undo'}
              size={30}
              color={'#000'}
              onPress={this._undo}
              style={{ marginTop: 10 }}
            />
            <MCIcon
              name={'delete'}
              size={35}
              color={'#000'}
              onPress={this._clear}
              style={{ marginTop: 5 }}
            />

            {/* </View> */}
            {/* <View style={{ flex: 0.5, flexDirection: "column", backgroundColor: "#FFE4B5" }}> */}
            {this.renderColorButton(this.props.color[0])}
            {this.renderColorButton(this.props.color[1])}
            {this.renderColorButton(this.props.color[2])}
          </View>
          <View style={{ flex: 3, justifyContent: 'center' }}>
            <Slider
              value={this.state.thickness}
              onValueChange={value => this.setState({ thickness: value })}
              orientation="vertical"
              step={1}
              minimumValue={2}
              maximumValue={8}
              thumbStyle={{ size: 10 }}
              style={{
                transform: [{ rotateZ: '90deg' }]
                //flex: 3
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sketch: {
    flex: 5,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  colorButton: {
    borderRadius: 50,
    borderWidth: 8,
    width: 25,
    height: 25,
    marginVertical: 5
  }
});
