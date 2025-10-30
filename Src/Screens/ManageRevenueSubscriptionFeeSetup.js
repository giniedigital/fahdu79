import {StyleSheet, Text, View, ScrollView, Switch, TextInput, Image, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import DIcon from '../../DesiginData/DIcons';
import {useAddPackageSubscriptionMutation, useLazyGetOwnPackageQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {LoginPageErrors, chatRoomSuccess} from '../Components/ErrorSnacks';
import {autoLogout} from '../../AutoLogout';

import {useSelector} from 'react-redux';
import Loader from '../Components/Loader';
import {useKeyboard} from '@react-native-community/hooks';
import Paisa from '../../Assets/svg/paisa.svg';

import Percentage from '../../Assets/svg/Percentage.svg';
import {selectionTwin, WIDTH_SIZES} from '../../DesiginData/Utility';
import AnimatedButton from '../Components/AnimatedButton';

const ManageRevenueSubscriptionFeeSetup = () => {
  const [switchMonthly, setSwitchMonthly] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const [switchMonthlyThree, setSwitchMonthlyThree] = useState(false);
  const [monthlyAmountThree, setMonthlyAmountThree] = useState(0);
  const [discountThree, setDiscountThree] = useState(0);
  const [finalAmountThree, setFinalAmountThree] = useState(0);

  const [switchMonthlySix, setSwitchMonthlySix] = useState(false);
  const [monthlyAmountSix, setMonthlyAmountSix] = useState(0);
  const [discountSix, setDiscountSix] = useState(0);
  const [finalAmountSix, setFinalAmountSix] = useState(0);

  const [switchMonthlyTwelve, setSwitchMonthlyTwelve] = useState(false);
  const [monthlyAmountTwelve, setMonthlyAmountTwelve] = useState(0);
  const [discountTwelve, setDiscountTwelve] = useState(0);
  const [finalAmountTwelve, setFinalAmountTwelve] = useState(0);

  const [currentSelectedInput, setCurrentSelectedInput] = useState(0);

  const [getOwnPackage] = useLazyGetOwnPackageQuery();
  const [addPackageSubscription] = useAddPackageSubscriptionMutation();

  const [loading, setLoading] = useState(true);

  const token = useSelector(state => state.auth.user.token);

  const keyboard = useKeyboard();

  useEffect(() => {
    setFinalAmount(monthlyAmount - Math.round((discount / 100) * monthlyAmount));
    setFinalAmountThree(monthlyAmountThree - Math.round((discountThree / 100) * monthlyAmountThree));
    setFinalAmountSix(monthlyAmountSix - Math.round((discountSix / 100) * monthlyAmountSix));
    setFinalAmountTwelve(monthlyAmountTwelve - Math.round((discountTwelve / 100) * monthlyAmountTwelve));
  }, [monthlyAmount, discount, monthlyAmountThree, discountThree, monthlyAmountSix, discountSix, monthlyAmountTwelve, discountTwelve]);

  useEffect(() => {
    console.log('Called');

    const getPackage = async () => {
      const {data, error} = await getOwnPackage({token});

      if (error) {
        if (error?.status === 'FETCH_ERROR') {
          LoginPageErrors('Please check your network');
        }

        if (error?.data?.status_code === 401) {
          autoLogout();
        }
      }

      if (data) {
        setSwitchMonthly(data?.data?.subscriptions[0]?.active);
        setSwitchMonthlyThree(data?.data?.subscriptions[1]?.active);
        setSwitchMonthlySix(data?.data?.subscriptions[2]?.active);
        setSwitchMonthlyTwelve(data?.data?.subscriptions[3]?.active);

        setMonthlyAmount(data?.data?.subscriptions[0]?.amount);
        setMonthlyAmountThree(data?.data?.subscriptions[1]?.amount);
        setMonthlyAmountSix(data?.data?.subscriptions[2]?.amount);
        setMonthlyAmountTwelve(data?.data?.subscriptions[3]?.amount);

        setDiscount(data?.data?.subscriptions[0]?.discount);
        setDiscountThree(data?.data?.subscriptions[1]?.discount);
        setDiscountSix(data?.data?.subscriptions[2]?.discount);
        setDiscountTwelve(data?.data?.subscriptions[3]?.discount);
      }
    };

    getPackage().then(() => {
      setLoading(false);
    });
  }, [token]);

  const handleSavePlan = async index => {
    console.log('discount', discount);

    setLoading(true);

    const {data, error} = await addPackageSubscription({
      token,
      data: {
        subscriptions: [
          {
            code: 11,
            amount: monthlyAmount,
            discount: discount || 0,
            active: switchMonthly,
          },
          {
            code: 33,
            amount: monthlyAmountThree,
            discount: discountThree || 0,
            active: switchMonthlyThree,
          },
          {
            code: 66,
            amount: monthlyAmountSix,
            discount: discountSix || 0,
            active: switchMonthlySix,
          },
          {
            code: 1212,
            amount: monthlyAmountTwelve,
            discount: discountTwelve || 0,
            active: switchMonthlyTwelve,
          },
        ],
      },
    });

    if (error) {
      LoginPageErrors(error?.data?.message);
      setLoading(false);
      if (error?.data?.status_code === 401) {
        autoLogout();
      }
    }

    if (data) {
      chatRoomSuccess(data?.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={[{flexGrow: 1}, keyboard.keyboardShown && Platform.OS === 'ios' ? {paddingBottom: keyboard.keyboardHeight + responsiveWidth(10)} : {}]} showsVerticalScrollIndicator={false}>
        <View style={styles.eachBoxContainer}>
          <View style={styles.switcherContainer}>
            <View
              style={{
                width: responsiveWidth(31),
                backgroundColor: '#1e1e1e', // Updated background color
                padding: responsiveWidth(1),
                borderRadius: 7, // Updated border radius
                height: responsiveWidth(8),
                justifyContent: 'center', // Center text vertically
                alignItems: 'center', // Center text horizontally
              }}>
              <Text
                style={[
                  styles.amountStyle,
                  {
                    color: '#fff', // Updated text color
                    fontSize: responsiveFontSize(1.6),
                    textAlign: 'center',
                  },
                ]}>
                1 Month Plan
              </Text>
            </View>
          </View>

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 1 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFE1CC'}]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(monthlyAmount)}
                onChangeText={t => setMonthlyAmount(t)}
                onFocus={() => setCurrentSelectedInput(1)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 5 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFA86B'}]}>
                <Text style={[styles.titleSetPrice]}>Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(discount)}
                onChangeText={t => setDiscount(t)}
                onFocus={() => setCurrentSelectedInput(5)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Percentage />
            </View>
          </View>

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: '#fff', borderColor: '#FFE0CC'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#fff', borderRightWidth: 0}]}>
                <Text style={[styles.titleSetPrice]}>After Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]} value={String(finalAmount)} editable={false} />
              <Paisa />
            </View>
          </View>

          {/* <Switch trackColor={{false: '#767577', true: '#81b0ff'}} thumbColor={switchMonthly ? '#f5dd4b' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={t => setSwitchMonthly(t)} value={switchMonthly} /> */}

          <View style={styles.toggleContainer}>
            <View style={styles.labelContainer}>
              <View style={[styles.dot, {backgroundColor: switchMonthly ? '#A4FFB8' : '#FF5555'}]} />
              <Text style={styles.label}>{switchMonthly ? 'Active' : 'In Active'}</Text>
            </View>
            <TouchableOpacity style={[styles.actualToggleContainer, {backgroundColor: switchMonthly ? '#fff' : '#FFF'}]} activeOpacity={0.8} onPress={() => setSwitchMonthly(!switchMonthly)}>
              <View style={[styles.circle, switchMonthly ? styles.circleOn : styles.circleOff]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.eachBoxContainer, {backgroundColor: '#fff'}]}>
          <View style={styles.switcherContainer}>
            {/* <Switch trackColor={{false: '#767577', true: '#81b0ff'}} thumbColor={switchMonthlyThree ? '#f5dd4b' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={t => setSwitchMonthlyThree(t)} value={switchMonthlyThree} /> */}

            <View
              style={{
                width: responsiveWidth(31),
                backgroundColor: '#1e1e1e',
                padding: responsiveWidth(1),
                borderRadius: 7,
                height: responsiveWidth(8),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.amountStyle,
                  {
                    color: '#fff',
                    fontSize: responsiveFontSize(1.6),
                    textAlign: 'center',
                  },
                ]}>
                3 Month Plan
              </Text>
            </View>
          </View>

          {/* <View style={styles.titleAndInputContainer}>
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Price</Text>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{borderBottomWidth: 1, padding: 0, width: responsiveWidth(35), paddingLeft: 2}, styles.amountStyle]}
              />
              <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </View>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 2 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFE1CC'}]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(monthlyAmountThree)}
                onChangeText={t => setMonthlyAmountThree(t)}
                onFocus={() => setCurrentSelectedInput(2)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 6 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFA86B'}]}>
                <Text style={[styles.titleSetPrice]}>Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(discountThree)}
                onChangeText={t => setDiscountThree(t)}
                onFocus={() => setCurrentSelectedInput(6)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Percentage />
            </View>
          </View>
          {/* 
          <View style={styles.finalAmountContainer}>
            <Text style={styles.statusTitle}>Amount after discount : </Text>
            <Text style={[styles.statusTitle, {fontSize: responsiveFontSize(2)}]}>{finalAmountThree}</Text>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: '#fff', borderColor: '#FFE0CC'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#fff', borderRightWidth: 0}]}>
                <Text style={[styles.titleSetPrice]}>After Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]} value={String(finalAmountThree)} editable={false} />
              <Paisa />
            </View>
          </View>

          {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveWidth(2), paddingHorizontal: responsiveWidth(2)}}>
            <View style={{flexDirection: 'row', minWidth: responsiveWidth(36), alignItems: 'center', backgroundColor: '#fff', padding: responsiveWidth(1), borderRadius: responsiveWidth(1), alignSelf: 'flex-end', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
                <Text style={styles.statusTitle}>{(finalAmountThree / 3).toFixed(1)}</Text>
              </View>
              <Text style={[styles.amountStyle, {color: '#000', fontSize: responsiveFontSize(1.6)}]}>/Month X 3</Text>
            </View>

            <TouchableOpacity onPress={() => handleSavePlan(2)} style={{flexDirection: 'row', gap: responsiveWidth(2), borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: responsiveWidth(4), paddingRight: responsiveWidth(2), borderColor: '#43e642'}}>
              <View>
                <DIcon name={'check-circle'} provider={'MaterialIcons'} color={'#BAFCA2'} size={responsiveWidth(7)} />
              </View>
              <Text style={{fontFamily: 'MabryPro-Bold', color: '#43e642'}}>Save</Text>
            </TouchableOpacity>
          </View> */}

          <View style={[styles.toggleContainer, {backgroundColor: '#fff'}]}>
            <View style={styles.labelContainer}>
              <View style={[styles.dot, {backgroundColor: switchMonthlyThree ? '#A4FFB8' : '#FF5555'}]} />
              <Text style={styles.label}>{switchMonthlyThree ? 'Active' : 'In Active'}</Text>
            </View>
            <TouchableOpacity style={[styles.actualToggleContainer, {backgroundColor: switchMonthlyThree ? '#fff' : '#FFF'}]} activeOpacity={0.8} onPress={() => setSwitchMonthlyThree(!switchMonthlyThree)}>
              <View style={[styles.circle, switchMonthlyThree ? styles.circleOn : styles.circleOff]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.eachBoxContainer}>
          <View style={styles.switcherContainer}>
            {/* <Switch trackColor={{false: '#767577', true: '#81b0ff'}} thumbColor={switchMonthlySix ? '#f5dd4b' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={t => setSwitchMonthlySix(t)} value={switchMonthlySix} />

            <View style={{width: responsiveWidth(25), backgroundColor: '#fff', padding: responsiveWidth(1), borderRadius: responsiveWidth(1)}}>
              <Text style={[styles.amountStyle, {color: '#000', fontSize: responsiveFontSize(1.6), textAlign: 'center'}]}>6 Month Plan</Text>
            </View>

            <View style={styles.activeInActive}>
              <Text style={styles.statusTitle}>Status : </Text>
              <Text style={[styles.activeInActiveTitle, switchMonthlySix ? {color: '#43e642'} : {color: '#ff0000'}]}>{switchMonthlySix ? 'Active' : 'Inactive'}</Text>
            </View> */}

            <View
              style={{
                width: responsiveWidth(31),
                backgroundColor: '#1e1e1e', // Updated background color
                padding: responsiveWidth(1),
                borderRadius: 7, // Updated border radius
                height: responsiveWidth(8),
                justifyContent: 'center', // Center text vertically
                alignItems: 'center', // Center text horizontally
              }}>
              <Text
                style={[
                  styles.amountStyle,
                  {
                    color: '#fff', // Updated text color
                    fontSize: responsiveFontSize(1.6),
                    textAlign: 'center',
                  },
                ]}>
                6 Month Plan
              </Text>
            </View>
          </View>

          {/* <View style={styles.titleAndInputContainer}>
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Price</Text>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{borderBottomWidth: 1, padding: 0, width: responsiveWidth(35), paddingLeft: 2}, styles.amountStyle]} 
                />
              <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </View>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 3 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFE1CC'}]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(monthlyAmountSix)}
                onChangeText={t => setMonthlyAmountSix(t)}
                onFocus={() => setCurrentSelectedInput(3)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {/* <View style={styles.titleAndInputContainer}>
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Discount</Text>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{borderBottomWidth: 1, padding: 0, width: responsiveWidth(35), paddingLeft: 2}, styles.amountStyle]}
               
                />
              <Image source={require('../../Assets/Images/percentage.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(4), width: responsiveWidth(4), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </View>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 7 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFA86B'}]}>
                <Text style={[styles.titleSetPrice]}>Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(discountSix)}
                onChangeText={t => setDiscountSix(t)}
                onFocus={() => setCurrentSelectedInput(7)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Percentage />
            </View>
          </View>

          {/* <View style={styles.finalAmountContainer}>
            <Text style={styles.statusTitle}>Amount after discount : </Text>
            <Text style={[styles.statusTitle, {fontSize: responsiveFontSize(2)}]}>{finalAmountSix}</Text>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: '#fff', borderColor: '#FFE0CC'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#fff', borderRightWidth: 0}]}>
                <Text style={[styles.titleSetPrice]}>After Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]} value={String(finalAmountSix)} editable={false} />
              <Paisa />
            </View>
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.labelContainer}>
              <View style={[styles.dot, {backgroundColor: switchMonthlySix ? '#A4FFB8' : '#FF5555'}]} />
              <Text style={styles.label}>{switchMonthlySix ? 'Active' : 'In Active'}</Text>
            </View>
            <TouchableOpacity style={[styles.actualToggleContainer, {backgroundColor: switchMonthlySix ? '#fff' : '#FFF'}]} activeOpacity={0.8} onPress={() => setSwitchMonthlySix(!switchMonthlySix)}>
              <View style={[styles.circle, switchMonthlySix ? styles.circleOn : styles.circleOff]} />
            </TouchableOpacity>
          </View>

          {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveWidth(2), paddingHorizontal: responsiveWidth(2)}}>
            <View style={{flexDirection: 'row', minWidth: responsiveWidth(36), alignItems: 'center', backgroundColor: '#fff', padding: responsiveWidth(1), borderRadius: responsiveWidth(1), alignSelf: 'flex-end', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
                <Text style={styles.statusTitle}>{(finalAmountSix / 6).toFixed(1)}</Text>
              </View>
              <Text style={[styles.amountStyle, {color: '#000', fontSize: responsiveFontSize(1.6)}]}>/Month X 6</Text>
            </View>

            <TouchableOpacity onPress={() => handleSavePlan(3)} style={{flexDirection: 'row', gap: responsiveWidth(2), borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: responsiveWidth(4), paddingRight: responsiveWidth(2), borderColor: '#43e642'}}>
              <View>
                <DIcon name={'check-circle'} provider={'MaterialIcons'} color={'#BAFCA2'} size={responsiveWidth(7)} />
              </View>
              <Text style={{fontFamily: 'MabryPro-Bold', color: '#43e642'}}>Save</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <View style={[styles.eachBoxContainer, {backgroundColor: '#fff'}]}>
          <View style={styles.switcherContainer}>
            <View
              style={{
                width: responsiveWidth(31),
                backgroundColor: '#1e1e1e',
                padding: responsiveWidth(1),
                borderRadius: 7,
                height: responsiveWidth(8),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.amountStyle,
                  {
                    color: '#fff',
                    fontSize: responsiveFontSize(1.6),
                    textAlign: 'center',
                  },
                ]}>
                12 Month Plan
              </Text>
            </View>
          </View>

          {/* <View style={styles.titleAndInputContainer}>
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Price</Text>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{borderBottomWidth: 1, padding: 0, width: responsiveWidth(35), paddingLeft: 2}, styles.amountStyle]} 
               />
              <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </View>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: 'white'}, currentSelectedInput === 4 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFE1CC'}]}>
                <Text style={[styles.titleSetPrice]}>Set Price</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(monthlyAmountTwelve)}
                onChangeText={t => setMonthlyAmountTwelve(t)}
                onFocus={() => setCurrentSelectedInput(4)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Paisa />
            </View>
          </View>

          {/* <View style={styles.titleAndInputContainer}>
            <View style={styles.amountInput}>
              <Text style={styles.titleSetPrice}>Set Discount</Text>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{borderBottomWidth: 1, padding: Platform.OS === 'ios' ? 12 : 0, width: responsiveWidth(35), paddingLeft: 2}, styles.amountStyle]}
              
              
              />
              <Image source={require('../../Assets/Images/percentage.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(4), width: responsiveWidth(4), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
            </View>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: '#fff'}, currentSelectedInput === 8 && {backgroundColor: '#FFF6F0'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#FFA86B'}]}>
                <Text style={[styles.titleSetPrice]}>Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput
                selectionHandleColor={'#ffa86b'}
                selectionColor={selectionTwin()}
                cursorColor={'#1e1e1e'}
                maxLength={6}
                keyboardType="number-pad"
                style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]}
                value={String(discountTwelve)}
                onChangeText={t => setDiscountTwelve(t)}
                onFocus={() => setCurrentSelectedInput(8)}
                onBlur={() => setCurrentSelectedInput(0)}
              />
              <Percentage />
            </View>
          </View>

          {/* <View style={styles.finalAmountContainer}>
            <Text style={styles.statusTitle}>Amount after discount : </Text>
            <Text style={[styles.statusTitle, {fontSize: responsiveFontSize(2)}]}>{finalAmountTwelve}</Text>
          </View> */}

          <View style={[styles.amountInput, {alignSelf: 'center', width: responsiveWidth(74), backgroundColor: '#fff', borderColor: '#FFE0CC'}]}>
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.titleback, {backgroundColor: '#fff', borderRightWidth: 0}]}>
                <Text style={[styles.titleSetPrice]}>After Discount</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: responsiveWidth(2), gap: Platform.OS == 'ios' ? responsiveWidth(2) : null}}>
              <TextInput maxLength={6} keyboardType="number-pad" style={[{padding: 0, color: '#1e1e1e', fontFamily: 'Rubik-Medium'}, styles.amountStyle]} value={String(finalAmountTwelve)} editable={false} />
              <Paisa />
            </View>
          </View>

          {/* <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: responsiveWidth(2), paddingHorizontal: responsiveWidth(2)}}>
            <View style={{flexDirection: 'row', minWidth: responsiveWidth(36), alignItems: 'center', backgroundColor: '#fff', padding: responsiveWidth(1), borderRadius: responsiveWidth(1), alignSelf: 'flex-end', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Image source={require('../../Assets/Images/Coin.png')} resizeMethod="resize" resizeMode="contain" style={{height: responsiveWidth(5), width: responsiveWidth(5), resizeMode: 'contain', alignSelf: 'center', marginRight: responsiveWidth(1)}} />
                <Text style={styles.statusTitle}>{(finalAmountTwelve / 12).toFixed(1)}</Text>
              </View>
              <Text style={[styles.amountStyle, {color: '#000', fontSize: responsiveFontSize(1.6)}]}>/Month X 12</Text>
            </View>

            <TouchableOpacity onPress={() => handleSavePlan(4)} style={{flexDirection: 'row', gap: responsiveWidth(2), borderWidth: 2, justifyContent: 'center', alignItems: 'center', borderRadius: responsiveWidth(4), paddingRight: responsiveWidth(2), borderColor: '#43e642'}}>
              <View>
                <DIcon name={'check-circle'} provider={'MaterialIcons'} color={'#BAFCA2'} size={responsiveWidth(7)} />
              </View>
              <Text style={{fontFamily: 'MabryPro-Bold', color: '#43e642'}}>Save</Text>
            </TouchableOpacity>
          </View> */}

          <View style={[styles.toggleContainer, {backgroundColor: '#fff'}]}>
            <View style={styles.labelContainer}>
              <View style={[styles.dot, {backgroundColor: switchMonthlyTwelve ? '#A4FFB8' : '#FF5555'}]} />
              <Text style={styles.label}>{switchMonthlyTwelve ? 'Active' : 'In Active'}</Text>
            </View>
            <TouchableOpacity style={[styles.actualToggleContainer, {backgroundColor: switchMonthlyTwelve ? '#fff' : '#FFF'}]} activeOpacity={0.8} onPress={() => setSwitchMonthlyTwelve(!switchMonthlyTwelve)}>
              <View style={[styles.circle, switchMonthlyTwelve ? styles.circleOn : styles.circleOff]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{width: responsiveWidth(84), alignSelf: 'center'}}>
          <AnimatedButton title={'Save'} loading={loading} onPress={handleSavePlan} />
        </View>
        <View style={{height: responsiveWidth(20)}} />
      </ScrollView>
    </View>
  );
};

export default ManageRevenueSubscriptionFeeSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: responsiveWidth(6.12),
  },
  text: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'MabryPro-Medium',
    color: '#282828',
    textAlign: 'center',
  },
  eachBoxContainer: {
    borderWidth: WIDTH_SIZES[2],
    padding: responsiveWidth(8.5),
    marginVertical: responsiveWidth(4),
    borderRadius: responsiveWidth(5.1),
    backgroundColor: '#FFF6F0',
    borderStyle: 'dashed',
  },
  switcherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeInActive: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    flexGrow: 0,
    paddingHorizontal: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(30),
    backgroundColor: '#fff',
  },
  statusTitle: {
    fontFamily: 'MabryPro-Bold',
    color: '#282828',
    fontSize: responsiveFontSize(1.8),
    marginRight: responsiveWidth(1),
  },
  activeInActiveTitle: {
    fontFamily: 'MabryPro-Medium',
    fontSize: responsiveFontSize(1.6),
  },

  titleAndInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveWidth(2),
    width: responsiveWidth(74),
  },

  titleSetPrice: {
    fontSize: responsiveFontSize(2),
    backgroundColor: '#e3dff2',
    height: '90%',
    borderRadius: responsiveWidth(2),
    textAlign: 'center',
    textAlignVertical: 'center',
    flexBasis: '45%',
    fontFamily: 'MabryPro-Medium',
    color: '#282828',
    overflow: 'hidden',
    lineHeight: Platform.OS === 'ios' ? 46 : 23,
  },

  finalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(2),
    marginVertical: responsiveWidth(2),
  },

  amountStyle: {
    fontFamily: 'MabryPro-Bold',
    color: '#282828',
    marginRight: responsiveWidth(1),
  },

  amountInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 1,
    borderColor: '#1e1e1e',
    height: responsiveWidth(14.1),
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: responsiveWidth(3.06),
    borderRadius: responsiveWidth(3.14),
    width: responsiveWidth(85),
    fontFamily: 'MabryPro-Regular',
    overflow: 'hidden',
  },

  titleback: {
    backgroundColor: '#FF8080', // Just for visibility
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%', // Ensures full height
    alignSelf: 'stretch', // Makes it stretch fully,
    borderRightWidth: 2,
  },
  titleSetPrice: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Rubik-Medium',
    color: '#1e1e1e',
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: responsiveWidth(76),
    alignSelf: 'center',
    padding: 5,
    backgroundColor: '#FFF5EE',
    marginTop: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  actualToggleContainer: {
    width: 30,
    height: 17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  circle: {
    width: 13,
    height: 13,
    borderRadius: 10,
  },
  circleOn: {
    marginLeft: 'auto',
    backgroundColor: '#FFA86B',
  },
  circleOff: {
    marginRight: 'auto',
    backgroundColor: '#1e1e1e',
  },
});
