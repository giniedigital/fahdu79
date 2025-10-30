import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import HalfDonutChart from '../../HalfDonutChart';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image} from 'expo-image';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import {FlatList} from 'react-native-gesture-handler';
import AnimatedButton from '../Components/AnimatedButton';
import {navigate} from '../../Navigation/RootNavigation';
import EarningModal from './revenue/EarningModal';
import {useDispatch, useSelector} from 'react-redux';
import {toggleConfirmBankDetails} from '../../Redux/Slices/NormalSlices/HideShowSlice';
import {useLazyGetTotalEarningsQuery, useLazyGetWeeklyEarningQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import BankDetailsModal from './revenue/BankDetailsModal';
import MoneyTransferModal from './revenue/MoneyTransferModal';
import ShowBankDetails from './revenue/ShowBankDetails';
import VerifiedModal from '../Components/Verification/VerifiedModal';
import { LoginPageErrors } from '../Components/ErrorSnacks';

const earningsData = [
  {id: '1', label: 'Live', amount: '100', color: '#FFD2B2'},
  {id: '2', label: 'Subscription', amount: '30k', color: '#CFE5FF'},
  {id: '3', label: 'Tip', amount: '200', color: '#CFBAF0'},
  {id: '4', label: 'Referrals', amount: '500', color: '#FFCFD2'},
  {id: '5', label: 'Call', amount: '100k', color: '#FBF8CC'},
  {id: '6', label: 'Chat', amount: '100k', color: '#D5FFDE'},
  {id: '7', label: 'Wishlist', amount: '100k', color: '#B5F8FE'},
];

const earningsDataList = [
  {id: '1', label: 'Balance', value: '2320', showInfo: false},
  {id: '2', label: 'Hold', value: '20', showInfo: true},
  {id: '3', label: 'TDS', value: '0', showInfo: true},
  {id: '4', label: 'Withdrawable', value: '2300', showInfo: false},
];

const ManageRevenueDashboard = () => {
  const [graphData, setGraphData] = useState({});

  const token = useSelector(state => state.auth.user.token);

  const {bankDetailsModal, confirmBankDetailsModal, transferModal, bankDetails, appliedVerify} = useSelector(state => state.hideShow.visibility);

  console.log(confirmBankDetailsModal, '::::::');

  const dispatch = useDispatch();

  const [formDetails, setFormDetails] = useState({});

  const [totalEarningList, setTotalEarningList] = useState([]);

  const [cardEarningList, setCardEarningList] = useState([]);

  const [getWeeklyEarning] = useLazyGetWeeklyEarningQuery();

  const [getTotalEarnings] = useLazyGetTotalEarningsQuery();

  async function callGraphApi() {
    const {data, error} = await getWeeklyEarning({token});

    console.log(data)

    console.log(data?.data?.orderedEarnings, 'GRaph');

    const labelToColorMap = earningsData.reduce((map, item) => {
      map[item.label.toUpperCase()] = item.color; 
      return map;
    }, {});

    const earnedArrWithColors = data?.data?.orderedEarnings?.map(item => ({
      ...item,
      color: labelToColorMap[item.category] || '#CCCCCC', 
    }));

    setGraphData({
      orderedEarnings: earnedArrWithColors,
      totalEarningsWeek: data?.data?.totalEarningsWeek,
    });

    // console.log(earnedArrWithColors);
  }

  async function callGetTotalEarnings() {
    const {data, error} = await getTotalEarnings({token});



    console.log(data?.data, "||||")

    const labelToColorMap = earningsData.reduce((map, item) => {
      map[item.label.toUpperCase()] = item.color; // Convert labels to uppercase for matching
      return map;
    }, {});

    const earnedArrWithColors = data?.data?.orderedEarnings?.map(item => ({
      ...item,
      color: labelToColorMap[item.category] || '#CCCCCC', // Default color if no match is found
    }));

    setTotalEarningList(earnedArrWithColors);

    setCardEarningList(data?.data?.earningsDataList)
   
    
  }

  useEffect(() => {
    callGraphApi();
    callGetTotalEarnings();
  }, []);


  const handlePress = () => {
    const totalAmount = cardEarningList[0]?.value - cardEarningList[0]?.value * 0.2 || 0;
    
    totalAmount >= 1000 
      ? dispatch(toggleConfirmBankDetails({ show: true }))
      : LoginPageErrors("Your balance should be in multiples of 1000");
  };
  

  const LiveBox = () => {
    return (
      <FlatList
        data={totalEarningList}
        keyExtractor={item => item.id}
        contentContainerStyle={{alignItems: 'center'}}
        style={{maxHeight: responsiveWidth(14)}}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{width: responsiveWidth(4.25)}} />}
        renderItem={({item}) => (
          <View style={[styles.eachBoxContainer, {backgroundColor: item.color}]}>
            <Text style={styles.text}>{item.category}</Text>
            <Text style={[styles.textValue]}>{item.earnings}</Text>
            <View style={{height: 19, width: 19, marginLeft: responsiveWidth(1.87)}}>
              <Image source={require('../../Assets/Images/Coins2.png')} contentFit="contain" style={{flex: 1}} />
            </View>
          </View>
        )}
      />
    );
  };


  const EarningsCard = () => {
    return (
      <View style={{marginTop: responsiveWidth(6.4), width: '100%'}}>
        <Text style={styles.heading}>Your Earnings</Text>
        <View style={styles.card}>
          <FlatList
            data={cardEarningList}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <View style={{height: responsiveWidth(5.87)}} />}
            renderItem={({item}) => (
              <View style={styles.row}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                  {item.showInfo && <Ionicons name="information-circle-outline" size={14} color="black" style={styles.infoIcon} />}
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.value}>{item.value}</Text>
                  <View style={styles.coinIcon}>
                    <Image source={require('../../Assets/Images/Coins2.png')} contentFit="contain" style={{flex: 1}} />
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    );
  };

  const FullDetailsButton = () => {
    return (
      <TouchableOpacity style={styles.buttonDashed} activeOpacity={0.7} onPress={() => navigate('details')}>
        <Text style={styles.textDashedButton}>See Full Details</Text>
        <Ionicons name="chevron-forward" size={18} color="#1e1e1e" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HalfDonutChart graphData={graphData} />

      <LiveBox />
      <EarningsCard />
      <FullDetailsButton />
      <View style={{width: '100%'}}>
        <AnimatedButton title={'Transfer'} onPress={handlePress} />
      </View>
      <EarningModal visible={confirmBankDetailsModal} balance = {cardEarningList[0]?.value}/>
      <BankDetailsModal visible={bankDetailsModal} setFormDetails={setFormDetails} />
      <MoneyTransferModal visible={transferModal} formDetails={formDetails} />
      <ShowBankDetails visible={bankDetails}/>
      <VerifiedModal visible={appliedVerify} type={'dashboard'} />

    </View>
  );
};

export default ManageRevenueDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  eachBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC6A5', // Light peach background
    borderRadius: responsiveWidth(3.74),
    borderWidth: 1.5,
    borderColor: '#000',
    height: responsiveWidth(13.33),
    paddingHorizontal: 12, // Padding for spacing
    alignSelf: 'flex-start', // Adjust width based on content
  },
  text: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(2),
    color: '#1e1e1e',
  },

  textValue: {
    fontFamily: 'Rubik-Regular',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(7.73),
    color: '#1e1e1e',
  },

  //Card Design

  card: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
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
    fontFamily: 'Rubik-Regular',
    fontSize: 14,
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
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#1e1e1e',
  },
  coinIcon: {
    height: 19,
    width: 19,
    marginLeft: 10,
  },

  //Button

  buttonDashed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    borderStyle: 'dashed',
    paddingHorizontal: 15,
    width: '100%',
    marginTop: responsiveWidth(6.4),
  },
  textDashedButton: {
    fontFamily: 'Rubik-Medium',
    fontSize: responsiveFontSize(1.8),
    color: '#1e1e1e',
  },
});
