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

export default class ReviewPage extends Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.difficulty = '';
    //this.arr = [];
    this.state = {
      data: '',
      arr: [1]
    };
  }

  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  componentWillMount() {
    let { params } = this.props.navigation.state;
    let qnums = params.marked.length;
    for (let i = 0; i < qnums; i++) {
      this.question(i);
      //console.log(i);
    }
  }

  renderPagination = (index, total, context) => {
    return (
      <View style={styles.paginationStyle}>
        <Text style={{ color: 'grey' }}>
          <Text style={styles.paginationText}>{index + 1}</Text>/{total}
        </Text>
      </View>
    );
  };
  question = i => {
    let { params } = this.props.navigation.state;
    let difficulty = params.marked[i].difficulty;
    let index = params.marked[i].index;
    firebase
      .database()
      .ref('/questionBank/' + difficulty + '/' + index)
      .once('value')
      .then(snap => {
        this.setState({
          data: snap.val()
        });
      })
      .then(() => {
        this.setState(prevState => {
          arr: [prevState, this.state.data];
        });
        //this.state.arr.push(this.state.data)
        console.log('b');
      });
  };

  renderMarked = () => {
    var tmp = [];
    for (let i = 0; i < this.state.arr.length; i++) {
      tmp.push(
        <View style={styles.slide}>
          <ScrollView>
            <Text style={styles.text}>{this.state.arr[i].content}</Text>
          </ScrollView>
        </View>
      );
    }
    //console.log(tmp);
    return tmp;
  };

  render() {
    var { params } = this.props.navigation.state;
    return (
      <View style={styles.slide}>
        {/* {qnums?  */}
        <Swiper
          style={styles.wrapper}
          renderPagination={this.renderPagination.bind(this)}
          loop={false}
        >
          {/* {this.renderMarked()} */}
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
