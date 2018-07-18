import { StyleSheet } from 'react-native';
import { Colors } from './src/common/constants/colors';

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
    //justifyContent: 'space-around',
    backgroundColor: Colors.white
  },
  image: {
    width: '100%'
    //height: height,
    //resizeMode: "contain"
  },
  buttons: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.orange
  },
  nextbutton: {
    //padding: 10,
    //borderRadius: 28
  },
  topright: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  drawer: {
    borderColor: Colors.orange
  }
});
