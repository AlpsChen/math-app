import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Picker
} from "react-native";
import Slider from "react-native-slider";

const texts = [
    "題目難度將適性調整。當你答對簡單題，題目將會越來越難，但若你答錯，題目又會變回簡單",
    "題目難度將為隨機",
    "題目難度全為簡單",
    "題目難度全為中等",
    "題目難度全為困難",
];

export default class ModePage extends Component {
  state = {
      mode: this.props.navigation.state.params.initialMode,
      qnums: this.props.navigation.state.params.initialQnums,
      pickerTouched: false,
      sliderTouched: false,
  }
  static navigationOptions = {
    header: null
  };
  render(){
    const {params} = this.props.navigation.state;
    return(
    <View style={styles.bg}>
      <Picker
        selectedValue={this.state.pickerTouched? this.state.mode:params.initialMode}
        style={styles.picker}
        itemStyle={{color: "#6495ED"}}
        onValueChange={(itemValue, itemIndex) => this.setState({mode: itemValue, pickerTouched: true})}>
        <Picker.Item label="適性模式" value={0} />
        <Picker.Item label="隨機模式" value={1} />
        <Picker.Item label="簡單模式" value={2} />
        <Picker.Item label="中等模式" value={3} />
        <Picker.Item label="困難模式" value={4} />
      </Picker>
      <View style={styles.description}>
          <Text style={{fontSize: 20}}>題數：{this.state.qnums}</Text>
          <Text style={{fontSize: 20}}></Text>
          <Text style={{fontSize: 20}}>{texts[this.state.mode]}</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("First", {mode: this.state.mode, qnums: this.state.qnums})
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>確定</Text>
          </TouchableOpacity>
        </View>
      <Slider
          value={this.state.sliderTouched? this.state.qnums:params.initialQnums}
          onValueChange={value => this.setState({ qnums: value, sliderTouched: true })}
          minimumValue={5}
          maximumValue={20}
          step={1}
          style={styles.slider}
          minimumTrackTintColor={"#6495ED"}
          thumbTintColor={"#6495ED"}
          //thumbTouchSize={{width: 20, height: 20}}
          thumbStyle={{size: 5}}
        />
    </View>
    )
  }
}

const styles = StyleSheet.create({
    bg: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#FAFAD2",
    },
    picker: {
      //height: 100,
      //width: 100,
      flex: 1,
      
    },
    description: {
      flex: 1,
      alignItems: "center"
    },
    slider:{
      flex: 1,
      marginHorizontal: 20,
    },
    button: {
      backgroundColor: "#FFE4B5",
      padding: 10,
      margin: 20,
      borderRadius: 10,
      shadowRadius: 5,
      shadowOpacity: 0.5,
      width: 100,
    },
    buttonText: {
      fontSize: 20,
      //margin: 15,
      color: "#000000",
      //padding: 20,
      textAlign: "center"
    },
})