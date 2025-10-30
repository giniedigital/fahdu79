import {StyleSheet, Text, View, Pressable, ToastAndroid} from 'react-native';
import React, {useCallback} from 'react';
import {responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {toggleWishListPreviewModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {setWishListMediaInfo} from '../../../Redux/Slices/NormalSlices/ProfileSlices/WishListUploadMediaInfo';
import {padios} from '../../../DesiginData/Utility';

const AddWishListButton = () => {
  const dispatch = useDispatch();

  const handleMediaSelect = useCallback(async () => {
    try {
      const mediaImageInfo = await launchImageLibrary({mediaType: 'photo', quality: 0.5});

      if (mediaImageInfo?.didCancel !== true) {
        if (mediaImageInfo?.assets[0]?.fileSize > 20000000) {
          ToastAndroid.show('Image Size must be lower than 20 MB', ToastAndroid.SHORT);

          return {didCancel: true};
        } else {
          if (mediaImageInfo?.didCancel !== true) {
            dispatch(setWishListMediaInfo({mediaImageInfo: {uri: mediaImageInfo?.assets[0].uri, name: mediaImageInfo?.assets[0].fileName, type: mediaImageInfo?.assets[0].type}}));
            dispatch(toggleWishListPreviewModal());
          } else {
            return {didCancel: true};
          }
        }
      } else {
        console.log('Media Selection Cancelled');
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <View style={{position: 'relative', alignSelf: 'center'}}>
      <Pressable
        onPress={() => handleMediaSelect()}
        style={({pressed}) => [
          styles.wishlistButton,
          pressed && {backgroundColor: '#FFEDE0'}, // change color when pressed
        ]}>
        <Text style={styles.wishlistButtonText}>
          <Text style={styles.plusIcon}>+</Text> Add Wishlist
        </Text>
      </Pressable>
    </View>
  );
};

export default AddWishListButton;

const styles = StyleSheet.create({
  wishlistButton: {
    borderWidth: 1,
    borderStyle: 'dashed', // Dashed border
    borderColor: '#000', // Black border
    borderRadius: 10, // Rounded corners
    paddingHorizontal: responsiveWidth(27),
    paddingVertical: responsiveWidth(2.5),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: responsiveWidth(8),
    marginBottom: responsiveWidth(4),
  },

  wishlistButtonText: {
    color: '#000', // Black text
    fontFamily: 'Rubik-Medium', // Your preferred font
    fontSize: responsiveFontSize(2.4),
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  plusIcon: {
    fontWeight: 'bold', // Bold "+" icon
    marginRight: responsiveWidth(1), // Space between "+" and text
  },

  wrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: responsiveWidth(10),
  },
});
