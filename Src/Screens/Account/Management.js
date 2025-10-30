import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {navigate} from '../../../Navigation/RootNavigation';
import DIcon from '../../../DesiginData/DIcons';
import {FONT_SIZES, WIDTH_SIZES} from '../../../DesiginData/Utility';

const Management = () => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.cardWrapper} onPress={() => navigate('deleteaccount')}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Permanently Remove Account</Text>
          <DIcon provider="Entypo" name="chevron-right" size={responsiveWidth(4.5)} color="#1e1e1e" />
        </View>

        <Text style={styles.description}>
          Erase your presence with <Text style={{color: '#1e1e1e'}}>“Permanently Remove Account”.</Text> A one way journey to a clean state.
        </Text>
      </Pressable>
    </View>
  );
};

export default Management;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: responsiveWidth(10),
    paddingHorizontal: responsiveWidth(5),
    alignItems: 'center',
  },
  cardWrapper: {
    borderWidth: WIDTH_SIZES['1.5'],
    borderColor: '#1e1e1e',
    borderStyle: 'dashed',
    borderRadius: WIDTH_SIZES['14'],
    backgroundColor: '#FFF9F5',
    padding: responsiveWidth(4),
    width: responsiveWidth(85),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveWidth(2.5),
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: FONT_SIZES['16'],
    color: '#1e1e1e',
    width: '85%',
  },
  description: {
    fontFamily: 'Rubik-Regular',
    fontSize: FONT_SIZES['12'],
    color: '#1e1e1e',
    lineHeight: responsiveFontSize(2.3),
    width: '85%',
    textAlign: 'left',
  },
});
