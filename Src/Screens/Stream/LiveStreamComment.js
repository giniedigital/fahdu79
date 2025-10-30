import React, {memo} from 'react';
import {View} from 'react-native';
import TippedBadge from './Comments/TippedBadge';
import GoalCompletedBadge from './Comments/GoalCompletedBadge';
import JoindBadge from './Comments/JoindBadge';
import UserChatBadge from './Comments/UserChatBadge';
import CreatorChatBadge from './Comments/CreatorChatBadge';

const LiveStreamComment = memo(({isStarting, item, currentUserDisplayName}) => {
  const {type, title, displayName, message, amount, profile_image, role} = item;

  console.log(item?.role)

  if (type === 'completed') {
    return <GoalCompletedBadge goal={title} />;
  }

  if (type === 'new_user') {
    return <JoindBadge name={displayName} profilePic={profile_image || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_6.png'} role = {role} />;
  }

  // const normalizedCurrentUser = (currentUserDisplayName || '').trim().toLowerCase();
  // const normalizedDisplayName = (displayName || '').trim().toLowerCase();


  return (
    <View style={styles.container}>
      {amount ? (
        <TippedBadge amount={amount} name={displayName} profilePic={profile_image || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png'} role = {role}/>
      ) : item?.role !== 'creator' ? (
        <UserChatBadge message={message} name={displayName} profilePic={profile_image?.url || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_0.png'} />
      ) : (
        <CreatorChatBadge message={message} name={displayName} profilePic={profile_image?.url || 'https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png'} />
      )}
    </View>
  );
});

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
};

export default LiveStreamComment;
