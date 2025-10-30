import {Platform} from 'react-native';
import {responsiveFontSize, responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';

import {OpenGraphParser} from '@sleiv/react-native-opengraph-parser';

import {Dimensions} from 'react-native';
import axios from 'axios';
const {width, height} = Dimensions.get('window');

export const validEmail = email => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

export const audienceFilterMap = {
  1: 'none',
  2: 'subscribers',
  3: 'followers',
};

export const chatRoomSortMap = {
  1: 'recent',
  2: 'old',
  3: 'unread',
};

export const compareObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

function checkThreadEquality(cache, server) {
  console.log(cache[0]?._id, server[0]?._id);
  return cache[0]?._id === server[0]?._id;
}

export function calEqualityAndThreadDifference(cache, server) {
  if (!checkThreadEquality(cache, server)) {
    let indx = server.findIndex(obj => obj._id === cache[0]?._id);

    return server.slice(0, indx);
  } else return [];
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

export const padios = value => {
  if (Platform.OS === 'ios') {
    return value;
  }

  return null;
};

export const twins = (android, ios) => {
  if (Platform.OS === 'ios') {
    return ios;
  } else return android;
};

export const nTwins = (android, ios) => {
  if (Platform.OS === 'ios') {
    return responsiveWidth(ios);
  } else return responsiveWidth(android);
};

export const hTwins = (android, ios) => {
  if (Platform.OS === 'ios') {
    return responsiveHeight(ios);
  } else return responsiveHeight(android);
};

export const nTwinsFont = (android, ios) => {
  if (Platform.OS === 'ios') {
    return responsiveFontSize(ios);
  } else return responsiveFontSize(android);
};

export function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

export function isSingleEmoji(text) {
  const emojiPattern = /^[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F170}-\u{1F251}]$/u;
  return emojiPattern.test(text);
}

export function _filterPostList(filterOf, filterFrom) {
  filterFrom.forEach(x => {
    let index = filterOf.findIndex(y => y._id === x);

    if (index >= 0) {
      filterOf.splice(index, 1);
    }
  });
  return filterOf;
}

export function millisToMinutesAndSeconds(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export const isBetween = (num1, num2, value) => (value > num1 && value < num2) || value > num2;

export function convertAbbreviationToNumber(value) {
  // Remove any commas from the value
  value = value.replace(/,/g, '');

  // Check if the value contains 'K', 'M', or 'B'
  if (typeof value === 'string') {
    if (value.endsWith('K')) {
      // Convert 'K' (thousands) to a number
      return parseFloat(value) * 1000;
    } else if (value.endsWith('M')) {
      // Convert 'M' (millions) to a number
      return parseFloat(value) * 1000000;
    } else if (value.endsWith('B')) {
      // Convert 'B' (billions) to a number
      return parseFloat(value) * 1000000000;
    }
  }

  // If there's no abbreviation, just return the number as is
  return parseFloat(value);
}

export function daysUntil(targetDateString) {
  // Parse the target date
  const targetDate = new Date(targetDateString);
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = targetDate - currentDate;

  // Convert milliseconds to days
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const daysLeft = Math.ceil(differenceInMilliseconds / millisecondsInADay);

  return daysLeft;
}

export async function extractInstaInfo(username) {
  const data = await OpenGraphParser.extractMeta(`https://instagram.com/${username}`);

  // console.log(data);

  if (data?.length > 0) {
    const userInfo = data[0];
    const description = userInfo.description || '';

    const followersMatch = description.match(/([\d,]+) Followers/) || [null, '0'];
    const followingMatch = description.match(/([\d,]+) Following/) || [null, '0'];
    const postsMatch = description.match(/([\d,]+) Posts/) || [null, '0'];

    const nameMatch = description.match(/from (.+?) \(/);
    const usernameMatch = description.match(/\((.+?)\)/);

    const extractedData = {
      name: nameMatch ? nameMatch[1] : 'Unknown', // Extract name
      username: usernameMatch ? usernameMatch[1] : 'Unknown', // Extract username
      followers: followersMatch[1],
      following: followingMatch[1],
      posts: postsMatch[1],
      profilePicture: userInfo.image || 'default_image_url', // Add a default image URL if needed
    };

    return extractedData;
  } else {
    return {};
  }
}

export function selectionTwin() {
  if (Platform.OS === 'android') {
    return '#ffe1cc';
  } else {
    return '#1e1e1e';
  }
}

export function selectionHandleTwin() {
  if (Platform.OS === 'android') {
    return '#ffa86b';
  } else {
    return '#1e1e1e';
  }
}

export const validateEmail = email => {
  const MAX_EMAIL_LENGTH = 254;

  // Check 1: Ensure email is not empty
  if (!email || email.trim() === '') {
    return {isValid: false, message: 'Email cannot be empty.'};
  }

  // Check 2: Ensure email is within the maximum length
  if (email.length > MAX_EMAIL_LENGTH) {
    return {isValid: false, message: `Email cannot exceed ${MAX_EMAIL_LENGTH} characters.`};
  }

  // Check 3: Ensure email contains exactly one "@" symbol
  const atSymbolCount = (email.match(/@/g) || []).length;
  if (atSymbolCount !== 1) {
    return {isValid: false, message: 'Email must contain exactly one "@" symbol.'};
  }

  // Check 4: Ensure email does not contain spaces
  if (/\s/.test(email)) {
    return {isValid: false, message: 'Email cannot contain spaces.'};
  }

  // Check 5: Ensure email does not contain `%` or `&`
  if (email.includes('%') || email.includes('&')) {
    return {isValid: false, message: 'Email cannot contain "%" or "&".'};
  }

  // Check 6: Validate standard email format (e.g., user@example.com)
  const standardEmailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check 7: Validate email with IP address format (e.g., user123@[192.168.1.1])
  const ipEmailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@\[(\d{1,3}\.){3}\d{1,3}\]$/;

  if (!standardEmailRegex.test(email) && !ipEmailRegex.test(email)) {
    return {isValid: false, message: 'Please enter a valid email address.'};
  }

  // If all checks pass
  return {isValid: true, message: 'Email is valid.'};
};

/**
 * Converts a static font size to a responsive font size based on screen width.
 * @param {number} size - The static font size (e.g., 20).
 * @returns {number} - The responsive font size.
 */
export const getResponsiveFontSize = size => {
  return responsiveFontSize((size / 375) * 100);
};

const FONT_SIZES = {
  10: responsiveFontSize(1.25),
  12: responsiveFontSize(1.5),
  14: responsiveFontSize(1.75),
  14: responsiveWidth(3.73),
  16: responsiveWidth(4.27),
  20: responsiveFontSize(2.34),
  21: responsiveWidth(5.6),
  24: responsiveWidth(6.4),
  32: responsiveWidth(8.53),
  40: responsiveWidth(10.67),
  45.93: responsiveWidth(12.26),
  50: responsiveWidth(13.33),
  52: responsiveWidth(13.87),
  56: responsiveWidth(14.93),
  73: responsiveWidth(19.47),
  16: responsiveFontSize(2),
  18: responsiveFontSize(2.25),
  20: responsiveFontSize(2.5),
  22: responsiveFontSize(2.75),
  24: responsiveFontSize(3),
};

const WIDTH_SIZES = {
  1.5: responsiveWidth(0.4),
  2: responsiveWidth(0.53),
  4: responsiveWidth(1.07),
  8: responsiveWidth(2.13),
  9: responsiveWidth(2.4),
  10: responsiveWidth(2.67),
  12: responsiveWidth(3.2),
  14: responsiveWidth(3.73),
  16: responsiveWidth(4.27),
  18: responsiveWidth(4.8),
  19: responsiveWidth(5.07),
  20: responsiveWidth(5.33),
  24: responsiveWidth(6.12),
  32: responsiveWidth(8.5),
  36: responsiveWidth(9.6),
  84: responsiveWidth(21.54),
  136: responsiveWidth(36.27),
  150: responsiveWidth(40),
  154: responsiveWidth(41.07),
  208: responsiveWidth(50.6),
  214: responsiveWidth(57.07),
  281: responsiveWidth(74.93),
  284: responsiveWidth(75.73),
  345: responsiveWidth(92),
};

export {FONT_SIZES, WIDTH_SIZES};

export function extractUsernameFromDeepLink(url) {
  try {
    // 1. Extract the `link` parameter manually
    const paramsPart = url.split('?')[1];
    if (!paramsPart) {
      console.log('No query parameters found in the URL');
      return null;
    }

    const params = paramsPart.split('&');
    let linkValue = '';

    for (const param of params) {
      const [key, value] = param.split('=');
      if (key === 'link') {
        linkValue = decodeURIComponent(value);
        break;
      }
    }

    if (!linkValue) {
      console.log('No "link" parameter found in the URL');
      return null;
    }

    // 2. Extract the username from the link
    if (linkValue.includes('/profile/')) {
      const profilePart = linkValue.split('/profile/')[1];
      const username = profilePart.split('?')[0];
      return username; // Returns the extracted username (e.g., "Tiwree")
    } else {
      console.log('No "/profile/" segment found in the link');
      return null;
    }
  } catch (error) {
    console.error('Error extracting username:', error);
    return null;
  }
}

export const extractUserNameAndroid = url => {
  console.log('hello there thi si em atul', url);
  const regex = /\/profile\/([^/?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export function extractUserIdFromUrl(url) {
  const match = url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : null;
}

export function isVersionGreaterOrEqual(v1, v2) {
  const toNumbers = v => v.split('.').map(Number);

  const [a1, b1, c1] = toNumbers(v1);
  const [a2, b2, c2] = toNumbers(v2);

  if (a1 !== a2) return a1 > a2;
  if (b1 !== b2) return b1 > b2;
  return c1 >= c2;
}

export const joinLivestream = async (token, roomId) => {
  console.log('TOKEN', token);
  try {
    const response = await axios.get(`https://api.fahdu.in/api/stream/livestream/join?roomId=${roomId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle the error - you can return the error response data
    if (error.response) {
      // Server responded with error status
      return error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      return {error: 'No response from server'};
    } else {
      // Something else went wrong
      return {error: error.message};
    }
  }
};
