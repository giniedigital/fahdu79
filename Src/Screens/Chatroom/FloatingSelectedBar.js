import {View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Pressable} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WIDTH_SIZES} from '../../../DesiginData/Utility';
import {navigate} from '../../../Navigation/RootNavigation';

const {width} = Dimensions.get('window');

function FloatingSelectedBar() {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    navigate('massMessageMedia');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({pressed}) => [
        styles.container,
        {
          bottom: insets.bottom,
          width,
          backgroundColor: pressed ? '#292929' : '#1E1E1E', // change bg on press
        },
      ]}>
      <Text style={styles.text}>Users Selected</Text>
      <Image source={require('../../../Assets/Images/arrowRight.png')} style={styles.icon} resizeMode="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 72,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
  },
  icon: {
    width: WIDTH_SIZES[12],
    height: WIDTH_SIZES[12],
    tintColor: '#fff',
  },
});

export default FloatingSelectedBar;
