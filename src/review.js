import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView
} from 'react-native';
import Swiper from 'react-native-swiper';
import * as firebase from 'firebase';
const { width } = Dimensions.get('window');

const Slide = props => {
  return (
    <View style={styles.slide}>
      <ScrollView>
        <Text style={styles.text}>{JSON.parse(props.data).content}</Text>
      </ScrollView>
    </View>
  );
};

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ''
      //arr: ['a', 'b']
    };
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  // componentDidMount() {
  //   let { params } = this.props.navigation.state;
  //   let qnums = params.marked.length;
  //   for (let i = 0; i < qnums; i++) {
  //     this.question(i);
  //   }
  // }

  renderPagination = (index, total, context) => {
    return (
      <View style={styles.paginationStyle}>
        <Text style={{ color: 'grey' }}>
          <Text style={styles.paginationText}>{index + 1}</Text>/{total}
        </Text>
      </View>
    );
  };

  question = i => {};

  renderMarked = () => {
    var tmp = [];
    for (let i = 0; i < this.state.arr.length; i++) {
      tmp.push();
    }
    //console.log(tmp);
    return tmp;
  };

  render() {
    var { marked } = this.props.navigation.state.params;
    return (
      <View style={styles.slide}>
        {/* {qnums?  */}
        <Swiper
          style={styles.wrapper}
          renderPagination={this.renderPagination}
          loop
        >
          {marked.map((item, i) => <Slide data={item} />)}
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  text: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    //height:"100%",
    resizeMode: 'cover',
    flex: 1
  },
  paginationStyle: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  paginationText: {
    color: '#000',
    fontSize: 20
  }
});
