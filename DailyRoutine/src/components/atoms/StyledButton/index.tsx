import React from 'react';
import {Pressable, Text} from 'react-native';
import {Shadow} from 'react-native-shadow-2';
import {styles} from '../../../styles';
type Props = {
  title: string;
  onPressFunction?: () => void;
};
const StyledButton = ({title, onPressFunction = () => {}}: Props) => {
  return (
    <Shadow
      offset={[0, 4]}
      radius={15}
      startColor={'rgba(0,0,0,0.25)'}
      finalColor={'rgba(0,0,0,0.25)'}
      distance={2}
      containerViewStyle={styles.styledButtonShadow}
      viewStyle={styles.shadowStrech}>
      <Pressable onPress={() => onPressFunction()} style={styles.styledButton}>
        <Text style={styles.styledButtonText}>{title}</Text>
      </Pressable>
    </Shadow>
  );
};

export default StyledButton;
