import React from 'react';

import { AppLoading, Font } from 'expo';

import FontAwesome from '../../node_modules/react-native-vector-icons/Fonts/FontAwesome.ttf';
import MaterialIcons from '../../node_modules/react-native-vector-icons/Fonts/MaterialIcons.ttf';
import Ionicons from '../../node_modules/react-native-vector-icons/Fonts/Ionicons.ttf';
import SimpleLineIcons from '../../node_modules/react-native-vector-icons/Fonts/SimpleLineIcons.ttf';
import Entypo from '../../node_modules/react-native-vector-icons/Fonts/Entypo.ttf';

export default class PreloadIcons extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentWillMount() {
    try {
      await Font.loadAsync({
        FontAwesome,
        MaterialIcons,
        Ionicons,
        SimpleLineIcons,
        Entypo
      });

      this.setState({ fontLoaded: true });
    } catch (error) {
      console.log('error loading icon fonts', error);
    }
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }

    return this.props.children;
  }
}
