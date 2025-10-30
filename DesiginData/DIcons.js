import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const DIcon = ({provider, name, ...props}) => {
  let Provider;

  switch (provider) {
    case 'AntDesign':
      Provider = AntDesign;
      break;
    case 'Entypo':
      Provider = Entypo;
      break;
    case 'EvilIcons':
      Provider = EvilIcons;
      break;
    case 'Feather':
      Provider = Feather;
      break;
    case 'FontAwesome':
      Provider = FontAwesome;
      break;
    case 'FontAwesome5':
      Provider = FontAwesome5;
      break;
    case 'Fontisto':
      Provider = Fontisto;
      break;
    case 'Foundation':
      Provider = Foundation;
      break;
    case 'Ionicons':
      Provider = Ionicons;
      break;
    case 'MaterialCommunityIcons':
      Provider = MaterialCommunityIcons;
      break;
    case 'MaterialIcons':
      Provider = MaterialIcons;
      break;
    case 'Octicons':
      Provider = Octicons;
      break;
    case 'SimpleLineIcons':
      Provider = SimpleLineIcons;
      break;
    case 'FontAwesome6':
      Provider = FontAwesome6;
      break;
    case 'Zocial':
      Provider = Zocial;
      break;
    default:
      Provider = Ionicons;
  }

  return (
    <Provider
      name={name ? name : 'help-outline'}
      color={'#000'}
      size={20}
      {...props}
    />
  );
};

export default DIcon;
