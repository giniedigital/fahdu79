import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Something from './Assets/svg/Add.svg';
import Cam from './Assets/svg/chatCam.svg';
import Edit from './Assets/svg/editp.svg';
import Subscribed from './Assets/svg/subscribed.svg';
import Subscribers from './Assets/svg/subscribers.svg';
import Followers from './Assets/svg/followers.svg';
import Password from './Assets/svg/change.svg';
import Refferal from './Assets/svg/reffer.svg';
import Revenue from './Assets/svg/revenue.svg';
import Wallet from './Assets/svg/wallet.svg';
import Blocked from './Assets/svg/blocked.svg';
import Audio from './Assets/svg/audio.svg';
import Twofactor from './Assets/svg/twofactor.svg';
import Linked from './Assets/svg/linked.svg';
import Terms from './Assets/svg/terms.svg';
import Policy from './Assets/svg/privacy.svg';
import About from './Assets/svg/about.svg';
import Logout from './Assets/svg/logout.svg';
import Verification from './Assets/svg/verification.svg';
import Trans from './Assets/svg/Transs.svg';
import Management from './Assets/svg/management.svg';
import NotificationIcon from './Assets/svg/notificationIcon.svg';
import Snapchat from './Assets/svg/snapchat.svg';
import Insta from './Assets/svg/instagram.svg';
import Twitt from './Assets/svg/twitt.svg';
import Youtube from './Assets/svg/youtube.svg';
import ChatWindowSettings from './Assets/svg/ChatWindowSettings.svg';
import Transactions from './Assets/svg/transactions.svg';
import Dashboard from './Assets/svg/dashboard.svg';
import FeeSetup from './Assets/svg/feesetup.svg';
import FeeSubs from './Assets/svg/fee.svg';
import Reff from './Assets/svg/reff.svg';
import Content from './Assets/svg/sccontent.svg';
import SettingNew from './Assets/svg/settnew.svg';
import Verisett from './Assets/svg/verisett.svg';
import Mark from './Assets/svg/mark.svg';
import Info from './Assets/svg/info.svg';
import Refund from './Assets/svg/Refund.svg';
import TAC from './Assets/svg/tac.svg';

import OtherProfileShareLink from './Assets/svg/OtherProfileShareLink.svg';

import {responsiveWidth} from 'react-native-responsive-dimensions';

const AddSvg = ({name, ...props}) => {
  let Provider;

  switch (name) {
    case 'Edit':
      Provider = Edit;
      break;
    case 'Reff':
      Provider = Reff;
      break;
    case 'Content':
      Provider = Content;
      break;
    case 'SettingNew':
      Provider = SettingNew;
      break;
    case 'Verisett':
      Provider = Verisett;
      break;
    case 'Mark':
      Provider = Mark;
      break;
    case 'Info':
      Provider = Info;
      break;
    case 'FeeSetup':
      Provider = FeeSetup;
      break;
    case 'FeeSubs':
      Provider = FeeSubs;
      break;
    case 'Dashboard':
      Provider = Dashboard;
      break;
    case 'Transactions':
      Provider = Trans;
      break;
    case 'Subscribed':
      Provider = Subscribed;
      break;
    case 'Subscribers':
      Provider = Subscribers;
      break;

    case 'Followers':
      Provider = Followers;
      break;

    case 'Password':
      Provider = Password;
      break;
    case 'Refferal':
      Provider = Refferal;
      break;
    case 'Revenue':
      Provider = Revenue;
      break;
    case 'Wallet':
      Provider = Wallet;
      break;
    case 'Blocked':
      Provider = Blocked;
      break;
    case 'Audio':
      Provider = Audio;
      break;
    case 'Twofactor':
      Provider = Twofactor;
      break;
    case 'Linked':
      Provider = Linked;
      break;
    case 'Terms':
      Provider = TAC;
      break;
    case 'Policy':
      Provider = Policy;
      break;
    case 'Privacy':
      Provider = Policy;
      break;
    case 'About':
      Provider = About;
      break;
    case 'Logout':
      Provider = Logout;
      break;
    case 'Verification':
      Provider = Verification;
      break;
    case 'Trans':
      Provider = Terms;
      break;
    case 'Management':
      Provider = Management;
      break;

    case 'NotificationIcon':
      Provider = NotificationIcon;
      break;
    case 'snapchat':
      Provider = Snapchat;
      break;
    case 'instagram':
      Provider = Insta;
      break;
    case 'Snapchat':
      Provider = Snapchat;
      break;
    case 'twitter':
      Provider = Twitt;
      break;
    case 'youtube':
      Provider = Youtube;
      break;

    case 'chatWindowSettings':
      Provider = ChatWindowSettings;
      break;

    case 'otherProfileShareLink':
      Provider = OtherProfileShareLink;
      break;

    case 'refund':
      Provider = Refund;
      break;

    default:
      Provider = Cam;
  }

  return (
    <View style={[{height: responsiveWidth(8), width: responsiveWidth(8), justifyContent: 'center', alignItems: 'center'}]}>
      <Provider {...props} />
    </View>
  );
};

export default AddSvg;
