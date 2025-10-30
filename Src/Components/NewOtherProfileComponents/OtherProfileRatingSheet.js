import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Linking, Alert, TouchableOpacity} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';
import Feather from 'react-native-vector-icons/Feather';
import AnimatedButton from '../../Components/AnimatedButton';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import {BlurView} from 'expo-blur';
import {Image} from 'expo-image';
import {toggleEmailVerificationModal, toggleOtherProfileActionSheet, toggleRatingModal} from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import {useDispatch, useSelector} from 'react-redux';
import {openInbox} from 'react-native-email-link';
import {FONT_SIZES, nTwins, WIDTH_SIZES} from '../../../DesiginData/Utility';
import Svg, {Path} from 'react-native-svg';
import {useRateUserMutation} from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {LoginPageErrors} from '../ErrorSnacks';
import {setRating} from '../../../Redux/Slices/NormalSlices/OtherProfile/OtherProfileUserInfoSlice';

const Star = ({filled, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{marginHorizontal: 4}}>
      <Svg width={36} height={36} viewBox="0 0 24 24" fill={filled ? '#FF9966' : 'white'} stroke="black" strokeWidth={1.5} strokeLinejoin="round">
        <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01z" />
      </Svg>
    </TouchableOpacity>
  );
};

const OtherProfileRatingSheet = () => {
  const thisUserInfo = useSelector(state => state.otherProfileUserInfo);

  const [rate, setRate] = useState(0);

  const dispatcher = useDispatch();

  const token = useSelector(state => state.auth.user.token);

  const visible = useSelector(state => state.hideShow.visibility.ratingModal);

  console.log(visible);

  const [rateUser] = useRateUserMutation();

  const [loading, setLoading] = useState(false);

  console.log(thisUserInfo);

  useEffect(() => {
    setRate(thisUserInfo?.rating);
  }, [thisUserInfo]);

  const handleRating = async () => {
    setLoading(true);

    const {data, error} = await rateUser({token, displayName: thisUserInfo?.data?.displayName, rating: rate});

    if (data?.statusCode === 200) {
      dispatcher(setRating({rate: rate}));
      dispatcher(toggleRatingModal({show: false}));
      setLoading(false);
    }

    if (error?.data?.status_code === 400) {
      LoginPageErrors("You've already rated creator");
      setTimeout(() => {
        dispatcher(toggleRatingModal({show: false}));
        setLoading(false);
      }, 2000);
    }

    if (error?.status === 'FETCH_ERROR') {
      LoginPageErrors('Please check your network');
      dispatcher(toggleRatingModal({show: false}));
      setLoading(false);
    }
  };

  return (
    visible && (
      <View style={styles.overlay}>
        <BlurView intensity={15} style={styles.blurBackground} />
        <Dialog visible={visible} dialogStyle={styles.dialog} contentStyle={{padding: 0, paddingTop: 0}} onTouchOutside={() => dispatcher(toggleRatingModal({show: false}))}>
          <Text style={styles.headingTitle}>Rate @{thisUserInfo?.data?.displayName}</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(num => (
              <Star key={num} filled={num <= rate} onPress={() => setRate(num)} />
            ))}
          </View>
          <AnimatedButton title={'Submit'}  buttonMargin={0} onPress={() => handleRating()} loading={loading} disabled={loading} />
        </Dialog>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: responsiveWidth(5.33),
    // borderWidth: 2,
    // borderStyle: 'dashed',
    alignSelf: 'center',
    padding: 32,
    backgroundColor: '#fff',
    width: nTwins(88, 92),
    height: nTwins(56, 60),
    borderColor: '#1e1e1e',
    marginTop: responsiveWidth(130),
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
  },
  stars: {flexDirection: 'row', justifyContent: 'center', marginVertical: WIDTH_SIZES[10], marginBottom: WIDTH_SIZES[18]},

  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2.46),
    textAlign: 'center',
    lineHeight: responsiveWidth(6.93),
    marginVertical: 16,
    textTransform: 'capitalize',
    color: '#1e1e1e',
    width: responsiveWidth(75),
  },
  iconContainer: {
    height: 35,
    width: 46.4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  headingTitle: {
    fontSize: FONT_SIZES[20],
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
    textAlign: 'center',
  },
});

export default OtherProfileRatingSheet;
