import { PermissionsAndroid, Platform } from 'react-native'


export const checkApplicationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      let x = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return x;
    } catch (error) {
      console.log("Permisson Error", error.message)
    }
  }
}