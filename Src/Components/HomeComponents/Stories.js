import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React, { memo, useCallback } from "react";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { FlatList } from "react-native-gesture-handler";
import { nTwins, nTwinsFont } from "../../../DesiginData/Utility";
import DIcon from "../../../DesiginData/DIcons";
import { useSelector } from "react-redux";
import { useLazyJoinLiveStreamQuery } from "../../../Redux/Slices/QuerySlices/chatWindowAttachmentSliceApi";
import { token as memoizedToken } from "../../../Redux/Slices/NormalSlices/AuthSlice";
import { navigate } from "../../../Navigation/RootNavigation";
import { ChatWindowError } from "../ErrorSnacks";
const data = {
  followingsStory: [
    {
      _id: {
        _id: "6454ce1d90254d526edb9720",
        fullName: "Carson Clawsley",
        displayName: "c_creator",
        profile_image: {
          url: "https://fahdu.s3.ap-south-1.amazonaws.com/profile/c_creator_1707741827454_1707741827454-1707741827454.jpg",
          type: "profile",
        },
        is_live: true,
        streamUrl: "https://app.fahdu.com/live/c62799e9-ea7a-4f52-91f1-c25c27eaa9ca",
      },
      timeStamp: "2024-03-30T14:48:41.640Z",
      storyData: [],
    },
    {
      _id: {
        _id: "6454ccfd90254d526edb95ef",
        fullName: "Rikki Wiltsher",
        displayName: "b_creator",
        profile_image: {
          url: "https://fahdu.s3.ap-south-1.amazonaws.com/profile/b_creator_1707392794886_1707392794886-1707392794886.jpeg",
          type: "profile",
        },
        is_live: true,
        streamUrl: "https://app.fahdu.com/live/1b22f97c-a618-4b66-9378-e6fbe6ee40b5",
      },
      timeStamp: "2024-04-01T12:46:38.951Z",
      storyData: [],
    },
  ],
};

const Stories = () => {
  const storiesData = useSelector((state) => state.stories.data.liveStory);

  const [joinLiveStream] = useLazyJoinLiveStreamQuery();

  const token = useSelector(state => state.auth.user.token)

  const handleJoinStream = useCallback(async (url) => {
    let roomId = url.split("/").at(-1);

    const { error, data } = await joinLiveStream({ token, roomId });


    

    if (error?.data?.statusCode === 400) {
      ChatWindowError("Hey!, Livestream has ended");
      return;
    }

    navigate("confirmlivestreamjoin", { data: data?.data, roomId });
  }, []);

  const Story = memo(({ item }) => (
    <View style={{width:'100%'}}>
      <Pressable style={styles.eachStoriesContainer} onPress={() => handleJoinStream(item._id.streamUrl)}>
     

     <View style={styles.eachStory}>
       <View style={{ height: nTwins(19.5, 18.5),
   width: nTwins(19.5, 18.5),borderWidth:responsiveWidth(.5),borderRadius:responsiveWidth(4)}}>
       <Image source={{ uri: item?._id?.profile_image?.url }} style={styles.storyProfilePicture} />

       </View>
       <View style={styles.live}>
       <Text style={styles.liveText}>LIVE</Text>
     </View>
       
     </View>
     <View style={styles.smallArea}>
         <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
           {item?._id?.displayName}
         </Text>
         <DIcon provider={"MaterialIcons"} name={"verified"} color="#FFA07A" size={nTwins(4, 4)} />
       </View>
  
   </Pressable>
        {/* <View style={{borderBottomWidth:responsiveWidth(1),height:responsiveWidth(2),width:responsiveWidth(100),borderColor:'#E9E9E9',marginTop:responsiveWidth(-4)}}></View> */}
    </View>
    
  ));

  return (
    <View style={styles.storiesContainer}>
      <FlatList data={storiesData} renderItem={({ item, index }) => <Story item={item} />} horizontal ItemSeparatorComponent={() => <View style={{ width: responsiveWidth(2) }} />} />
    </View>
  );
};

export default memo(Stories);

const styles = StyleSheet.create({
  storiesContainer: {
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    borderColor: "#f3f3f3",
    // paddingTop: responsiveWidth(2),
    position: "relative",
    marginBottom:responsiveWidth(-6),
    // marginTop:responsiveWidth(-6)
    paddingHorizontal:responsiveWidth(2)
  },

  live: {
    position: "absolute",
    left: responsiveWidth(2.5),
    top: responsiveWidth(14),
   
    backgroundColor: "#f3f3f3",
    justifyContent: "center",
    alignItems: "center",
    height: responsiveWidth(5),
    width:responsiveWidth(15),
    borderRadius: responsiveWidth(3),
    borderWidth:responsiveWidth(.3),
    zIndex: 3,
  
  },

  liveText: {
    fontFamily: "Rubik-Medium",
    fontSize: responsiveFontSize(1.3),
    color:'black'

  },
  eachStoriesContainer: {
    height: responsiveWidth(44),
    width: responsiveWidth(28),
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  eachStory: {
    height: responsiveWidth(22),
    width: responsiveWidth(22),
    borderWidth: 2,
    borderRadius: responsiveWidth(4),
    borderStyle:'dashed',
    // position: "relative",
    alignItems:'center',
    justifyContent:'center',
    overflow: "hidden",
     borderColor : "#484848",
     flexDirection:'column'
  },

  storyProfilePicture: {
    height: nTwins(18.5, 18.5),
    width: nTwins(18.5, 18.5),
    resizeMode: "contain",
    // top:responsiveWidth(1),
    // marginRight: responsiveWidth(1),
    // bottom: responsiveWidth(8),
    // right: "auto",
    zIndex: 3,
    borderRadius: responsiveWidth(4),
    // borderWidth:responsiveWidth(1),
   
    // borderWidth : 4
  },
  smallArea: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    top:responsiveWidth(1)
  //  backgroundColor:'red',
  //  top:responsiveWidth(3),
  //  left:responsiveWidth(5)
 
  },
  text: {
    fontFamily: "Rubik-Medium",
    color: "black",
    fontSize: nTwinsFont(1.6, 1.6),
    // width: responsiveWidth(10),
    // height:responsiveWidth(10),
    // borderWidth: 1,
  },
});
