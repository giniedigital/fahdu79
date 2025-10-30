import {StyleSheet, Text, View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {responsiveWidth, responsiveFontSize} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image} from 'expo-image';
import PaymentAlertModal from './PaymentAlertModal';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { togglePaymentAlert } from '../../../Redux/Slices/NormalSlices/HideShowSlice';
import { useLazyFeatureWiseEarningDetailQuery } from '../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';

const earningsCategories = [
    {
      id: '1',
      title: 'Video & Voice Calls',
      data: [
        {id: '1', label: 'Balance', value: '25', showInfo: false},
        {id: '2', label: 'Hold', value: '0', showInfo: true},
        {id: '3', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#FBF8CC',
    },
    {
      id: '2',
      title: 'Chats',
      data: [
        {id: '4', label: 'Balance', value: '25', showInfo: false},
        {id: '5', label: 'Hold', value: '0', showInfo: true},
        {id: '6', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#EBB0FF',
    },
    {
      id: '3',
      title: 'Live',
      data: [
        {id: '7', label: 'Balance', value: '25', showInfo: false},
        {id: '8', label: 'Hold', value: '0', showInfo: true},
        {id: '9', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#FFD2B2',
    },
    {
      id: '4',
      title: 'Subscription',
      data: [
        {id: '10', label: 'Balance', value: '25', showInfo: false},
        {id: '11', label: 'Hold', value: '0', showInfo: true},
        {id: '12', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#89CFF0',
    },
    {
      id: '5',
      title: 'Referral',
      data: [
        {id: '13', label: 'Balance', value: '25', showInfo: false},
        {id: '14', label: 'Hold', value: '0', showInfo: true},
        {id: '15', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#CFE5FF',
    },
    {
      id: '6',
      title: 'Brands',
      data: [
        {id: '16', label: 'Balance', value: '25', showInfo: false},
        {id: '17', label: 'Hold', value: '0', showInfo: true},
        {id: '18', label: 'Withdrawable', value: '25', showInfo: false},
      ],
      borderColor: '#D5FFDE',
    },
  ];
const Details = () => {
  const [dynamicHeight, setDynamicHeight] = useState(0);

  const showVerifiedModal = useSelector(state => state.hideShow.visibility.paymentAlert);

  const [featureWiseEarningDetail] = useLazyFeatureWiseEarningDetailQuery()


  const dispatch = useDispatch()

  const token = useSelector(state => state.auth.user.token);


  const [details, setDetails] = useState([])



  const getDeatails = async () => {

      const {data, error} = await featureWiseEarningDetail({token})


      console.log(data?.data?.earningsCategories, "::::")


      setDetails(data?.data?.earningsCategories)

  }


  useEffect(() => {


    getDeatails();


  }, [])




  const renderEarningsCard = ({item}) => (
    <View style={{marginBottom: responsiveWidth(5.87), width: '100%'}}>
      <Text style={styles.heading}>{item.title}</Text>
      <View style={[styles.overlayCard, {height: dynamicHeight, backgroundColor: item.borderColor}]} />
      <View onLayout={event => setDynamicHeight(event.nativeEvent.layout.height)} style={[styles.card,]}>
        <FlatList
          scrollEnabled={false}
          data={item.data}
          keyExtractor={subItem => subItem.id}
          ItemSeparatorComponent={() => <View style={{height: responsiveWidth(6.13)}} />}
          renderItem={({item: subItem}) => (
            <View style={styles.row}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>{subItem.label}</Text>
                {subItem.showInfo && <Ionicons name="information-circle-outline" size={14} color="black" style={styles.infoIcon} onPress={() => dispatch(togglePaymentAlert({show : true}))}/>}
              </View>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{subItem.value}</Text>
                <View style={styles.coinIcon}>
                  <Image source={require('../../../Assets/Images/Coins2.png')} contentFit="contain" style={{flex: 1}} />
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList data={details} keyExtractor={item => item.id} renderItem={renderEarningsCard} showsVerticalScrollIndicator={false} />
      <PaymentAlertModal visible={showVerifiedModal}/>
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  //Card Design

  card: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 15,
    width: '97%',
    // alignSelf: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: responsiveFontSize(2),
    color: '#1e1e1e',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(1.8),
    color: '#1e1e1e',
  },
  infoIcon: {
    marginLeft: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    color: '#1e1e1e',
  },
  coinIcon: {
    height: 19,
    width: 19,
    marginLeft: 10,
  },

  //OverlayCard
  overlayCard: {
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    // marginLeft: "1%",
    marginTop: "12.4%",
    width : "96.4%"
  },
});
