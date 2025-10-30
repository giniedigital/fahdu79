import {StyleSheet, Text, View, Image, TouchableOpacity, FlatList, TextInput, Button, Alert, Pressable, Platform} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {token as memoizedToken} from '../../Redux/Slices/NormalSlices/AuthSlice';
import {paidRequests} from '../../DesiginData/Data';
import {useApplyInCampaignMutation, useGetDashBoardDataQuery, useListOfAppliedCampaignMutation} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useDispatch, useSelector} from 'react-redux';
import DIcon from '../../DesiginData/DIcons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {navigate} from '../../Navigation/RootNavigation';
import {setCurrentDashboardAction} from '../../Redux/Slices/NormalSlices/Brands/CurrentDashboardActionSlice';
import {ChatWindowError} from '../Components/ErrorSnacks';
import {daysUntil} from '../../DesiginData/Utility';
import {padios} from '../../DesiginData/Utility';
import {RawButton} from 'react-native-gesture-handler';

const DashBoard = () => {
  const token = useSelector(state => state.auth.user.token);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [list, setList] = useState([]);

  const [listOfAppliedCampaign] = useListOfAppliedCampaignMutation();

  const currentUserDetails = useSelector(state => state?.auth?.user);

  const [applyInCampaign] = useApplyInCampaignMutation();

  // const handleCurrentActionSelected = useCallback((name) => {

  //   dispatch(setCurrentDashboardAction({name}))
  //   navigate("DetailedDashboard", {token})

  // }, []);

  const [link, setLink] = useState('');

  const isValidInstagramURL = url => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '(www\\.)?' + // optional www
        '(instagram\\.com|instagr\\.am)\\/' + // domain
        '[a-zA-Z0-9._]+(\\/.*)?$',
      'i',
    ); // username or path
    return !!pattern.test(url);
  };

  const handleSubmitLink = async (creatorId, campaignId) => {
    if (isValidInstagramURL(link)) {
      const {data, error} = await applyInCampaign({
        token,
        data: {
          creatorId,
          campaignId,
          link,
        },
      });

      if (data?.success === false) {
        ChatWindowError(data?.message);
      }

      if (data?.success === true) {
        ChatWindowError(data?.message);
      }
    } else {
      ChatWindowError('Invalid instagram link');
      return;
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function fetchCampaignsInterested() {
        const {data, error} = await listOfAppliedCampaign({
          token,
          data: {
            creatorId: currentUserDetails?.ylyticInstagramUserId,
          },
        });

        if (data?.success) {
          setList(data?.data);
        }

        if (!data?.success) {
          ChatWindowError(data?.message);
        }
      }

      fetchCampaignsInterested();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'black',
          fontSize: responsiveWidth(6.5),
          fontFamily: 'Rubik-SemiBold',
        }}>
        Brand Status
      </Text>
      <FlatList
        data={list}
        renderItem={({item, index}) => (
          <View style={styles.eachbox}>
            <View style={{gap: responsiveWidth(4)}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-Regular',
                  }}>
                  Sr.no.
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-SemiBold',
                  }}>
                  {index + 1}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-Regular',
                  }}>
                  Title
                </Text>

                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-SemiBold',
                  }}>
                  {' '}
                  {item.campTitle}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-Regular',
                  }}>
                  brand Name
                </Text>

                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-SemiBold',
                  }}>
                  {item.brandName}
                </Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveWidth(4.5),
                    fontFamily: 'Rubik-Regular',
                  }}>
                  TimeLine
                </Text>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: responsiveWidth(4.5),
                      fontFamily: 'Rubik-SemiBold',
                    }}>
                    {' '}
                    {daysUntil(item.submissionExpiryDate) < 0 ? 'Expired.' : `Expires in ${daysUntil(item.submissionExpiryDate)} days.`}
                  </Text>
                </View>
              </View>

              <View></View>

              <TextInput
                style={{
                  borderWidth: responsiveWidth(0.5),
                  borderRadius: responsiveWidth(5),
                  padding: Platform.OS === 'ios' ? responsiveWidth(4) : null,
                }}
                placeholder="paste your link"
                autoCapitalize="none"
                onChangeText={setLink}
              />
              <Pressable onPress={() => handleSubmitLink(item.creatorId, item.campaignId)}>
                <View styl={{position: 'relative'}}>
                  <Text style={[styles.loginButton, {zIndex: 222}]}>Submit for Review</Text>
                  <Text
                    style={[
                      styles.loginButton,
                      {
                        position: 'absolute',
                        color: 'black',
                        top: responsiveWidth(1),
                        left: responsiveWidth(0.5),
                        backgroundColor: 'black',
                      },
                    ]}></Text>

                  <Text style={[styles.loginBack]}></Text>
                </View>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default DashBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopColor: '#282828',
    paddingHorizontal: responsiveWidth(4),
    justifyContent: 'center',
    gap: responsiveWidth(4),
  },
  eachbox: {
    borderWidth: responsiveWidth(0.5),
    flexDirection: 'column',
    gap: responsiveWidth(2),
    marginBottom: responsiveWidth(4), // Add marginBottom to create space between sections
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(3.5),
  },
  contentContainer: {
    padding: responsiveWidth(2),
  },

  title: {
    fontFamily: 'Lexend-Bold',
    color: '#FFA07A',
    fontSize: responsiveFontSize(2.5),
    textAlign: 'center',
  },

  content: {
    borderWidth: 1,
    borderRadius: responsiveWidth(2),
    padding: responsiveWidth(2),

    marginTop: responsiveWidth(6),
  },
  loginButton: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#FFA86B',
    borderRadius: responsiveWidth(3.5),
    paddingTop: Platform.OS === 'ios' ? responsiveWidth(3.7) : null,

    color: '#282828',
    textAlign: 'center',
    fontFamily: 'Rubik-SemiBold',
    borderWidth: responsiveWidth(0.5),
    fontWeight: '600',
    width: responsiveWidth(85),
    height: responsiveWidth(13),
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderTopColor: '#282828',
    borderLeftColor: '#282828',
    fontSize: responsiveFontSize(2),
    padding: padios(responsiveWidth(2.4)),
    overflow: 'hidden',
    marginTop: responsiveWidth(6),
  },
});
