import React from 'react';
import {Text, View} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {styles} from '../../../styles';

const Logo = () => {
  return (
    <View style={styles.logoWrapper}>
      <Text style={styles.logoText1}>Daily </Text>
      <Shadow
        radius={4}
        offset={[0, 4]}
        startColor="rgba(0,0,0,0.25)"
        distance={2}>
        <View style={styles.logoTextBackground}>
          <Text style={styles.logoText2}>Routine</Text>
        </View>
      </Shadow>
    </View>
  );
};
export default Logo;
