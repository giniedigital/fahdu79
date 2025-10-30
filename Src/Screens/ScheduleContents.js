import React, {useCallback, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {FONT_SIZES} from '../../DesiginData/Utility';
import {Image} from 'expo-image';
import DIcon from '../../DesiginData/DIcons';
import {useDeleteScheduledPostMutation, useLazyGetScheduledPostsQuery} from '../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi';
import {useSelector} from 'react-redux';
import {chatRoomSuccess, LoginPageErrors} from '../Components/ErrorSnacks';
import {autoLogout} from '../../AutoLogout';
import Moment from 'react-moment';
import {useFocusEffect} from '@react-navigation/native';

const initialScheduleContents = [
  {
    id: '1',
    user: {
      name: 'Hiiiiiiii Guyzzzzzzzzzzzzzz',
      avatar: 'https://via.placeholder.com/50', // Replace with actual image URL
    },
    date: '10 April 2025 At 6:40 PM',
  },
  {
    id: '2',
    user: {
      name: 'Holi hai',
      avatar: '',
    },
    date: '01 April 2025 At 11:40 PM',
  },
];

const ScheduleContents = () => {
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const token = useSelector(state => state.auth.user.token);

  const [getScheduledPosts] = useLazyGetScheduledPostsQuery();

  const [deleteScheduledPost] = useDeleteScheduledPostMutation();

  useFocusEffect(
    useCallback(() => {
      const getAllScheduledContent = async () => {
        const {data, error} = await getScheduledPosts({token});
        console.log(data?.data, '::::');

        if (error) {
          if (error?.data?.status_code === 401) {
            autoLogout();
            return;
          } else {
            LoginPageErrors(error?.data?.message);
          }
        }

        if (data) {
          setData(data?.data);
        }
      };

      getAllScheduledContent();
    }, []),
  );

  const handleLongPress = id => {
    setSelectedId(id === selectedId ? null : id);
  };


  const handleDelete = async (id) => {
    try {
      // API Call First
      const response = await deleteScheduledPost({ token, data: { postId: id } });
  
      // Check for Errors
      if (response?.error) {
        return LoginPageErrors(response.error?.data?.message);
      }
  
      // Update UI Only if API Call is Successful
      setData((prevData) => prevData.filter((item) => item._id !== id));
      setSelectedId(null);
  
      chatRoomSuccess("Successfully deleted scheduled post!");
    } catch (err) {
      console.error("Delete Error:", err);
      LoginPageErrors("Failed to delete scheduled post.");
    }
  };
  

  const handlePress = id => {
    if (selectedId === id) {
      setSelectedId(null); // Unselect if already selected
    }
  };

  const renderItem = ({item}) => {
    const isSelected = item._id === selectedId;

    return (
      <TouchableOpacity style={[styles.eachCardContainer, isSelected && styles.selectedItem]} onPress={() => handlePress(item._id)} onLongPress={() => handleLongPress(item._id)}>
        <View style={[styles.itemContainer]}>
          <View style={styles.leftContainer}>
            {isSelected ? (
              // <IonIcon name="checkmark-circle" size={24} color="#FF5733" style={styles.checkIcon} />
              <View style={styles.checkIcon}>
                <DIcon provider={'FontAwesome6'} name={'check'} size={18} color="#1e1e1e" />
              </View>
            ) : (
              <View style={styles.avatar}>
                <Image source={{uri: item?.post_content_files[0]?.url}} style={{flex: 1}} />
              </View>
            )}
            <View>
              <Text style={styles.username}>{item.postContent ? item.postContent : 'No post description added'}</Text>
              <Text style={styles.dateText}>
                {`Post scheduled `}
                <Moment style={styles.timiming} element={Text} fromNow>
                  {item?.activate_on}
                </Moment>
              </Text>
            </View>
          </View>
          {isSelected && (
            <TouchableOpacity onPress={() => handleDelete(item?._id)}>
              <DIcon style={{marginLeft: 20}} provider={'AntDesign'} name="delete" size={20} color="#1e1e1e" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={data} keyExtractor={item => item.id} renderItem={renderItem} ItemSeparatorComponent={() => <View style={{height: 1.5, backgroundColor: '#E9E9E9'}} />} />
      <Text style={styles.footerText}>Long Press to Delete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedItem: {
    backgroundColor: '#FFA86B33',

    borderTopColor: '#FFA86B',
    borderBottomColor: '#FFA86B',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50, // Ensure it’s a square
    height: 50,
    borderRadius: 12, // Prevent circular cropping
    resizeMode: 'cover', // Remove any border space
    marginRight: 15,
    borderWidth: 1.5,
    borderColor: '#1e1e1e',
    overflow: 'hidden',
  },

  checkIcon: {
    marginRight: 15,
    backgroundColor: '#FFA86B',
    borderRadius: 12,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF8733',
  },
  username: {
    fontSize: FONT_SIZES[16],
    fontFamily: 'Rubik-SemiBold',
    color: '#1e1e1e',
  },
  dateText: {
    fontSize: FONT_SIZES[12],
    color: '#1e1e1e',
    fontFamily: 'Rubik-Regular',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#777',
    marginTop: 20,
  },
  eachCardContainer: {
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
});

export default ScheduleContents;
