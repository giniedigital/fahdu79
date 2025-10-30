import {StyleSheet, Text, View, Platform, Pressable} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatRoom from '../Src/Screens/ChatRoom';
import {responsiveFontSize, responsiveWidth} from 'react-native-responsive-dimensions';
import BottomNavigationIcons from '../DesiginData/BottomNavigationIcons';
import NotificationScreen from '../Src/Screens/NotificationScreen';
import HeaderCenteredTitle from '../Src/Components/HeaderCenteredTitle';
import ChatRoomHeaderLeft from '../Src/Components/ChatRoomHeaderLeft';
import ChatRoomHeaderRight from '../Src/Components/ChatRoomHeaderRight';
import Home from '../Src/Screens/Home';
import HomeHeaderRight from '../Src/Components/HomeHeaderRight';
import DashBoard from '../Src/Screens/DashBoard';
import {useDispatch, useSelector} from 'react-redux';
import HeaderLeftMyProfile from '../Src/Components/MyProfile/HeaderLeftMyProfile';
import HeaderRightMyProfile from '../Src/Components/MyProfile/HeaderRightMyProfile';
import DiscoverScreen from '../Src/Screens/DiscoverScreen';
import ProfileNew from '../Src/Screens/ProfileNew';
import LottieView from 'lottie-react-native';
import Feather from 'react-native-vector-icons/Feather';
import {nTwins, twins} from '../DesiginData/Utility';
import {toggleCreatePostBottomSheet} from '../Redux/Slices/NormalSlices/HideShowSlice';
import ChatRoomHeader from '../Src/Components/ChatWindowComponents/ChatRoomHeader';
import {navigate} from './RootNavigation';
import DIcon from '../DesiginData/DIcons';
import FloatingSelectedBar from '../Src/Screens/Chatroom/FloatingSelectedBar';

const Tab = createBottomTabNavigator();

const handleIcons = (route, focused) => {
  let iconName;

  switch (route.name) {
    case 'chatroom':
      iconName = !focused ? 'messages' : 'messagesFocus';
      break;
    case 'createpostbottomtab':
      iconName = !focused ? 'createpostbottomtab' : 'createpostbottomtabFocus';
      break;
    case 'home':
      iconName = !focused ? 'home' : 'homeFocus';
      break;
    case 'dashboard':
      iconName = !focused ? 'dashboard' : 'dashboardFocus';
      break;
    case 'profile':
      iconName = !focused ? 'profile' : 'profileFocus';
      break;
    case 'discover':
      iconName = !focused ? 'discover' : 'discoverFocus';
      break;
    case 'notifications':
      iconName = !focused ? 'notifications' : 'notificationsFocus';
      break;
    default:
      break;
  }

  return <BottomNavigationIcons iconName={iconName} focused={focused} />;
};
function EmptyComponent() {
  return 'notifications';
}

const TabNavigation = () => {
  const currentAppMode = useSelector(state => state.hideShow.visibility.postCardType);
  const {role} = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const visibility = useSelector(state => state.hideShow.visibility.floatingViews);

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarStyle: [styles.tabBarStyle],
          tabBarShowLabel: false,
          tabBarIcon: ({color, focused}) => handleIcons(route, focused, color),
        })}
        initialRouteName="home">
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            headerTitle: '',
            gestureEnabled: false,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: '#fff'}, //#f9e4d1  e0c1de
            headerBackVisible: false,
            headerLeft: () => <ChatRoomHeaderLeft />,
            headerRight: () => <HomeHeaderRight />,
            headerBackButtonMenuEnabled: false,
            tabBarHideOnKeyboard: true,
            headerStyle: {
              backgroundColor: '#fff',
            },
          }}
        />

        {currentAppMode === 'brand' ? (
          <Tab.Screen
            name="dashboard"
            component={DashBoard}
            options={{
              gestureEnabled: false,
              headerShadowVisible: false,
              headerBackTitleVisible: false,
              headerStyle: {backgroundColor: '#fff'}, //#f9e4d1  e0c1de
              headerTitle: '',
              headerLeft: () => <HeaderCenteredTitle title="Dashboard" />,
              headerBackButtonMenuEnabled: false,
              tabBarHideOnKeyboard: true,
            }}
          />
        ) : (
          <>
            <Tab.Screen
              name="chatroom"
              component={ChatRoom}
              options={{
                gestureEnabled: false,
                headerShadowVisible: false,
                headerBackTitleVisible: false,
                headerStyle: {backgroundColor: '#fff'}, //#f9e4d1  e0c1de
                headerTitle: '',
                // headerLeft: () => <ChatRoomHeaderLeft />,
                // headerRight: () => <ChatRoomHeaderRight />,

                headerBackButtonMenuEnabled: false,
                tabBarHideOnKeyboard: true,
                header: () => <ChatRoomHeader />,
              }}
            />
            {role === 'creator' && (
              <Tab.Screen
                name="createpostbottomtab"
                component={EmptyComponent}
                options={{}}
                listeners={{
                  tabPress: e => {
                    // Prevent default action
                    e.preventDefault();

                    dispatch(toggleCreatePostBottomSheet({show: 1}));
                  },
                }}
              />
            )}

            <Tab.Screen
              name="discover"
              component={DiscoverScreen}
              options={{
                headerTitle: '',
                headerLeft: () => <Text style={{fontFamily: 'Rubik-Bold', fontSize: responsiveFontSize(3), color: '#1E1E1E', paddingLeft: 24}}>Discover</Text>,

                headerRight: () => (
                  <Pressable
                    onPress={() => navigate('creatorSearch')}
                    style={({pressed}) => ({
                      paddingRight: 24,
                      opacity: pressed ? 0.5 : 1,
                    })}>
                    <DIcon provider="Feather" name="search" size={20} color="#1E1E1E" />
                  </Pressable>
                ),

                tabBarHideOnKeyboard: true,
                tabBarStyle: styles.tabBarStyle,
                headerShadowVisible: false,
              }}
            />

            <Tab.Screen
              name="profile"
              component={ProfileNew}
              options={{
                headerTitle: '',
                headerLeft: () => <HeaderLeftMyProfile />,
                headerRight: () => <HeaderRightMyProfile />,
                headerStyle: {backgroundColor: '#fff'},
                headerShadowVisible: false,
                headerShown: false,
                headerStatusBarHeight: 0,
              }}
            />
          </>
        )}
      </Tab.Navigator>

      {show && (
        <View style={styles.maintain}>
          <View style={styles.card}>
            <View style={styles.lottieContainer}>
              <LottieView
                source={require('../Assets/Animation/maintain.json')}
                autoPlay
                loop
                style={{
                  height: '100%',
                  width: '100%',
                }}
              />
            </View>

            <View>
              <Text style={styles.text}>We are </Text>
              <Text style={styles.text}>under maintenance</Text>
            </View>
          </View>
        </View>
      )}

      {visibility === 'showSelected' && <FloatingSelectedBar />}
    </>
  );
};

export default TabNavigation;

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#fff',
    height: nTwins(18, 20),
  },
  maintain: {
    flex: 1,
    backgroundColor: '#00000060',
    position: 'absolute',
    left: 0,
    bottom: 0,
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  card: {
    backgroundColor: '#fff',
    elevation: 2,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    flexDirection: 'row',
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(99),
    // gap : responsiveWidth(2),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 34,
    marginBottom: responsiveWidth(30),
    flexDirection: 'row',
  },

  lottieContainer: {
    flex: 0,
    width: responsiveWidth(25),
    height: responsiveWidth(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'MabryPro-Medium',
    fontSize: responsiveFontSize(3),
    color: '#28282899',
    textAlign: 'center',
  },
});
